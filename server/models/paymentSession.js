import mongoose from "mongoose";
import { itemsSchema } from "./cart.model.js";

const paymentSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    orderUniqueId: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      default: null,
    },
    items: {
      type: [itemsSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      dollarPriceAtOrder: {
        type: String,
      },
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    dollarPriceAtOrder: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  }
);

export const PaymentSession = mongoose.model(
  "PaymentSession",
  paymentSessionSchema
);
