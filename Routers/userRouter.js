const express=require("express");
const User =require("../models/User");
const app=express();
const router = express.Router();
app.use(express.json());
const bcrypt=require("bcrypt")


// Add New User (Admin Creates)
router.post("/addUser", async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

module.exports = router;


// Get User
router.get("/addUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Update Existing User
router.put("/addUser/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

module.exports = router;
