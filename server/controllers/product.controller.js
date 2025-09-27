import fetch from "node-fetch";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { deleteLocalImage, findImageWithExtension, } from "../utils/image.util.js";
import { SubCategory } from "../models/subCategory.model.js";
import { MainCategory } from "../models/mainCategory.model.js";
import lodash from "lodash";
import isEqual from "lodash/isEqual.js";
import _ from "lodash";

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      highlights,
      details,
      author,
      pages,
      ISBN,
      publisher,
      publicationDate,
      language,
      newArrival,
      featuredBooks,
      bestSellingBooks,
      priceInDollors,
      priceInEuros,
      price,
      discount,
      category,
      subCategory,
      // stock,
    } = req.body || {};
    const errorMessages = [];
    if (!title) errorMessages.push("title is required");
    if (req.files.length == 0 || !req.files)
      errorMessages.push("image is required");
    if (!description) errorMessages.push("description is required");
    // if (!highlights) errorMessages.push("highlights is required");
    // if (!details) errorMessages.push("details is required");
    if (!author) errorMessages.push("author is required");
    if (!pages) errorMessages.push("pages is required");
    if (!ISBN) errorMessages.push("ISBN is required");
    if (!publisher) errorMessages.push("publisher is required");
    if (!publicationDate) errorMessages.push("publicationDate is required");
    // if (!language) errorMessages.push("language is required");
    // if (!priceInDollors) errorMessages.push("priceInDollors is required");
    // if (!priceInEuros) errorMessages.push("priceInEuros is required");
    if (!price) errorMessages.push("price is required");
    if (!discount) errorMessages.push("discount is required");
    if (!category) errorMessages.push("category is required");
    // if (!stock) errorMessages.push("stock is required");
    if (errorMessages.length > 0) {
      return res.status(400).json({ message: errorMessages });
    }
    const newArrivalBool = newArrival === "true";
    const featuredBooksBool = featuredBooks === "true";
    const bestSellingBooksBool = bestSellingBooks === "true";
    if (category) {
      const isCategoryExists = await Category.findById(category);

      if (!isCategoryExists) {
        return res.status(400).json({ message: "category not found" });
      }
    }

    if (subCategory) {
      const isSubCategoryExists = await SubCategory.findById(subCategory);
      if (!isSubCategoryExists) {
        return res.status(400).json({ message: "sub category not found" });
      }
    }
    const images = req.files.map((file) => {
      return file.filename;
    });
    const finalPrice = Number(price) - (Number(price) * Number(discount)) / 100;

    const product = await Product.create({
      title,
      description,
      // highlights,
      // details,
      author,
      pages,
      ISBN,
      publisher,
      publicationDate,
      // language,
      newArrival: newArrivalBool,
      featuredBooks: featuredBooksBool,
      bestSellingBooks: bestSellingBooksBool,
      // priceInDollors: Number(priceInDollors),
      // priceInEuros: Number(priceInEuros),
      price: Number(price),
      discount: Number(discount),
      category,
      subCategory,
      // stock,
      images,
      finalPrice,
    });

    return res.status(201).json({ message: "product created", product });
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map((file) => deleteLocalImage(file.path)));
    }
    console.log("create product error", error);
    return res.status(500).json({ message: "create product server error" });
  }
};

// const multipleProducts = async (req, res) => {
//   try {
//     const { products } = req.body || {};
//     if (!products || !Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ message: "No products provided" });
//     }
//     const existedProducts = await Product.find({},"PRODUCTS_ID _id");
//     const productMap = new Map(
//       existedProducts.map((product) => [
//         product.PRODUCTS_ID,
//         product._id.toString(),
//       ])
//     );

//     const insertProducts = [];
//     const updateProducts = [];

//     for (const rawProduct of products) {
//       const product = { ...rawProduct };

//       product.images = product.ISBN13
//         ? [findImageWithExtension(product.ISBN13)]
//         : [];

//       product.ISBN13 = String(product.ISBN13) || "";

//       if (product.PRODUCTS_ID) {
//         product.PRODUCTS_ID = Number(product.PRODUCTS_ID);
//       }

//       if (
//         product.PRODUCTS_MRP_IN_DOLLAR &&
//         product.PRODUCTS_SP_IN_DOLLAR &&
//         !isNaN(Number(product.PRODUCTS_MRP_IN_DOLLAR)) &&
//         !isNaN(Number(product.PRODUCTS_SP_IN_DOLLAR))
//       ) {
//         const mrpDollar = Number(product.PRODUCTS_MRP_IN_DOLLAR);
//         const spDollar = Number(product.PRODUCTS_SP_IN_DOLLAR);

//         product.price = mrpDollar;
//         product.finalPrice = spDollar;

//         const discountPercentage = ((mrpDollar - spDollar) / mrpDollar) * 100;
//         product.discount = Math.round(discountPercentage);
//       } else {
//         product.priceInDollors = 1111110;
//         product.price = 1111110;
//         product.finalPrice = 888880;
//         product.discount = 0;
//       }

//       product.title = product?.PRODUCTS_NAME || "Untitled Product";

//       if (product.PRODUCTS_PUBLISHER_NAME) {
//         product.publisher = product.PRODUCTS_PUBLISHER_NAME;
//       }

//       if (product.PRODUCTS_PAGES) {
//         product.pages = Number(product.PRODUCTS_PAGES) || 0;
//       }

//       if (product.PRODUCTS_AUTH_NAME) {
//         product.author = product.PRODUCTS_AUTH_NAME;
//       }

//       if (product.PRODUCTS_PUBLISH_DATE) {
//         product.publicationDate = product.PRODUCTS_PUBLISH_DATE;
//       }
//       if (product.BOOK_DESCRIPTION) {
//         product.description = product.BOOK_DESCRIPTION;
//       }
//       if (product.PRODUCTS_CODE) {
//         product.ISBN = product.PRODUCTS_CODE;
//       }
//       const existingId = productMap.get(product.PRODUCTS_ID);
//       if (existingId) {
//         updateProducts.push({
//           updateOne: {
//             filter: { _id: existingId },
//             update: { $set: product },
//           },
//         });
//       } else {
//         insertProducts.push(product);
//       }
//     }

//     const updatedProducts = await Product.bulkWrite(updateProducts);
//     const insertedProducts = await Product.insertMany(insertProducts);

//     return res.status(201).json({
//       message: "Products created",
//       products: insertedProducts,
//       updatedProducts: updatedProducts,
//     });
//   } catch (error) {
//     console.log("create product error", error);
//     return res
//       .status(500)
//       .json({ message: "create product server error", error });
//   }
// };

const multipleProducts = async (req, res) => {
  try {
    const { products } = req.body || {};
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    const existedProducts = await Product.find(
      {},
      "PRODUCTS_ID _id title author publisher price finalPrice discount ISBN13 ISBN pages images publicationDate description"
    );

    const productMap = new Map(
      existedProducts.map((product) => [
        product.PRODUCTS_ID,
        product._id.toString(),
      ])
    );

    const insertProducts = [];
    const updateProducts = [];

    for (const rawProduct of products) {
      const product = { ...rawProduct };
      if (
        !product.ISBN13 &&
        !product.PRODUCTS_ID &&
        !product.PRODUCTS_CODE &&
        !product.PRODUCTS_NAME &&
        !product.PRODUCTS_PUBLISHER_NAME
      )
        continue;
      product.images = product.ISBN13
        ? [findImageWithExtension(product.ISBN13)]
        : [];

      product.ISBN13 = String(product.ISBN13 || "");

      if (product.PRODUCTS_ID) {
        product.PRODUCTS_ID = String(product.PRODUCTS_ID);
      }

      if (
        product.PRODUCTS_MRP_IN_DOLLAR &&
        product.PRODUCTS_SP_IN_DOLLAR &&
        !isNaN(Number(product.PRODUCTS_MRP_IN_DOLLAR)) &&
        !isNaN(Number(product.PRODUCTS_SP_IN_DOLLAR))
      ) {
        const mrpDollar = Number(product.PRODUCTS_MRP_IN_DOLLAR);
        const spDollar = Number(product.PRODUCTS_SP_IN_DOLLAR);

        product.price = mrpDollar;
        product.finalPrice = spDollar;

        const discountPercentage = ((mrpDollar - spDollar) / mrpDollar) * 100;
        product.discount = Math.round(discountPercentage);
      } else {
        product.priceInDollors = 1111110;
        product.price = 1111110;
        product.finalPrice = 888880;
        product.discount = 0;
      }

      product.title = product?.PRODUCTS_NAME || "Untitled Product";

      if (product.PRODUCTS_PUBLISHER_NAME) {
        product.publisher = product.PRODUCTS_PUBLISHER_NAME;
      }

      if (product.PRODUCTS_PAGES) {
        product.pages = Number(product.PRODUCTS_PAGES) || 0;
      }

      if (product.PRODUCTS_AUTH_NAME) {
        product.author = product.PRODUCTS_AUTH_NAME;
      }

      if (product.PRODUCTS_PUBLISH_DATE) {
        product.publicationDate = product.PRODUCTS_PUBLISH_DATE;
      }

      if (product.BOOK_DESCRIPTION) {
        product.description = product.BOOK_DESCRIPTION;
      }

      if (product.PRODUCTS_CODE) {
        product.ISBN = product.PRODUCTS_CODE;
      }

      const existingId = productMap.get(String(product.PRODUCTS_ID));

      if (existingId) {
        const existingProduct = existedProducts.find(
          (p) => p._id.toString() === existingId
        );

        const keysToCompare = [
          "title",
          "author",
          "publisher",
          "price",
          "finalPrice",
          "discount",
          "ISBN13",
          "ISBN",
          "pages",
          "images",
          "publicationDate",
          "description",
        ];

        const hasChanged = keysToCompare.some((key) => {
          const newValue = product[key] ?? null;
          const oldValue = existingProduct[key] ?? null;
          return !_.isEqual(newValue, oldValue);
        });

        if (hasChanged) {
          updateProducts.push({
            updateOne: {
              filter: { _id: existingId },
              update: { $set: product },
            },
          });
        }
      } else {
        insertProducts.push(product);
      }
    }

    const updatedProducts =
      updateProducts.length > 0
        ? await Product.bulkWrite(updateProducts)
        : { modifiedCount: 0 };

    const insertedProducts =
      insertProducts.length > 0 ? await Product.insertMany(insertProducts) : [];

    return res.status(201).json({
      message: "Products processed successfully",
      insertedCount: insertedProducts.length,
      updatedCount: updatedProducts.modifiedCount || 0,
      insertedProducts,
    });
  } catch (error) {
    console.log("create product error", error);
    return res
      .status(500)
      .json({ message: "create product server error", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      highlights,
      details,
      author,
      pages,
      ISBN,
      publisher,
      publicationDate,
      // language,
      category,
      subCategory,
    } = req.body || {};
    let priceInDollors = req.body.priceInDollors
      ? Number(req.body.priceInDollors)
      : undefined;
    let priceInEuros = req.body.priceInEuros
      ? Number(req.body.priceInEuros)
      : undefined;
    let price = req.body.price ? Number(req.body.price) : undefined;
    let stock = req.body.stock ? Number(req.body.stock) : undefined;
    let discount = req.body.discount ? Number(req.body.discount) : undefined;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => {
        return file.filename;
      });
      if (product.images) {
        await Promise.all(
          product.images.map((image) => deleteLocalImage(image))
        );
      }
      product.images = images;
    } else {
      product.images = product.images;
    }
    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.highlights = highlights ?? product.highlights;
    product.details = details ?? product.details;
    product.author = author ?? product.author;
    product.pages = pages ?? product.pages;
    product.ISBN = ISBN ?? product.ISBN;
    product.publisher = publisher ?? product.publisher;
    product.publicationDate = publicationDate ?? product.publicationDate;
    // product.language = language ?? product.language;
    if ("newArrival" in req.body) {
      product.newArrival = req.body.newArrival === "true";
    }

    if ("featuredBooks" in req.body) {
      product.featuredBooks = req.body.featuredBooks === "true";
    }

    if ("bestSellingBooks" in req.body) {
      product.bestSellingBooks = req.body.bestSellingBooks === "true";
    }

    product.priceInDollors = priceInDollors ?? product.priceInDollors;
    product.priceInEuros = priceInEuros ?? product.priceInEuros;
    product.price = price ?? product.price;
    product.discount = discount ?? product.discount;
    if (price || discount) {
      const productPrice = Number(price) ?? product.price;
      const productDiscount = Number(discount) ?? product.discount;
      product.finalPrice =
        productPrice - (productPrice * productDiscount) / 100;
    }
    if (category) {
      let isCategoryExists = await Category.findById(category);
      if (!isCategoryExists) {
        return res.status(400).json({ message: "category not found" });
      }
      product.category = category;
    } else {
      product.category = product.category;
    }
    if (subCategory) {
      let isSubCategoryExists = await SubCategory.findById(subCategory);
      if (!isSubCategoryExists) {
        return res.status(400).json({ message: "sub category not found" });
      }
      product.subCategory = subCategory;
    } else {
      product.subCategory = product.subCategory;
    }
    product.stock = stock ?? product.stock;
    await product.save();
    return res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map((file) => deleteLocalImage(file.path)));
    }
    console.log("update product error", error);
    return res.status(500).json({ message: "update product server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 50;
    const createdNew = req?.query?.createdNew || false;
    const skip = (page - 1) * limit;
    const { mainCategory, minPrice, maxPrice } = req.query;
    const query = {};
    const andConditions = [];
    if (req?.query?.newArrival) {
      query.newArrival = true;
    }
    if (req?.query?.featuredBooks) {
      query.featuredBooks = true;
    }
    if (req?.query?.bestSellingBooks) {
      query.bestSellingBooks = true;
    }

    if (mainCategory) {
      const mainCategoryQuery = Array.isArray(mainCategory)
        ? mainCategory
        : [mainCategory];
      const matchingMainCategories = await MainCategory.find({
        Parent_name: { $in: { $regex: mainCategoryQuery, $options: "i" } },
      });
      const mainCategoryIds = matchingMainCategories.map((cat) => cat._id);
      andConditions.push({ mainCategory: { $in: mainCategoryIds } });
    }

    if (maxPrice && minPrice) {
      andConditions.push({
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      });
    }

    if (andConditions.length > 0) query.$and = andConditions;
    const products = await Product.find(query)
      .populate("category")
      .skip(skip)
      .limit(limit);
    // .sort({ createdAt: createdNew ? -1 : 1 });

    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    // if (page > totalPages) {
    //   return res.status(404).json({ message: "Page not found" });
    // }
    return res.status(200).json({
      message: "all products",
      totalCount,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    console.log("get all products error", error);
    return res.status(500).json({ message: "get all products server error" });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product found", product });
  } catch (error) {
    console.log("get single product error", error);
    return res.status(500).json({ message: "get single product server error" });
  }
};

const getNewArrival = async (req, res) => {
  try {
    const products = await Product.find({ newArrival: true });
    return res.status(200).json({ message: "new arrival", products });
  } catch (error) {
    console.log("get new arrival error", error);
    return res.status(500).json({ message: "get new arrival server error" });
  }
};
const getFeaturedBooks = async (req, res) => {
  try {
    const products = await Product.find({ featuredBooks: true });
    return res.status(200).json({ message: "featured books", products });
  } catch (error) {
    console.log("get featured books error", error);
    return res.status(500).json({ message: "get featured books server error" });
  }
};
const getBestSellingBooks = async (req, res) => {
  try {
    const products = await Product.find({ bestSellingBooks: true });
    return res.status(200).json({ message: "best selling books", products });
  } catch (error) {
    console.log("get best selling books error", error);
    return res
      .status(500)
      .json({ message: "get best selling books server error" });
  }
};
const getProductByCategory = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 50;
    const skip = (page - 1) * limit;
    const sort = req?.query?.sort || false;

    const sortQuery = {};
    if (sort === "highToLow") {
      sortQuery.finalPrice = -1;
    }
    if (sort === "lowToHigh") {
      sortQuery.finalPrice = 1;
    }
    if (sort === "latest") {
      sortQuery.createdAt = -1;
    }
    // const subCategories = await SubCategory.find({ category: req.params.id });
    // const subCategoryIds = subCategories.map((sub) => sub?._id);
    // const mainCategory = await MainCategory.findById(req.params.id);
    // console.log('subCategories==>', subCategories)
    // console.log('subCategoryIds==>', subCategoryIds)
    // console.log('mainCategory==>', mainCategory)
    const category = await Product.find({
      $or: [
        // { category: req.params.id },
        // { subCategory: { $in: subCategoryIds } },
        // { mainCategory: mainCategory?._id },
        { category: req.params.id },
        { subCategory: req.params.id },
        { mainCategory: req.params.id },
      ],
    }).skip(skip)
      .limit(limit)
      .sort(sortQuery);
    console.log('category==>', req.params.id)
    console.log('category==>', category?.length)
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const totalCount = await Product.countDocuments({
      $or: [
        // { category: req.params.id },
        // { subCategory: { $in: subCategoryIds } },
        // { mainCategory: mainCategory?._id },
        { category: req.params.id },
        { subCategory: req.params.id },
        { mainCategory: req.params.id },
      ],
    });
    return res.status(200).json({
      category,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Get Category by ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getProductsByMainCategory = async (req, res) => {
  const { id: mainCategoryId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 1;
  try {
    const categories = await Category.find(
      { mainCategory: mainCategoryId },
      "_id"
    );
    const categoryIds = categories.map((cat) => cat._id);
    const subCategories = await SubCategory.find(
      { category: { $in: categoryIds } },
      "_id"
    );
    const subCategoryIds = subCategories.map((sub) => sub._id);

    const filter = {
      $or: [
        { mainCategory: mainCategoryId },
        { category: { $in: categoryIds } },
        { subCategory: { $in: subCategoryIds } },
      ],
    };
    const totalCount = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category")
      .populate("subCategory")
      .populate("mainCategory");

    return res.status(200).json({
      message: "Products under mainCategory",
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log("get products by main category error", error);
    res.status(500).json({ message: "Aggregation failed", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product deleted", product });
  } catch (error) {
    console.log("delete product error", error);
    return res.status(500).json({ message: "delete product server error" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const query = req.query.search;
    const matchingCategories = await Category.find({
      categoryName: { $regex: query, $options: "i" },
    });
    const categoryIds = matchingCategories.map((cat) => cat._id);
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { ISBN: { $regex: query, $options: "i" } },
        { ISBN13: { $regex: query, $options: "i" } },
        { category: { $in: categoryIds } },
        { publisher: { $regex: query, $options: "i" } },
      ],
    }).populate("category");

    return res.status(200).json({ message: "search products", products });
  } catch (error) {
    console.log("search products error", error);
    return res.status(500).json({ message: "search products server error" });
  }
};

const uploadMultipleProducts = async (req, res) => {
  try {
    return res.status(200).json({ message: "upload multiple products" });
  } catch (error) {
    console.log("upload multiple products error", error);
    return res
      .status(500)
      .json({ message: "upload multiple products server error" });
  }
};

// const multipleSubcategoryToProduct = async (req, res) => {
//   try {
//     const { subCategories } = req.body || {};
//     if (
//       !subCategories ||
//       !Array.isArray(subCategories) ||
//       subCategories.length === 0
//     ) {
//       return res.status(400).json({ message: "No subcategories provided" });
//     }

//     const bulkOps = await Promise.all(
//       subCategories.map(async (subCategory) => {
//         const updatedData = {};
//         const CategoryDoc = await Category.findOne({
//           Sub_CATEGORIES_ID: String(subCategory.Sub_CATEGORIES_ID),
//         });
//         if (CategoryDoc) {
//           updatedData.category = CategoryDoc._id;
//         }
//         const SubCategoryDoc = await SubCategory.findOne({
//           Sub_CATEGORIES_ID: String(subCategory.Sub_CATEGORIES_ID),
//         });
//         if (SubCategoryDoc) {
//           updatedData.subCategory = SubCategoryDoc._id;
//         }
//         const MainCategoryDoc = await MainCategory.findOne({
//           Parent_id: String(subCategory.Sub_CATEGORIES_ID),
//         });
//         if (MainCategoryDoc) {
//           updatedData.mainCategory = MainCategoryDoc._id;
//         }

//         if (Object.keys(updatedData).length === 0) {
//           return null;
//         }
//         return {
//           updateOne: {
//             filter: { PRODUCTS_ID: subCategory.PRODUCTS_ID },
//             update: { $set: updatedData },
//           },
//         };
//       })
//     );

//     const validOps = bulkOps.filter(Boolean);

//     if (validOps.length > 0) {
//       await Product.bulkWrite(validOps);
//     }

//     return res.status(200).json({ message: "multiple subcategory to product" });
//   } catch (error) {
//     console.log("multiple subcategory to product error", error);
//     return res
//       .status(500)
//       .json({ message: "multiple subcategory to product server error" });
//   }
// };

const multipleSubcategoryToProduct = async (req, res) => {
  try {
    const { subCategories } = req.body || {};
    if (
      !subCategories ||
      !Array.isArray(subCategories) ||
      subCategories.length === 0
    ) {
      return res.status(400).json({ message: "No subcategories provided" });
    }
    console.time("multipleSubcategoryToProduct");
    const subCategoryIds = subCategories.map((sc) => String(sc.CATEGORIES_ID));
    const [categoryDocs, subCategoryDocs, mainCategoryDocs] = await Promise.all(
      [
        Category.find({ Sub_CATEGORIES_ID: { $in: subCategoryIds } }),
        SubCategory.find({ Sub_CATEGORIES_ID: { $in: subCategoryIds } }),
        MainCategory.find({ Categories_id: { $in: subCategoryIds } }),
      ]
    );

    const categoryMap = new Map(
      categoryDocs.map((doc) => [doc.Sub_CATEGORIES_ID, doc._id])
    );
    const subCategoryMap = new Map(
      subCategoryDocs.map((doc) => [doc.Sub_CATEGORIES_ID, doc._id])
    );
    const mainCategoryMap = new Map(
      mainCategoryDocs.map((doc) => [doc.Categories_id, doc?._id])
    );
    console.timeEnd("multipleSubcategoryToProduct");
    console.time("bulkOps");
    const bulkOps = subCategories
      .map((subCategory) => {
        const updatedData = {};
        const subCatId = String(subCategory.CATEGORIES_ID);

        if (categoryMap.has(subCatId)) {
          updatedData.category = categoryMap.get(subCatId);
        }
        if (subCategoryMap.has(subCatId)) {
          updatedData.subCategory = subCategoryMap.get(subCatId);
        }
        if (mainCategoryMap.has(subCatId)) {
          updatedData.mainCategory = mainCategoryMap.get(subCatId);
        }

        if (Object.keys(updatedData).length === 0) {
          return null;
        }

        return {
          updateOne: {
            filter: { PRODUCTS_ID: subCategory.PRODUCTS_ID },
            update: { $set: updatedData },
          },
        };
      })
      .filter(Boolean);
    console.timeEnd("bulkOps");
    console.time("bulk write");
    if (bulkOps.length > 0) {
      const BATCH_SIZE = 5000;
      for (let i = 0; i < bulkOps.length; i += BATCH_SIZE) {
        const batch = bulkOps.slice(i, i + BATCH_SIZE);
        await Product.bulkWrite(batch);
      }
    }
    console.timeEnd("bulk write");
    return res.status(200).json({
      message: "Multiple subcategories mapped to products successfully.",
    });
  } catch (error) {
    console.error("multiple subcategory to product error", error);
    return res.status(500).json({ message: "Multiple subcategory to product server error" });
  }
};

// const updateCurrencyPrice = async (req, res) => {
//   try {
//     const { UsdToInr, UsdToEur, UsdToPound } = req.body || {};
//     if (!UsdToInr || !UsdToEur) {
//       return res.status(400).json({ message: "UsdToInr or UsdToEur not provided" });
//     }
//     if (isNaN(UsdToInr) || isNaN(UsdToEur)) {
//       return res.status(400).json({ message: "UsdToInr or UsdToEur is not a number" });
//     }
//     const products = await Product.find({}, "_id priceInDollors").lean();
//     const bulkOps = [];
//     for (const product of products) {
//       const priceInDollars = Number(product.priceInDollors);
//       const priceInINR = priceInDollars * Number(UsdToInr);
//       console.log("GG:=>", priceInINR);
//       console.log("GGDOLLERS:=>", priceInDollars);
//       if (isNaN(priceInDollars)) {
//         console.warn(`Skipping product ${product._id} due to invalid priceInDollors`);
//         continue;
//       }
//       let productDiscount = product.discount ?? 0;
//       const updatedData = {
//         finalPrice: Math.floor(
//           priceInINR - (priceInINR * productDiscount) / 100
//         ),
//         price: Math.floor(priceInDollars * Number(UsdToInr)),
//         priceInEuros: Math.floor(priceInDollars * Number(UsdToEur)),
//         priceInPounds: Math.floor(priceInDollars * Number(UsdToPound)),
//       };

//       bulkOps.push({
//         updateOne: {
//           filter: { _id: product._id },
//           update: { $set: updatedData },
//         },
//       });
//     }
//     await Product.bulkWrite(bulkOps);
//     return res.status(200).json({ message: "update currency price" });
//   } catch (error) {
//     console.log("update currency price error", error);
//     return res
//       .status(500)
//       .json({ message: "update currency price server error" });
//   }
// };


const updateCurrencyPrice = async (req, res) => {
  try {
    let { UsdToInr, UsdToEur, UsdToPound } = req.body || {};

    // ✅ Convert to number safely
    UsdToInr = Number(UsdToInr);
    UsdToEur = Number(UsdToEur);
    UsdToPound = Number(UsdToPound);

    // ✅ Validate inputs
    if (!UsdToInr || !UsdToEur || !UsdToPound) {
      return res.status(400).json({
        success: false,
        message: "UsdToInr, UsdToEur, and UsdToPound are required and must be numbers.",
      });
    }

    // ✅ Fetch only needed fields
    const products = await Product.find({}, "_id price discount").lean();
    if (!products.length) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    const bulkOps = [];

    for (const product of products) {
      const priceInUSD = Number(product.price);

      if (isNaN(priceInUSD) || priceInUSD <= 0) {
        console.warn(`⚠️ Skipping product ${product._id} due to invalid price: ${product.price}`);
        continue;
      }

      const productDiscount = Number(product.discount) || 0;

      // ✅ Calculate converted prices
      const priceInINR = priceInUSD * UsdToInr;
      const priceInEUR = priceInUSD * UsdToEur;
      const priceInGBP = priceInUSD * UsdToPound;

      const updatedData = {
        price: priceInUSD,
        priceInDollors: Math.floor(priceInINR),
        priceInEuros: Math.floor(priceInEUR),
        priceInPounds: Math.floor(priceInGBP),
        finalPrice: Math.floor(priceInUSD - (priceInUSD * productDiscount) / 100), // Discounted INR
      };

      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: updatedData },
        },
      });
    }

    if (bulkOps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found to update.",
      });
    }

    // ✅ Perform bulk update
    const result = await Product.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      message: "Currency prices updated successfully",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });

  } catch (error) {
    console.error("❌ update currency price error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating currency prices",
      error: error.message,
    });
  }
};



const updateProductStock = async (req, res) => {
  try {
    const { products } = req.body || {};
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "products not provided" });
    }
    if (!products[0]?.ISBN13 || !products[0]?.stock) {
      return res.status(400).json({ message: "ISBN13 or stock not provided" });
    }
    const bulkOps = products.map((product) => ({
      updateOne: {
        filter: { ISBN13: product.ISBN13 },
        update: { $set: { stock: product.stock } },
      },
    }));
    await Product.bulkWrite(bulkOps);
    return res.status(200).json({ message: "update product stock" });
  } catch (error) {
    console.log("update product stock error", error);
    return res
      .status(500)
      .json({ message: "update product stock server error" });
  }
};

const getMultipleProductsById = async (req, res) => {
  try {
    const { productIds } = req.body || {};
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: "productIds not provided" });
    }
    const products = await Product.find({ _id: { $in: productIds } });
    return res
      .status(200)
      .json({ message: "get multiple products by id", products });
  } catch (error) {
    console.log("get multiple products by id error", error);
    return res
      .status(500)
      .json({ message: "get multiple products by id server error" });
  }
};

const productCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    return res.status(200).json({ message: "get product count", count });
  } catch (error) {
    console.log("get product count error", error);
    return res.status(500).json({ message: "get product count server error" });
  }
};

const manageProductStock = async (req, res) => {
  try {
    const { products } = req.body || {};
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "products not provided" });
    }
    const updatedISBN13Number = products.map((product) =>
      String(product.ISBN13)
    );
    const missingProducts = await Product.find(
      { ISBN13: { $nin: updatedISBN13Number } },
      { ISBN13: 1, _id: 0 }
    );

    const missingIsbn13s = missingProducts.map((p) => p.ISBN13);
    await Product.updateMany(
      { ISBN13: { $in: missingIsbn13s } },
      { $set: { stock: 0 } }
    );
    await Product.updateMany(
      { ISBN13: { $in: updatedISBN13Number } },
      { $set: { stock: 99999 } }
    );
    return res.status(200).json({
      message: "Stock updated successfully",
      totalUpdated: missingIsbn13s.length,
    });
  } catch (error) {
    console.log("manageProductStock error", error);
    return res.status(500).json({ message: "manageProductStock server error" });
  }
};
export {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  multipleProducts,
  getNewArrival,
  getFeaturedBooks,
  getBestSellingBooks,
  getProductByCategory,
  searchProducts,
  uploadMultipleProducts,
  multipleSubcategoryToProduct,
  getProductsByMainCategory,
  updateCurrencyPrice,
  updateProductStock,
  getMultipleProductsById,
  productCount,
  manageProductStock,
};
