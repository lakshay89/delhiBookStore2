import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema({
  Parent_id: {
    type: String,
  },

  Parent_name: {
    type: String,
    required: true,
  },
  Categories_id: {
    type: String,
  },
  Image: {
    type: String,
    // required: true,
  },
  isHome: {
    type: Boolean,
    default: false,
  }
});

export const MainCategory = mongoose.model("MainCategory", mainCategorySchema);
