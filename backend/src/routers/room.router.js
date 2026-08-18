import express from "express";
const router = express.Router();
import {get, create, deleteById, statusUpdate, getById, updateById} from "../controllers/room.controller.js";

router.get("/",get);
router.post("/create",create);
router.delete("/delete/:id",deleteById);
router.put("/status-update/:id",statusUpdate);
router.get("/:id",getById);
router.put("/update/:id",updateById);

export default router;