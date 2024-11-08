const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const uniqid = require("uniqid");

// Create new product
const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description, brand, color, category } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req?.files?.images?.map((el) => el.path);
  if (
    !(
      title &&
      price &&
      description &&
      brand &&
      color &&
      category &&
      thumb &&
      images
    )
  ) {
    throw new Error("Missing inputs");
  }
  req.body.slug = slugify(title);
  if (thumb) req.body.thumb = thumb;
  if (images) req.body.images = images;
  const product = await Product.create(req.body);
  return res.status(200).json({
    success: product ? true : false,
    message: product
      ? "A new product has been added!"
      : "Cannot create new product!",
  });
});

// Get product
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: "ratings.postedBy",
    select: "firstname lastname avatar",
  });

  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product!",
  });
});

// Get all product filtering, sorting, and paginating
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  // Separate the specified fields from queries
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queries[el]);

  // Format the queries to be used in mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formattedQueries = JSON.parse(queryString);
  let colorQueryObject = {};

  // Filtering
  if (queries?.title) {
    formattedQueries.title = { $regex: queries.title, $options: "i" };
  }
  if (queries?.category) {
    formattedQueries.category = { $regex: queries.category, $options: "i" };
  }
  if (queries?.brand) {
    formattedQueries.brand = { $regex: queries.brand, $options: "i" };
  }
  if (queries?.color) {
    delete formattedQueries.color;
    const colorArr = queries.color?.split(",");
    const colorQuery = colorArr.map((el) => ({
      color: { $regex: el, $options: "i" },
    }));
    colorQueryObject = { $or: colorQuery };
  }

  if (req.query.q) {
    delete formattedQueries.q;
    formattedQueries["$or"] = [
      { title: { $regex: req.query.q, $options: "i" } },
      { brand: { $regex: req.query.q, $options: "i" } },
      { category: { $regex: req.query.q, $options: "i" } },
      { description: { $regex: req.query.q, $options: "i" } },
      { color: { $regex: req.query.q, $options: "i" } },
    ];
  }

  const qr = { ...colorQueryObject, ...formattedQueries };
  let queryCommand = Product.find(qr);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  // - litmit: number of results per API call
  // - skip: number of results to skip
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.PAGINATION_LIMIT;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  // Execute the query
  try {
    const products = await queryCommand.exec();
    if (!products || products.length === 0)
      throw new Error("Cannot get products!");
    const count = await Product.find(qr).countDocuments();
    return res.status(200).json({
      success: products ? true : false,
      count,
      productData: products ? products : "Cannot get products!",
    });
  } catch (error) {
    throw new Error(error.message);
  }
});


// Hàm xử lý tìm kiếm sản phẩm
const mongoose = require("mongoose");
 // Đảm bảo đường dẫn đúng đến model Product

const searchProduct = async (req, res) => {
  const { key } = req.params;  // Lấy giá trị tìm kiếm từ route parameter ':key'

  // Kiểm tra nếu không có giá trị tìm kiếm 'key' trong route params
  if (!key || key.trim() === "") {
    return res.status(400).json({ success: false, message: "Search key 'key' is required and cannot be empty" });
  }

  try {
    // Kiểm tra xem key có phải là ObjectId hợp lệ không
    let searchQuery = {};

    if (mongoose.Types.ObjectId.isValid(key)) {
      // Nếu key là ObjectId hợp lệ, tìm kiếm theo _id
      searchQuery._id = mongoose.Types.ObjectId(key);
    } else {
      // Nếu key không phải ObjectId, tìm kiếm các trường khác
      searchQuery = {
        $or: [
          { title: { $regex: key, $options: "i" } },   // Tìm kiếm theo title
          { brand: { $regex: key, $options: "i" } },    // Tìm kiếm theo brand
          { category: { $regex: key, $options: "i" } },  // Tìm kiếm theo category
          { description: { $regex: key, $options: "i" } }, // Tìm kiếm theo description
          { color: { $regex: key, $options: "i" } },     // Tìm kiếm theo color
        ]
      };
    }

    // Tìm kiếm sản phẩm với searchQuery
    const products = await Product.find(searchQuery);

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    // Trả về kết quả tìm kiếm
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    // Xử lý lỗi nếu có
    return res.status(500).json({ success: false, message: error.message });
  }
};




//  Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const files = req.files;
  if (files?.thumb) {
    req.body.thumb = files?.thumb[0]?.path;
  }
  if (files?.images) {
    req.body.images = files?.images?.map((el) => el.path);
  }
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const product = await Product.findByIdAndUpdate(pid, req.body, { new: true });
  return res.status(200).json({
    success: product ? true : false,
    message: product ? "Product is updated" : "Cannot update product!",
  });
});

//  Update product
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: product ? true : false,
    message: product ? "Product has been removed" : "Cannot delete products!",
  });
});

//
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid, updatedAt } = req.body;
  if (!star || !pid) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );

  if (alreadyRating) {
    // Update the rating
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updatedAt": updatedAt,
        },
      }
    );
  } else {
    // Add new rating
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
      },
      { new: true }
    );
  }

  // Calculate the total rating
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRating = updatedProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRating = Math.round((sumRating * 10) / ratingCount) / 10;
  await updatedProduct.save();

  return res.status(200).json({
    success: true,
    updatedProduct,
  });
});

// Upload images
const uploadProductImages = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.files.length === 0) throw new Error("Missing inputs!");
  const respone = await Product.findByIdAndUpdate(
    pid,
    { $push: { images: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  );
  return res.status(200).json({
    success: respone ? true : false,
    updatedProductImages: respone ? respone : "Cannot update product images!",
  });
});

// Add variants
const addVariant = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { title, price, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req?.files?.images?.map((el) => el.path);
  if (!(title && price && color && thumb && images)) {
    throw new Error("Missing inputs");
  }

  const respone = await Product.findByIdAndUpdate(
    pid,
    {
      $push: {
        variant: {
          color,
          price,
          title,
          thumb,
          images,
          sku: uniqid().toUpperCase(),
        },
      },
    },
    { new: true }
  );
  return res.status(200).json({
    success: respone ? true : false,
    message: respone ? "A new variant has been added" : "Cannot update product images!",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadProductImages,
  addVariant,
  searchProduct
};
