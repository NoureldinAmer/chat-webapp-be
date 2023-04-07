const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const style = require('@dicebear/avatars-avataaars-sprites');
const {createAvatar} = require('@dicebear/avatars');
const User = require("../models/user");


exports.register = catchAsync(async (req, res, next) => {
  const {name} = req.body;
  
  const avatar = createAvatar(style, {
    seed: name,
    style: 'transparent',
    scale: 20
  });

  const existing_user = await User.findOne({ name: name });
  if(existing_user) {
    return res.status(400).json({
      status: "error",
      message: "Name already in use, Please login.",
    });
  } else {
    // if user is not created before than create a new one
    const new_user = await User.create({
      name, 
      avatar
    });

    // generate an otp and send to email
    req.userId = new_user._id;
    return res.status(200).json({
      status: "success",
      message: "Successfully registered user",
      userId: new_user._id
    });
  }
})