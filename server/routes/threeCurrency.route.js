import { Router } from "express";
import { getCurrency, updateThreeCurrency } from "../controllers/threeCurrency.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

router.put("/update-currency", verifyAdmin, updateThreeCurrency);
router.get("/get-currency", getCurrency)
export default router;
