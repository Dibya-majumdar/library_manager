const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, enum: ["book", "movie"], default: "book" },
    category: { type: String, required: true },
    serialNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ["available", "issued"], default: "available" },
    cost: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
