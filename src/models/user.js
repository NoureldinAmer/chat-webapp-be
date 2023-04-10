const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
  },
  socket_IDs: {
    type: [String],
  },
  expiry_time: {
    type: Date,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires one week from when it is created
  },
  status: {
    type: String,
    enum: ["Online", "Offline"]
  }
})

const User = new mongoose.model("User", userSchema);
module.exports = User;