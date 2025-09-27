import { MainCategory } from "../models/mainCategory.model.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import { Parent } from "../models/parent.model.js";
import fs from "fs";
import path from "path";

export const createMainCategory = async (req, res) => {
  try {
    const { Parent_name, Parent_id } = req.body || {};
    const localPath = req.files?.["image"]?.[0]?.filename;
    if (!Parent_name)
      return res.status(400).json({ error: "Parent name is required" });
    const category = new MainCategory({ Parent_name, Parent_id, Image: localPath });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllMainCategories = async (req, res) => {
  try {
    const categories = await MainCategory.find().sort({ createdAt: -1 });
    return res.status(200).json(categories);
  } catch (err) {
    console.log("Error in getAllMainCategories:", err);

    return res.status(500).json({ error: err.message });
  }
};

export const getMainCategoryById = async (req, res) => {
  try {
    const category = await MainCategory.findById(req.params.id)
    if (!category) return res.status(404).json({ error: "Not found" });
    res.json(category);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// export const updateMainCategory = async (req, res) => {
//   try {
//     const category = await MainCategory.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!category) return res.status(404).json({ error: "Not found" });
//     return res.json(category);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


export const updateMainCategory = async (req, res) => {
  try {
    const category = await MainCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    let imageUrl = category?.Image; // keep old image by default
    // console.log("HHH:==>", req.files["image"][0].filename)
    if (req.files?.["image"]?.[0]?.filename) {
      // new file uploaded
      const newImage = `${req.files["image"][0].filename}`;

      // remove old file if exists
      if (category.Image) {
        const oldPath = path.join(process.cwd(), category.Image);
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("Failed to delete old image:", err.message);
        });
      }

      imageUrl = newImage;
    }

    // update fields
    category.Parent_id = req.body.Parent_id || category.Parent_id;
    category.Parent_name = req.body.Parent_name || category.Parent_name;
    category.Image = imageUrl;

    const updatedCategory = await category.save();

    return res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(400).json({ error: err.message });
  }
};
export const deleteMainCategory = async (req, res) => {
  try {
    const category = await MainCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Not found" });
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const multipleMainCategory = async (req, res) => {
  try {
    const { MainCategories } = req.body || {};
    if (!Array.isArray(MainCategories) || MainCategories.length === 0) {
      return res.status(400).json({ message: "MainCategories are required" });
    }
    if (!MainCategories[0].Parent_name) {
      return res.status(400).json({ message: "Parent name is required" });
    }
    if (!MainCategories[0].Parent_id) {
      return res.status(400).json({ message: "Parent id is required" });
    }
    const MainCategoriesData = await MainCategory.insertMany(MainCategories);
    return res.status(201).json(MainCategoriesData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const uploadAllLevelCategory = async (req, res) => {
  try {
    const { categories } = req.body || {};
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Categories are required" });
    }

    // Extract unique IDs for pre-fetching
    const allCategoryIds = categories.map((item) => item.Categories_id);
    const allParentIds = categories
      .map((item) => item.Parent_id)
      .filter(Boolean);

    // PRELOAD: Fetch all existing entries
    const existingParents = await Parent.find({
      Categories_id: { $in: allCategoryIds },
    });
    const existingMains = await MainCategory.find({
      Categories_id: { $in: allCategoryIds },
    });
    const existingCats = await Category.find({
      Sub_CATEGORIES_ID: { $in: allCategoryIds },
    });
    const existingSubCategoryIds = new Set(
      (await SubCategory.find({}, "Sub_CATEGORIES_ID")).map(
        (doc) => doc.Sub_CATEGORIES_ID
      )
    );
    // Build quick lookup maps
    const parentMap = {};
    existingParents.forEach((p) => {
      parentMap[p.Categories_id] = p;
    });

    const mainMap = {};
    existingMains.forEach((m) => {
      mainMap[m.Categories_id] = {
        Categories_id: m.Categories_id,
        _id: m._id.toString(),
        Parent_name: m.Parent_name,
      };
    });

    const catMap = {};
    existingCats.forEach((c) => {
      catMap[c.Sub_CATEGORIES_ID] = {
        _id: c._id.toString(),
        SubCategoryName: c.SubCategoryName,
        Parent_id: c.Sub_CATEGORIES_ID,
      };
    });

    // ➤ Create missing Parents
    for (const item of categories) {
      if (item.Parent_id === "" && !parentMap[item.Categories_id]) {
        const parent = await Parent.create({
          Categories_id: item.Categories_id,
          Categories_name: item.Categories_name,
        });
        parentMap[item.Categories_id] = parent;
      }
    }

    // ➤ Create Main Categories
    for (const item of categories) {
      if (parentMap[item.Parent_id] && !mainMap[item.Categories_id]) {
        const main = new MainCategory({
          Parent_id: item.Parent_id.toString() || null,
          Parent_name: item.Categories_name,
          Categories_id: item.Categories_id,
        });
        await main.save();
        mainMap[item.Categories_id] = {
          Categories_id: item.Categories_id,
          _id: main._id.toString(),
          Parent_name: main.Parent_name,
        };
      }
    }

    // ➤ Create Categories (Level 2)
    for (const item of categories) {
      const parentIsMain = mainMap[item.Parent_id];
      if (parentIsMain && !catMap[item.Categories_id]) {
        const cat = new Category({
          SubCategoryName: item.Categories_name,
          Parent_name: parentIsMain._id,
          Sub_CATEGORIES_ID: item.Categories_id,
        });
        await cat.save();
        catMap[item.Categories_id] = {
          _id: cat._id.toString(),
          SubCategoryName: cat.SubCategoryName,
          Parent_id: item.Categories_id,
        };
      }
    }

    const subCategoryDocs = [];

    for (const item of categories) {
      const parentIsCategory = catMap[item.Parent_id];
      const alreadyExists = existingSubCategoryIds.has(item.Categories_id);

      if (parentIsCategory && !alreadyExists) {
        subCategoryDocs.push({
          subCategoryName: item.Categories_name,
          category: parentIsCategory._id,
          Sub_CATEGORIES_ID: item.Categories_id,
          subCategoryImage: [],
        });
      }
    }

    if (subCategoryDocs.length) {
      await SubCategory.insertMany(subCategoryDocs);
    }

    return res.status(201).json({
      message: "Categories uploaded successfully",
    });
  } catch (error) {
    console.log("upload all level category error", error);
    return res
      .status(500)
      .json({ message: "upload all level category server error" });
  }
};

export const updateCategoryStatus = async (req, res) => {
  try {
    const { isHome } = req.body;
    console.log("klklkl===>", isHome)
    const mainCategory = await MainCategory.findById(req.params.id);
    if (!mainCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    mainCategory.isHome = isHome;
    await mainCategory.save();
    return res.status(200).json({ message: "Category status updated" });
  } catch (error) {
    console.error("Update Category Status Error:", error);
    return res.status(500).json({ message: "Internal Server Error in update category status" });
  }
};
