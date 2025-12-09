const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    membershipNumber: { type: String, unique: true, required: true },
    // Snapshot of contact details captured at time of membership creation
    contactName: { type: String },
    phone: { type: String },
    aadhar: { type: String },
    address: { type: String },
    type: {
        type: String,
        enum: ["6months", "1year", "2years"],
        default: "6months"
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "cancelled"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Membership", membershipSchema);
