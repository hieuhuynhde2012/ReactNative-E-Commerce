const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const data = require('../../data/data_2.json');
const slugify = require('slugify');
const categoryData = require('../../data/cate_brand');
const ProductCategory = require('../models/productCategory');

// Insert product data
const fn = async (product) => {
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name) + Math.round(Math.random() * 1000) + '',
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    color: product?.variants?.find((el) => el.label === 'Color')?.variants[0] || 'BLACK',
    thumb: product?.thumb,
    totalRating: 0,
  });
};

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) {
    promises.push(fn(product));
  }
  await Promise.all(promises);
  return res.json('Done!');
});

// Insert product category data
const fn2 = async (category) => {
  await ProductCategory.create({
    title: category?.cate,
    brand: category?.brand,
    image: category?.image,
  });
};

const insertProductCategory = asyncHandler(async (req, res) => {
  const promises = [];
  for (let category of categoryData) {
    promises.push(fn2(category));
  }
  await Promise.all(promises);
  return res.json('Done!');
});

module.exports = { insertProduct, insertProductCategory };
