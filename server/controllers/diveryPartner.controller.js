import { DeliveryPartner } from "../models/diverypartner.model.js";

const createDiveryPartner = async (req, res) => {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(400).json({ message: "Name and link are required" });
    }

    const newPartner = new DeliveryPartner({ name, link });
    await newPartner.save();

    res.status(201).json({ message: "Partner created", partner: newPartner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating partner", error: error.message });
  }
};

const getAllDiveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find().sort({ createdAt: -1 });
    res.status(200).json(partners);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching partners", error: error.message });
  }
};

const getDiveryPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await DeliveryPartner.findById(id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json(partner);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching partner", error: error.message });
  }
};

const updateDiveryPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(400).json({ message: "Name and link are required" });
    }

    const updatedPartner = await DeliveryPartner.findByIdAndUpdate(
      id,
      { name, link },
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res
      .status(200)
      .json({ message: "Partner updated", partner: updatedPartner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating partner", error: error.message });
  }
};

const deleteDiveryPartner = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await DeliveryPartner.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({ message: "Partner deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting partner", error: error.message });
  }
};

export {
  createDiveryPartner,
  getAllDiveryPartners,
  getDiveryPartnerById,
  updateDiveryPartner,
  deleteDiveryPartner,
};
