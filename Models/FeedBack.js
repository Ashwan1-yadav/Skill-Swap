const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    message : {
        type: String,
        required: true,
        default: "No message provided"
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);