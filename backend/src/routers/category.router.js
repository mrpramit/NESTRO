import express from "express";
const router = express.Router();
import {get, create, deleteById, statusUpdate, getById, updateById} from "../controllers/category.controller.js";
import upload from "../middleware/multer.js";

router.get("/",get);
router.post("/create", upload.single("image"),create);
router.delete("/delete/:id",deleteById);
router.put("/status-update/:id",statusUpdate);
router.get("/:id",getById);
router.put("/update/:id", upload.single("image"), updateById);

export default router;