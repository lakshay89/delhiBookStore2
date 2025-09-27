import { CountryCurrency } from "../models/countryCurrency.model.js";
import { countryToCurrency } from "./currency.controller.js";

function isValidCurrency(inputCurrency) {
  return Object.values(countryToCurrency).includes(inputCurrency);
}
const createCountryCurrency = async (req, res) => {
  try {
    const { countryCode, currency, exchangeRate, isActive } = req.body || {};

    const exists = await CountryCurrency.findOne({ countryCode });
    if (exists) {
      return res.status(400).json({ message: "Mapping already exists" });
    }
    const isValidCountryCode = countryToCurrency[countryCode];
    if (!isValidCountryCode) {
      return res.status(400).json({ message: "Invalid country code" });
    }
    if (!isValidCurrency(currency)) {
      return res.status(400).json({ message: "Invalid currency" });
    }
    const mapping = new CountryCurrency({
      countryCode,
      currency,
      // exchangeRate,
      isActive,
    });

    await mapping.save();
    res.status(201).json(mapping);
  } catch (error) {
    console.error("createCountryCurrency error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCountryCurrencies = async (req, res) => {
  try {
    const mappings = await CountryCurrency.find();
    res.status(200).json(mappings);
  } catch (error) {
    console.error("getAllCountryCurrencies error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCountryCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const mapping = await CountryCurrency.findById(id);

    if (!mapping) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.status(200).json(mapping);
  } catch (error) {
    console.error("getCountryCurrency error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCountryCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    console.log("updateCountryCurrency", updates);
    const mapping = await CountryCurrency.findById(id);

    if (!mapping) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    mapping.currency = updates.currency ?? mapping.currency;
    // mapping.exchangeRate = updates.exchangeRate ?? mapping.exchangeRate;
    mapping.countryCode = updates.countryCode ?? mapping.countryCode;
    mapping.isActive = updates.isActive ?? mapping.isActive;

    await mapping.save();

    res.status(200).json(mapping);
  } catch (error) {
    console.error("updateCountryCurrency error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteCountryCurrency = async (req, res) => {
  try {
    const { id } = req.params;

    const mapping = await CountryCurrency.findByIdAndDelete(id);
    if (!mapping) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.status(200).json({ message: "Mapping deleted successfully" });
  } catch (error) {
    console.error("deleteCountryCurrency error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createCountryCurrency,
  updateCountryCurrency,
  getAllCountryCurrencies,
  deleteCountryCurrency,
  getCountryCurrency,
};
