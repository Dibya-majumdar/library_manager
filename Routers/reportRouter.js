const express = require("express");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Membership = require("../models/Membership");
const { verifyToken, adminOnly } = require("../middlewares/auth");

const router = express.Router();


router.get("/issued-books", verifyToken, async (req, res) => {
  const transactions = await Transaction.find({ actualReturnDate: null }).populate("bookId");
  res.json(transactions);
});

router.get("/returned-books", verifyToken, async (req, res) => {
  const transactions = await Transaction.find({ actualReturnDate: { $ne: null } }).populate("bookId");
  res.json(transactions);
});

router.get("/fines", verifyToken, async (req, res) => {
  const fines = await Transaction.find({ fineAmount: { $gt: 0 } });
  res.json(fines);
});

module.exports = router;