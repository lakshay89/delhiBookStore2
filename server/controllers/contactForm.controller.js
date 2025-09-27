import { ContactForm } from "../models/contactForm.model.js";
import { sendContactEmail } from "../utils/sendMail.js";

export const getAllContactForms = async (req, res) => {
  try {
    const forms = await ContactForm.find();
    return res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createContactForm = async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    if (!name || !email || !message || !subject) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const form = await ContactForm.create({ name, email, message, subject });
    res.status(201).json(form);
    setImmediate(async () => {
      try {
        await sendContactEmail(name, email, subject, message);
      } catch (error) {
        console.log("error in createContactForm", error);
      }
    });
  } catch (err) {
    console.log("error in createContactForm", err);

    res.status(400).json({ error: err.message });
  }
};

export const deleteContactForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactForm.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Contact form not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
