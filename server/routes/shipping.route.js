
import express from "express";
import {
  createShippingCost,
  getAllShippingCosts,
  getShippingCostByCountryCode,
  updateShippingCost,
  deleteShippingCost,
} from "../controllers/shippingCost.controller.js";

const router = express.Router();

router.post("/create-shipping-cost", createShippingCost); 
router.get("/get-all-shipping-cost", getAllShippingCosts); 
router.get("/get-shipping-cost/:id", getShippingCostByCountryCode);
router.put("/update-shipping-cost/:id", updateShippingCost); 
router.delete("/delete-shipping-cost/:id", deleteShippingCost); 

export default router;
