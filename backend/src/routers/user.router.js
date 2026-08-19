import express from "express";
const router = express.Router();
import { register, verifyOtp, resendOtp, login, getProfile, updateProfile, addAddress, deleteAddress, setDefaultAddress, deleteAccount, sendOrderEmail } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/send-order-email", sendOrderEmail);
router.get("/profile", protect, getProfile);
router.put("/profile/update", protect, updateProfile);
router.delete("/profile/delete", protect, deleteAccount);
router.post("/address/add", protect, addAddress);
router.delete("/address/delete/:addressId", protect, deleteAddress);
router.patch("/address/default/:addressId", protect, setDefaultAddress);

export default router