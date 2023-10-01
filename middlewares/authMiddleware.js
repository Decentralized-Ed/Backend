const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookie.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
    } catch (err) {
      res.status(200).json({
        status: 401,
        message: "Invalid token",
      });
    }
  } else {
    res.status(201).json({
      status: 401,
      message: "Unautherised user , no token !",
    });
  }
});

module.exports = protect;
