const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const style = require('@dicebear/avatars-avataaars-sprites');
const {createAvatar} = require('@dicebear/avatars');
const User = require("../models/user");


exports.login = catchAsync(async (req, res, next) => {
  const {name} = req.body;

  const existing_user = await User.findOne({ name: name });
  if(existing_user) {
    return res.status(200).json({
      status: "success",
      message: "successfully logged in",
      userID: existing_user._id
    });
  } else {
    // if user is not created before than create a new one
    const new_user = await User.create({
      name
    });

    return res.status(200).json({
      status: "success",
      message: "successfully registered in",
      userID: new_user._id
    });
  }
})

exports.protect = catchAsync(async (req, res, next) => {
  let userId;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    userId = req.headers.authorization.split(" ")[1];
  }

  if (!userId) {
    return res.status(401).json({
      message: "User not logged in",
    });
  }

  // 3) Check if user still exists
  const this_user = await User.findById(userId);
  if (!this_user) {
    return res.status(401).json({
      message: "User no longer exists",
    });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = this_user;
  next();
})