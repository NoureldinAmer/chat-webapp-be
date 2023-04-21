const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: [true, "name is required"],
  },
  type: {
    type: String,
    enum: ["text", "media", "document", "link", "sticker"],
  },
  link: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  expriy_date: {
    type: Date,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires one week from when it is created
  }
})

const Message = new mongoose.model("Message", messageSchema);
module.exports = Message;