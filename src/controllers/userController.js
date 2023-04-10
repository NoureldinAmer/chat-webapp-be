const catchAsync = require("../utils/catchAsync");
const style = require('@dicebear/avatars-avataaars-sprites');
const {createAvatar} = require('@dicebear/avatars');
const User = require("../models/user");
const Message = require("../models/message");

exports.chatLog = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const chat_log = await Message.find(
    {
      from: userID,
    }
  )

  return res.status(200).json({
    status: "success",
    length: chat_log.length,
    chat_log: chat_log,
  });
})