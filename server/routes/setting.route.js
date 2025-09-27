import express from "express";
import { createSetting, getAllSetting, getSettingById, updateSetting, deleteSetting } from "../controllers/setting.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/create-setting", verifyAdmin,  createSetting);
router.get("/get-all-setting", getAllSetting);
router.get("/get-single-setting/:id", getSettingById);
router.put("/update-setting/:id", verifyAdmin,  updateSetting);
router.delete("/delete-setting/:id", verifyAdmin, deleteSetting);

export default router;
