const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  fromUser:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  toUser: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: false,
    default: "Let's swap some skills!",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
