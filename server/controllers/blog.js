const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing input");
  const response = await Blog.create(req.body);
  return res.json({
    success: response ? true : false,
    data: response ? response : "Cannot create",
  });
});
const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.json({
    success: response ? true : false,
    data: response ? response : "Cannot update",
  });
});
const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.json({
    success: response ? true : false,
    data: response ? response : "Cannot get",
  });
});
const excludeFields = "-refreshToken -password -role -createdAt updatedAt";
const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  //   populate : lấy thông tin của các trường từ các bảng khóa ngoại
  const blog = await Blog.findById(bid).populate("likes", excludeFields);
  return res.json({
    success: blog ? true : false,
    data: blog ? blog : "Cannot get",
  });
});
const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(bid);
  return res.json({
    success: blog ? true : false,
    data: blog ? blog : "Cannot delete",
  });
});

module.exports = {
  createBlog,
  updateBlog,
  getBlogs,
  getBlog,
  deleteBlog,
};
