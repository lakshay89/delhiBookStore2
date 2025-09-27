import express from "express";
import {
    createFeedback,
    getSingleFeedback,
    getAllFeedback,
    updateFeedback,
      deleteFeedback,
} from "../controllers/feedback.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHadler.middleware.js";

const router = express.Router();

router.post("/create-feedback", createFeedback);
router.get("/get-all-feedback", getAllFeedback);
router.get("/get-feedback-by-order-id/:id", getSingleFeedback);
router.put("/update-Status-feedback/:id", verifyAdmin, updateFeedback);
router.get("/delete-reviews/:id", verifyAdmin, deleteFeedback);

export default router;
