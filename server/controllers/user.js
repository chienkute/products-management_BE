const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");
const jwt = require("jsonwebtoken");
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !lastname || !firstname)
    return res.status(400).json({
      sucess: false,
      message: "Missing input",
    });
  const user = await User.findOne({ email });
  if (user) throw new Error("User has existed");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      sucess: newUser ? true : false,
      mes: newUser ? "Register is succesfully" : "Something went wrong",
    });
  }
});
//Access token : Xác thực ng dùng , phân quyền ng dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      sucess: false,
      message: "Missing input",
    });
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // tách paswd , role ra khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccessToken(response._id, role);
    const newRefreshToken = generateRefreshToken(response._id);
    // Lưu refesh token vào db
    await User.findByIdAndUpdate(
      response._id,
      { newRefreshToken },
      { new: true }
    );
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      sucess: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials");
  }
});
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById({ _id }).select(
    "-refreshToken -password -role"
  );
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found",
  });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  //Lấy token từ cookies
  const cookie = req.cookies;
  // Check xem có token không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Check token có hợp lệ hay không
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    sucess: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refreshToken in cookies");
  // Xóa refreshToken trong db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // Xóa ở cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout is done",
  });
});
const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -role");
  return res.status(200).json({
    sucess: response ? true : false,
    users: response,
  });
});
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing id");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    sucess: response ? true : false,
    deletedUser: response ? "User has been deleted" : "No user been deleted",
  });
});
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    sucess: response ? true : false,
    updated: response ? response : "Something wrong",
  });
});
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    sucess: response ? true : false,
    updated: response ? response : "Something wrong",
  });
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
};
