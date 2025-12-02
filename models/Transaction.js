const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    // -------- ISSUE DETAILS --------
    issueDate: {
      type: Date,
      required: true,
    },

    expectedReturnDate: {
      type: Date,
      required: true,
    },

    bookName: {
      type: String,
      required: true,
    },

    authorName: {
      type: String,
      required: true,
    },

    serialNo: {
      type: String,
      required: true,
    },

    // -------- RETURN DETAILS --------
    actualReturnDate: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },

    // -------- FINE DETAILS --------
    fineAmount: {
      type: Number,
      default: 0,
    },

    finePaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
