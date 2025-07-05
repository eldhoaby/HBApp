import express from "express";
import dotenv from "dotenv";
import Booking from "../models/booking.js";

dotenv.config();

const router = express.Router();

// ✅ Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Match credentials from .env
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

// ✅ Admin Dashboard Metrics
router.get("/metrics", async (req, res) => {
  try {
    const allBookings = await Booking.find().sort({ createdAt: -1 });

    const totalBookings = allBookings.length;
    const totalRevenue = allBookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
    const pendingBookings = allBookings.filter(b => !b.isPaid).length;

    const recentBookings = allBookings.slice(0, 5).map(b => ({
      userName: b.userId, // Replace with actual user name if you have a User model
      roomName: b.room?.name || "N/A",
      amount: b.totalPrice || 0,
      status: b.isPaid ? "Completed" : "Pending"
    }));

    res.status(200).json({
      totalBookings,
      totalRevenue,
      pendingBookings,
      recentBookings
    });
  } catch (err) {
    console.error("❌ Admin metrics error:", err);
    res.status(500).json({ error: "Failed to load metrics" });
  }
});

export default router;
