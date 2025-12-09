const express = require("express");
const Membership = require("../models/Membership");
const router = express.Router();
const { verifyToken, adminOnly } = require("../middlewares/auth");

// -----------------------------
// Create Membership (Admin only)
// -----------------------------
router.post("/membership", verifyToken, adminOnly, async (req, res) => {
  try {
    const { userId, type, contactName, phone, aadhar, address } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ message: "userId and type are mandatory" });
    }

    // Check if user already has a membership
    const existing = await Membership.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "User already has a membership" });
    }

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (type === "6months") endDate.setMonth(endDate.getMonth() + 6);
    else if (type === "1year") endDate.setFullYear(endDate.getFullYear() + 1);
    else if (type === "2years") endDate.setFullYear(endDate.getFullYear() + 2);
    else return res.status(400).json({ message: "Invalid membership type" });

    // Generate unique membership number
    const membershipNumber = "MEM" + Date.now();

    const membership = new Membership({
      userId,
      membershipNumber,
      type,
      contactName,
      phone,
      aadhar,
      address,
      startDate,
      endDate,
      status: "active",
    });

    await membership.save();

    res.status(201).json({ message: "Membership created", membership });
  } catch (error) {
    res.status(500).json({ message: "Error creating membership", error });
  }
});

// -----------------------------
// Get All Memberships (for reports - accessible to all authenticated users)
// -----------------------------
router.get("/memberships", verifyToken, async (req, res) => {
  try {
    const memberships = await Membership.find().populate("userId", "_id name email");
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: "Error fetching memberships", error });
  }
});

// -----------------------------
// Get Membership by membership number (Admin only)
// -----------------------------
router.get("/membership/:membershipNumber", verifyToken, adminOnly, async (req, res) => {
  try {
    const membership = await Membership.findOne({
      membershipNumber: req.params.membershipNumber,
    });

    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: "Error fetching membership", error });
  }
});

// -----------------------------
// Update Membership (extend/cancel) (Admin only)
// -----------------------------
router.put("/membership/:membershipNumber", verifyToken, adminOnly, async (req, res) => {
  try {
    const { type, status } = req.body;

    const membership = await Membership.findOne({
      membershipNumber: req.params.membershipNumber,
    });

    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    // Extend duration if type is changed
    if (type) {
      const newEndDate = new Date();
      if (type === "6months") newEndDate.setMonth(newEndDate.getMonth() + 6);
      else if (type === "1year") newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      else if (type === "2years") newEndDate.setFullYear(newEndDate.getFullYear() + 2);
      else return res.status(400).json({ message: "Invalid membership type" });

      membership.type = type;
      membership.endDate = newEndDate;
    }

    // Update status
    if (status) {
      if (!["active", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      membership.status = status;
    }

    await membership.save();

    res.json({ message: "Membership updated", membership });
  } catch (error) {
    res.status(500).json({ message: "Error updating membership", error });
  }
});

module.exports = router;
