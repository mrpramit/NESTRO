import express from "express";
const router = express.Router();
import { register, verifyOtp, resendOtp, forgotPassword, resetPassword, login, adminLogin, logout, adminLogout, getProfile, updateProfile, addAddress, deleteAddress, setDefaultAddress, deleteAccount, sendOrderEmail, getAllUsers, getUserById, updateUserById, deleteUserById } from "../controllers/user.controller.js";
import { protect, protectAdmin, authorize } from "../middleware/auth.js";
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/logout", logout);
router.post("/admin-logout", adminLogout);
router.post("/send-order-email", sendOrderEmail);
router.get("/profile", protect, getProfile);
router.put("/profile/update", protect, updateProfile);
router.delete("/profile/delete", protect, deleteAccount);
router.post("/address/add", protect, addAddress);
router.delete("/address/delete/:addressId", protect, deleteAddress);
router.patch("/address/default/:addressId", protect, setDefaultAddress);
router.get("/admin-profile", protectAdmin, authorize("admin", "superAdmin"), getProfile);
router.put("/admin-profile/update", protectAdmin, authorize("admin", "superAdmin"), updateProfile);
router.delete("/admin-profile/delete", protectAdmin, authorize("admin", "superAdmin"), deleteAccount);
router.post("/admin-profile/address/add", protectAdmin, authorize("admin", "superAdmin"), addAddress);
router.delete("/admin-profile/address/delete/:addressId", protectAdmin, authorize("admin", "superAdmin"), deleteAddress);
router.patch("/admin-profile/address/default/:addressId", protectAdmin, authorize("admin", "superAdmin"), setDefaultAddress);

// Admin user management
router.get("/", protectAdmin, authorize("admin","superAdmin"), getAllUsers);
router.get("/:id", protectAdmin, authorize("admin","superAdmin"), getUserById);
router.put("/:id", protectAdmin, authorize("admin","superAdmin"), updateUserById);
router.delete("/:id", protectAdmin, authorize("admin","superAdmin"), deleteUserById);

export default router
