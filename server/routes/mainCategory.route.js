import express from "express";
import {
    createMainCategory,
    getAllMainCategories,
    getMainCategoryById,
    updateMainCategory,
    deleteMainCategory,
    multipleMainCategory,
    uploadAllLevelCategory,
    updateCategoryStatus
} from "../controllers/mainCategory.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { upload, uploadImages } from "../middlewares/multer.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHadler.middleware.js";
const router = express.Router();

router.post("/create-mainCategory", verifyAdmin, upload.fields([{ name: "image", maxCount: 1 },]), multerErrorHandler, createMainCategory);
router.get("/get-all-mainCategories", getAllMainCategories);
router.get("/get-single-mainCategory/:id", getMainCategoryById);
router.put("/update-mainCategory/:id", verifyAdmin,upload.fields([{ name: "image", maxCount: 1 },]), multerErrorHandler, updateMainCategory);
router.delete("/delete-mainCategory/:id", verifyAdmin, deleteMainCategory);
router.post("/multiple-main-categories", verifyAdmin, multipleMainCategory);
router.post("/upload-all-level-categories", verifyAdmin, uploadAllLevelCategory);
router.post("/update-main-category-status/:id", updateCategoryStatus)
export default router;