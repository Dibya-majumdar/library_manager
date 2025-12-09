const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { verifyToken, adminOnly } = require("../middlewares/auth");

// ADMIN — ADD BOOK
router.post("/books", verifyToken, adminOnly, async (req, res) => {
    try {
        const { title, author, type, category, serialNo, status, cost } = req.body;

        // Optional: check if serialNo already exists
        const existingBook = await Book.findOne({ serialNo });
        if (existingBook) {
            return res.status(400).json({ msg: "Serial number already exists" });
        }

        const book = new Book({ title, author, type, category, serialNo, status, cost: cost || 0 });
        await book.save();  // This actually saves in DB
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// USER + ADMIN — GET ALL BOOKS
router.get("/books", verifyToken, async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// USER + ADMIN — GET ONE BOOK
router.get("/books/:id", verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: "Book not found" });
        res.json(book);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// ADMIN — UPDATE BOOK
router.put("/books/:id", verifyToken, adminOnly, async (req, res) => {
    try {
        const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ msg: "Book not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// ADMIN — DELETE BOOK
router.delete("/books/:id", verifyToken, adminOnly, async (req, res) => {
    try {
        const deleted = await Book.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ msg: "Book not found" });
        res.json({ msg: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
