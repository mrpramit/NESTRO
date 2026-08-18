import express from "express";
const router = express.Router();
import { create, get, deleteById, StatusUpdate, getById, update, StatusById, addImages } from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";

router.get("/", get);
router.post("/create", upload.fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 4 }]), create);
router.patch("/status-update/:id", StatusUpdate);
router.put("/update/:id", upload.fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 4 }]), update);
router.delete("/delete/:id", deleteById);
router.get("/:id", getById);
router.patch("/status/:id", StatusById);
router.post("/add-multiple-images", upload.array("images", 4), addImages);


export default router