import UserModel from "../models/user.models.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"
import sendOtpMail from "../utils/sendOtpMail.js";
import Cryptr from "cryptr";
import crypto from "crypto";
const cryptr = new Cryptr(process.env.API_SECRET);
import generateToken from "../utils/generateToken.js";
import sendPasswordResetMail from "../utils/sendPasswordResetMail.js";

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!name?.trim() || !normalizedEmail || !password) {
            return sendBadRequest(res, "Name, email, and password are required");
        }

        const user = await UserModel.findOne({ email: normalizedEmail });
        if (user?.isVerified) return sendConflict(res, "User already exists");

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = Date.now() + 3 * 60 * 1000;    //3 minutes
        let registeredUser = user;
        let isNewUser = false;

        if (registeredUser) {
            // An earlier OTP attempt was interrupted. Refresh it instead of trapping
            // the customer behind a duplicate-email error.
            registeredUser.otp = otp;
            registeredUser.otpExpire = otpExpire;
            await registeredUser.save();
        } else {
            const passwordHash = cryptr.encrypt(password);
            registeredUser = await UserModel.create({
                name: name.trim(),
                email: normalizedEmail,
                password: passwordHash,
                otp,
                otpExpire,
            });
            isNewUser = true;
        }

        const mailResponse = await sendOtpMail(normalizedEmail, otp);
        const mailSent = typeof mailResponse === "string" && !mailResponse.toLowerCase().includes("failed");

        if (!mailSent) {
            // Do not leave a newly registered user unable to retry after a mail outage.
            if (isNewUser) {
                await UserModel.deleteOne({ _id: registeredUser._id });
            }
            return sendServerError(res, "OTP email could not be sent.");
        }

        return res.status(201).json(
            {
                user: normalizedEmail,
                success: true,
                message: user
                    ? "A fresh OTP has been sent. Please check your email for verification."
                    : "User registered successfully. Please check your email for OTP verification."
            }
        );


    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }

}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return sendConflict(res, "User not found");
        if (user.otp != otp) return sendConflict(res, "Invalid OTP");
        if (Date.now() > user.otpExpire) return sendConflict(res, "OTP expired");
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();
        return sendSuccess(res, "User verified successfully.");
    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }

}


const resendOtp = async (req, res) => {
    try {
        const normalizedEmail = req.body.email?.trim().toLowerCase();
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) return sendConflict(res, "User not found");
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = Date.now() + 3 * 60 * 1000;
        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();
        const mailResponse = await sendOtpMail(normalizedEmail, otp);
        const mailSent = typeof mailResponse === "string" && !mailResponse.toLowerCase().includes("failed");
        if (!mailSent) return sendServerError(res, "OTP email could not be sent.");
        return sendSuccess(res, "OTP resent successfully. Please check your email.");
    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }
}

const forgotPassword = async (req, res) => {
    try {
        const normalizedEmail = req.body.email?.trim().toLowerCase();
        if (!normalizedEmail) return sendBadRequest(res, "Email is required");

        const user = await UserModel.findOne({ email: normalizedEmail });
        // Keep this response identical for unknown email addresses.
        if (!user) return sendSuccess(res, "If an account exists for this email, a reset link has been sent.");

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const clientUrl = (process.env.FRONTEND_URL || "https://nestro-khaki.vercel.app").replace(/\/$/, "");
        const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
        const mailResponse = await sendPasswordResetMail(normalizedEmail, resetUrl);
        const mailSent = typeof mailResponse === "string" && !mailResponse.toLowerCase().includes("failed");

        if (!mailSent) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            return sendServerError(res, "Password reset email could not be sent.");
        }

        return sendSuccess(res, "If an account exists for this email, a reset link has been sent.");
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return sendBadRequest(res, "Reset token and new password are required");
        if (password.length < 6) return sendBadRequest(res, "Password must be at least 6 characters");

        const passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await UserModel.findOne({
            passwordResetToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) return sendBadRequest(res, "This password reset link is invalid or has expired.");

        user.password = cryptr.encrypt(password);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return sendSuccess(res, "Password reset successfully. You can now sign in.");
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return sendConflict(res, "User not found");
        const decryptedPassword = cryptr.decrypt(user.password);

        if (decryptedPassword != password) return sendConflict(res, "Invalid credentials");
        if (!user.isVerified) return sendConflict(res, "Please verify your email before logging in");
        if (user.status === false) {
            return res.status(403).json({ success: false, message: "Account is inactive. Contact support." });
        }
        if (user.role === "admin" || user.role === "superAdmin") {
            return res.status(403).json({ success: false, message: "Admin accounts must use the admin portal." });
        }
        //Send Cookie
        const token = generateToken(user._id);
        res.cookie('jwt', token, {
            maxAge: 900000, // Expires after 15 minutes (in milliseconds)
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        return sendSuccess(res, "Login successful", { user });
    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }
}

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return sendConflict(res, "User not found");
        // Try to include order history if Orders model exists
        let orders = [];
        try {
            const mod = await import("../models/order.models.js");
            const OrderModel = mod.default;
            if (OrderModel) {
                orders = await OrderModel.find({ userId: user._id }).sort({ createdAt: -1 });
            }
        } catch (err) {
            orders = [];
        }

        return res.status(200).json({ success: true, message: "User profile fetched successfully", user: user, orders });
    }
    catch (error) {
        console.log(error, "error")

        sendServerError(res, "Internal Server Error")
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, mobile } = req.body;
        const user = await UserModel.findById(req.user._id);
        if (!user) return sendNotFound(res, "User not found");
        if (name) user.name = name;
        if (mobile !== undefined) user.mobile = mobile;
        await user.save();
        const updatedUser = await UserModel.findById(user._id).select("-password -otp -otpExpire -isVerified -createdAt -updatedAt -__v");
        return sendSuccess(res, "Profile updated successfully", { user: updatedUser });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const addAddress = async (req, res) => {
    try {
        const { fullName, mobile, pincode, addressLine, city, state, country, isDefault } = req.body;
        const user = await UserModel.findById(req.user._id);
        if (!user) return sendNotFound(res, "User not found");

        const newAddress = { fullName, mobile, pincode, addressLine, city, state, country: country || "India", isDefault: !!isDefault };
        
        if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        } else if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();
        const updatedUser = await UserModel.findById(user._id).select("-password -otp -otpExpire -isVerified -createdAt -updatedAt -__v");
        return sendSuccess(res, "Address added successfully", { user: updatedUser });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await UserModel.findById(req.user._id);
        if (!user) return sendNotFound(res, "User not found");

        const addressToDelete = user.addresses.find(addr => addr._id.toString() === addressId);
        if (!addressToDelete) return sendNotFound(res, "Address not found");

        const wasDefault = addressToDelete.isDefault;
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        const updatedUser = await UserModel.findById(user._id).select("-password -otp -otpExpire -isVerified -createdAt -updatedAt -__v");
        return sendSuccess(res, "Address deleted successfully", { user: updatedUser });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await UserModel.findById(req.user._id);
        if (!user) return sendNotFound(res, "User not found");

        let found = false;
        user.addresses.forEach(addr => {
            if (addr._id.toString() === addressId) {
                addr.isDefault = true;
                found = true;
            } else {
                addr.isDefault = false;
            }
        });

        if (!found) return sendNotFound(res, "Address not found");

        await user.save();
        const updatedUser = await UserModel.findById(user._id).select("-password -otp -otpExpire -isVerified -createdAt -updatedAt -__v");
        return sendSuccess(res, "Default address updated", { user: updatedUser });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const deleteAccount = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (!user) return sendNotFound(res, "User not found");

        await UserModel.findByIdAndDelete(req.user._id);
        res.clearCookie('jwt');
        return sendSuccess(res, "Account deleted successfully");
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

import sendOrderConfirmationMail from "../utils/sendOrderConfirmationMail.js";

const sendOrderEmail = async (req, res) => {
    try {
        const { email, orderData } = req.body;
        if (!email || !orderData) {
            return sendBadRequest(res, "Email and order data are required");
        }

        const result = await sendOrderConfirmationMail(email, orderData);
        if (result.success) {
            return sendSuccess(res, "Order confirmation email sent successfully", result);
        } else {
            return sendServerError(res, "Failed to send order email: " + result.error);
        }
    } catch (error) {
        console.log("Send Order Email Error:", error);
        sendServerError(res, "Internal Server Error");
    }
};

export {
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    login,
    adminLogin,
    logout,
    adminLogout,
    getProfile,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    deleteAccount,
    sendOrderEmail,
    // Admin controllers
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}

// Admin controllers
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password -otp -otpExpire -__v").sort({ createdAt: -1 });
        return sendSuccess(res, "Users fetched successfully", { users });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).select("-password -otp -otpExpire -__v");
        if (!user) return sendNotFound(res, "User not found");

        // Try to include order history if Orders model exists
        let orders = [];
        try {
            const mod = await import("../models/order.models.js");
            const OrderModel = mod.default;
            if (OrderModel) {
                orders = await OrderModel.find({ userId: id }).sort({ createdAt: -1 });
            }
        } catch (err) {
            // Orders model not present or error fetching orders — ignore and continue
            orders = [];
        }

        return sendSuccess(res, "User fetched successfully", { user, orders });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobile, role, status } = req.body;
        const user = await UserModel.findById(id);
        if (!user) return sendNotFound(res, "User not found");
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (mobile !== undefined) user.mobile = mobile;
        if (role !== undefined) user.role = role;
        if (status !== undefined) user.status = status;
        await user.save();
        const updatedUser = await UserModel.findById(id).select("-password -otp -otpExpire -__v");
        return sendSuccess(res, "User updated successfully", { user: updatedUser });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) return sendNotFound(res, "User not found");
        await UserModel.findByIdAndDelete(id);
        return sendSuccess(res, "User deleted successfully");
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return sendConflict(res, "User not found");
        const decryptedPassword = cryptr.decrypt(user.password);

        if (decryptedPassword != password) return sendConflict(res, "Invalid credentials");
        if (!user.isVerified) return sendConflict(res, "Please verify your email before logging in");
        if (user.status === false) {
            return res.status(403).json({ success: false, message: "Account is inactive. Contact support." });
        }
        if (user.role !== "admin" && user.role !== "superAdmin") {
            return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
        }

        const token = generateToken(user._id);
        res.cookie("admin_jwt", token, {
            maxAge: 900000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return sendSuccess(res, "Admin login successful", { user });
    } catch (error) {
        console.log(error, "error");
        sendServerError(res, "Internal Server Error");
    }
}

const logout = (req, res) => {
    res.clearCookie("jwt");
    return sendSuccess(res, "Logged out successfully");
};

const adminLogout = (req, res) => {
    res.clearCookie("admin_jwt");
    return sendSuccess(res, "Admin logged out successfully");
};
