import express from "express";
import {
  createCountryCurrency,
  getAllCountryCurrencies,
  getCountryCurrency,
  updateCountryCurrency,
  deleteCountryCurrency,
} from "../controllers/countryCurrency.controller.js";

const router = express.Router();

router.post("/create-country-currency", createCountryCurrency);
router.get("/get-all-country-currency", getAllCountryCurrencies);
router.get("/get-country-currency/:id", getCountryCurrency);
router.put("/update-country-currency/:id", updateCountryCurrency);
router.delete("/delete-country-currency/:id", deleteCountryCurrency);

export default router;
