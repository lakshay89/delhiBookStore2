import mongoose from "mongoose";

const shippingCostSchema = new mongoose.Schema({
  shippingCost: {
    type: Number,
    required: true,
    min: [0, "Shipping cost must be a positive number"],
  },
  countryCode: {
    type: String,
      uppercase: true,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

export const ShippingCost = mongoose.model("ShippingCost", shippingCostSchema);
