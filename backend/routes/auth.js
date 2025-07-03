// routes/auth.js

import express from "express";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();
const router = express.Router();

// ✅ POST /users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // ✅ Admin login using .env
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({
      message: "Admin login successful",
      role: "admin",
      name: "Admin",
      email,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "User login successful",
      role: "user",
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /users/register
router.post("/register", async (req, res) => {
  try {
    const { name, age, country, phoneNumber, email, password } = req.body;

    // ✅ Basic validation
    if (!name || !age || !country || !phoneNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create and save new user
    const newUser = new User({
      name,
      age,
      country,
      phoneNumber,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
