const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ msg: "Wrong password" });

        const token = jwt.sign(
            { id: user._id,  },//role: user.role
            "SECRET123",
            { expiresIn: "7d" }
        );
        res.cookie("token",token);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
