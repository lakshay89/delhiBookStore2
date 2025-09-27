import { ShippingCost } from "../models/shippingCost.model.js";

const createShippingCost = async (req, res) => {
  try {
    const { shippingCost, countryCode, country } = req.body;

    if (!shippingCost || !countryCode || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await ShippingCost.findOne({ countryCode });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Shipping cost for this country already exists" });
    }

    const newCost = new ShippingCost({ shippingCost, countryCode, country });
    await newCost.save();

    res.status(201).json({ message: "Shipping cost added", data: newCost });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllShippingCosts = async (req, res) => {
  try {
    const shippingCosts = await ShippingCost.find().sort({ country: 1 });
    res.status(200).json(shippingCosts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching shipping costs", error: err.message });
  }
};

const getShippingCostByCountryCode = async (req, res) => {
  try {
    const { id } = req.params;
    const cost = await ShippingCost.findById(id);

    if (!cost)
      return res.status(404).json({ message: "Shipping cost not found" });

    res.status(200).json(cost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching shipping cost", error: err.message });
  }
};

const updateShippingCost = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingCost, countryCode, country } = req.body;

    const updated = await ShippingCost.findByIdAndUpdate(
      id,
      { shippingCost, countryCode, country },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Shipping cost not found" });

    return res
      .status(200)
      .json({ message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

const deleteShippingCost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ShippingCost.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ message: "Shipping cost not found" });

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

export {
  createShippingCost,
  getAllShippingCosts,
  getShippingCostByCountryCode,
  updateShippingCost,
  deleteShippingCost,
};
