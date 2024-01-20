const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    sucess: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    sucess: product ? true : false,
    data: product ? product : "Cannot get",
  });
});
const getAllProduct = asyncHandler(async (req, res) => {
  const products = await Product.find();
  return res.status(200).json({
    sucess: products ? true : false,
    data: products ? products : "Cannot get",
  });
});
const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const productUpdated = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    sucess: productUpdated ? true : false,
    data: productUpdated ? productUpdated : "Cannot update",
  });
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    sucess: deletedProduct ? true : false,
    data: deletedProduct ? deletedProduct : "Cannot delete",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
