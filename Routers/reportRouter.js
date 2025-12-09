const express = require("express");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Membership = require("../models/Membership");
const { verifyToken, adminOnly } = require("../middlewares/auth");

const router = express.Router();

// Master List of Books
router.get("/master-list-books", verifyToken, async (req, res) => {
  try {
    const books = await Book.find({ type: "book" });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err.message });
  }
});

// Master List of Movies
router.get("/master-list-movies", verifyToken, async (req, res) => {
  try {
    const movies = await Book.find({ type: "movie" });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Error fetching movies", error: err.message });
  }
});

// Master List of Memberships
router.get("/master-list-memberships", verifyToken, async (req, res) => {
  try {
    const memberships = await Membership.find().populate("userId");
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: "Error fetching memberships", error: err.message });
  }
});

// Active Issues (same as issued-books)
router.get("/issued-books", verifyToken, async (req, res) => {
  try {
    const query = { actualReturnDate: null };
    // Non-admin users should see only their own active issues
    if (req.user.role !== 'admin') query.userId = req.user.id;
    const transactions = await Transaction.find(query).populate("bookId").populate("userId");
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching issued books", error: err.message });
  }
});

// Overdue Returns
router.get("/overdue-returns", verifyToken, async (req, res) => {
  try {
    const today = new Date();
    const query = {
      actualReturnDate: null,
      expectedReturnDate: { $lt: today }
    };
    if (req.user.role !== 'admin') query.userId = req.user.id;
    const transactions = await Transaction.find(query).populate("userId");
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching overdue returns", error: err.message });
  }
});

// Issue Requests (pending transactions or can be same as issued books)
router.get("/issue-requests", verifyToken, async (req, res) => {
  try {
    // For now, we'll return all issued books as issue requests
    // In a real system, this might be a separate collection
    const query = { actualReturnDate: null };
    if (req.user.role !== 'admin') query.userId = req.user.id;
    const transactions = await Transaction.find(query)
      .populate("userId")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching issue requests", error: err.message });
  }
});

router.get("/returned-books", verifyToken, async (req, res) => {
  try {
    const query = { actualReturnDate: { $ne: null } };
    if (req.user.role !== 'admin') query.userId = req.user.id;
    const transactions = await Transaction.find(query).populate("bookId").populate("userId");
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching returned books", error: err.message });
  }
});

router.get("/fines", verifyToken, async (req, res) => {
  try {
    const query = { fineAmount: { $gt: 0 } };
    if (req.user.role !== 'admin') query.userId = req.user.id;
    const fines = await Transaction.find(query).populate("userId");
    res.json(fines);
  } catch (err) {
    res.status(500).json({ message: "Error fetching fines", error: err.message });
  }
});

module.exports = router;