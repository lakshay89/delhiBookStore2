import mongoose from "mongoose";

const countryCurrencySchema = new mongoose.Schema(
  {
    countryCode: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
      unique: true,
    },
    currency: {
      type: String,
      required: true,
    },
    // exchangeRate: {
    //   type: Number,
    //   required: true,
    //   default: 1,
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const CountryCurrency = mongoose.model("CountryCurrency", countryCurrencySchema);
