const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  avatar: {
    type: String,
    required: [true, "user avatar is required"],
  },
  socket_id: {
    type: String
  },
  expiry_time: {
    type: Date,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires one week from when it is created
  },
})

const User = new mongoose.model("User", userSchema);
console.log(User);
module.exports = User;