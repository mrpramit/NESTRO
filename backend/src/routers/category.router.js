import express from "express";
const router = express.Router();
import {get, create, deleteById, statusUpdate, getById, updateById} from "../controllers/category.controller.js";
import upload from "../middleware/multer.js";
import { protectAdmin, authorize } from "../middleware/auth.js";

router.get("/",get);
router.post("/create", protectAdmin, authorize("admin", "superAdmin"), upload.single("image"),create);
router.delete("/delete/:id", protectAdmin, authorize("admin", "superAdmin"),deleteById);
router.put("/status-update/:id", protectAdmin, authorize("admin", "superAdmin"),statusUpdate);
router.get("/:id",getById);
router.put("/update/:id", protectAdmin, authorize("admin", "superAdmin"), upload.single("image"), updateById);

export default router;