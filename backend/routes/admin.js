// routes/admin.js

import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ✅ POST /admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // ✅ Match with admin credentials from .env
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({
      message: "Admin login successful",
      role: "admin",
      email
    });
  }

  res.status(401).json({ message: "Invalid email or password" });
});

export default router;
