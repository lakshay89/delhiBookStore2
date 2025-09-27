import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  INR: {
    type: Number,
  },
  EUR: {
    type: Number,
  },
  GBP: {
    type: Number,
  },
});

export const Currency = mongoose.model("Currency", currencySchema);
