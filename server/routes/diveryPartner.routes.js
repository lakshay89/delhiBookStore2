import express from "express";
import {
  createDiveryPartner,
  getAllDiveryPartners,
  getDiveryPartnerById,
  updateDiveryPartner,
  deleteDiveryPartner,
} from "../controllers/diveryPartner.controller.js";

const router = express.Router();

router.post("/create-divery-partner", createDiveryPartner);
router.get("/get-all-divery-partners", getAllDiveryPartners);
router.get("/get-divery-partner/:id", getDiveryPartnerById);
router.put("/update-divery-partner/:id", updateDiveryPartner);
router.delete("/delete-divery-partner/:id", deleteDiveryPartner);

export default router;
