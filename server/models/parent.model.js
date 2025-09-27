import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
  Categories_id: {
    type: String,
    required: true,
  },
  Categories_name: {
    type: String,
    required: true,
  },
});

export const Parent = mongoose.model("Parent", parentSchema);
