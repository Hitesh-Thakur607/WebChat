const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  // ...other fields...
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);