const express = require("express");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Membership = require("../models/Membership");
const { verifyToken, adminOnly } = require("../middlewares/auth");

const router = express.Router();

// -----------------------------
// Book Issue
// -----------------------------
router.post("/issue-book", verifyToken, async (req, res) => {
  try {
    const { userId, bookId, remarks } = req.body;

    // Validate mandatory fields
    if (!userId || !bookId) {
      return res.status(400).json({ message: "User ID and Book ID are required" });
    }

    // Check if user has an active membership
    const membership = await Membership.findOne({ userId, status: "active" });
    if (!membership) {
      return res.status(400).json({ message: "User does not have an active membership" });
    }

    // Check if book is available
    const book = await Book.findById(bookId);
    if (!book || book.status !== "available") {
      return res.status(400).json({ message: "Book not available for issue" });
    }

    // Calculate issue and return dates
    const issueDate = new Date();
    const expectedReturnDate = new Date(issueDate);
    expectedReturnDate.setDate(expectedReturnDate.getDate() + 15); // 15 days ahead

    // Create transaction
    const transaction = new Transaction({
      userId,
      bookId,
      bookName: book.title,
      authorName: book.author,
      serialNo: book.serialNo,
      issueDate,
      expectedReturnDate,
      remarks: remarks || "",
    });

    await transaction.save();

    // Update book status to "issued"
    book.status = "issued";
    await book.save();

    res.status(201).json({ message: "Book issued successfully", transaction });
  } catch (err) {
    res.status(500).json({ message: "Error issuing book", error: err.message });
  }
});

// -----------------------------
// Get My Issued Books (for regular users)
// -----------------------------
router.get("/my-issued-books", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token
    
    // Find all transactions for this user that haven't been returned
    const transactions = await Transaction.find({ 
      userId: userId,
      actualReturnDate: null 
    }).populate("bookId");
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching issued books", error: err.message });
  }
});

// -----------------------------
// Return Book
// -----------------------------
router.post("/return-book", verifyToken, async (req, res) => {
  try {
    const { transactionId, actualReturnDate, finePaid, remarks } = req.body;

    if (!transactionId || !actualReturnDate) {
      return res.status(400).json({ message: "Transaction ID and Return Date are required" });
    }

    const transaction = await Transaction.findById(transactionId).populate("bookId");
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if user is authorized to return this book
    // Users can only return their own books, unless they're admin
    if (req.user.role !== "admin" && transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only return your own books" });
    }

    if (transaction.actualReturnDate) {
      return res.status(400).json({ message: "Book already returned" });
    }

    // Update return date
    const returnDate = new Date(actualReturnDate);
    transaction.actualReturnDate = returnDate;
    transaction.remarks = remarks || "";

    // Calculate fine if returned late
    const lateDays = Math.ceil((returnDate - transaction.expectedReturnDate) / (1000 * 60 * 60 * 24));
    transaction.fineAmount = lateDays > 0 ? lateDays * 10 : 0; // example: 10 currency per late day
    transaction.finePaid = transaction.fineAmount > 0 ? !!finePaid : true; // fine must be paid if >0

    if (transaction.fineAmount > 0 && !transaction.finePaid) {
      return res.status(400).json({ message: "Fine is pending, cannot complete return" });
    }

    await transaction.save();

    // Update book status to available
    const book = await Book.findById(transaction.bookId);
    book.status = "available";
    await book.save();

    res.json({ message: "Book returned successfully", transaction });
  } catch (err) {
    res.status(500).json({ message: "Error returning book", error: err.message });
  }
});



module.exports = router;
