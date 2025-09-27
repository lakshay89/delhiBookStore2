import mongoose from "mongoose";
import { PaymentSession } from "../models/paymentSession.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    await PaymentSession.syncIndexes();

    console.log("Database connected", connectionInstance.connection.host);
  } catch (error) {
    console.log("mongoDb connection error", error);
    process.exit(1);
  }
};
