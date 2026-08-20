import express from "express";
const router = express.Router();
import { create, get, deleteById, StatusUpdate, getById, update, StatusById, addImages } from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";
import { protectAdmin, authorize } from "../middleware/auth.js";

router.get("/", get);
router.post("/create", protectAdmin, authorize("admin", "superAdmin"), upload.fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 4 }]), create);
router.patch("/status-update/:id", protectAdmin, authorize("admin", "superAdmin"), StatusUpdate);
router.put("/update/:id", protectAdmin, authorize("admin", "superAdmin"), upload.fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 4 }]), update);
router.delete("/delete/:id", protectAdmin, authorize("admin", "superAdmin"), deleteById);
router.get("/:id", getById);
router.patch("/status/:id", protectAdmin, authorize("admin", "superAdmin"), StatusById);
router.post("/add-multiple-images", protectAdmin, authorize("admin", "superAdmin"), upload.array("images", 4), addImages);


export default router