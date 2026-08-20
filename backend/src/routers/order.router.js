import express from "express";
const router = express.Router();
import { createOrder, getOrders, getOrderById, cancelOrder } from "../controllers/order.controller.js";
import { protect, protectAdmin, authorize } from "../middleware/auth.js";

router.post("/create", protect, createOrder);
router.get("/", protectAdmin, authorize("admin", "superAdmin"), getOrders);
router.get("/user/:userId", protect, getOrders);
router.patch("/:id/cancel", protectAdmin, authorize("admin", "superAdmin"), cancelOrder);
router.get("/:id", protectAdmin, authorize("admin","superAdmin"), getOrderById);

export default router;
