import UserModel from "../models/user.models.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"
import sendOtpMail from "../utils/sendOtpMail.js";
import Cryptr from "cryptr";
const cryptr = new Cryptr(process.env.API_SECRET);
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await UserModel.findOne({ email });
        console.log(user)
        if (user) return sendConflict(res, "User already exists");
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = Date.now() + 3 * 60 * 1000;    //3 minutes
        const passwordHash = cryptr.encrypt(password);
        await UserModel.create({ name, email, password: passwordHash, otp, otpExpire });
        const mailResponse = await sendOtpMail(email, otp);
        console.log(mailResponse, "mailResponse")
        if (mailResponse.includes("failed")) {
            return sendServerError(res, "OTP email could not be sent.");
}
        return res.status(201).json(
            {
                user: email,
                success: true,
                message: "User registered successfully. Please check your email for OTP verification."
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
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return sendConflict(res, "User not found");
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = Date.now() + 3 * 60 * 1000;
        const mailReponse = await sendOtpMail(email, otp);
        // console.log(mailReponse, "mailResponse")
        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();
        return sendSuccess(res, "OTP resent successfully. Please check your email.");
    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
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
        //Send Cookie
        const token = generateToken(user._id);
        res.cookie('jwt', token, {
            maxAge: 900000, // Expires after 15 minutes (in milliseconds)
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: false, // Sent over HTTPS only in production
            sameSite: 'lax'  // Protects against CSRF attacks
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
        return res.status(200).json({ success: true, message: "User profile fetched successfully",  user: user });
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
    login,
    getProfile,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    deleteAccount,
    sendOrderEmail
}