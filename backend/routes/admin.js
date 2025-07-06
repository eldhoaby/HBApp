import express from "express";
import dotenv from "dotenv";
import Booking from "../models/booking.js";
import User from "../models/user.js";  // ✅ Make sure this exists and contains `name`, `phone`

dotenv.config();

const router = express.Router();

// ✅ Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

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

// ✅ Admin Metrics Route
router.get("/metrics", async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate("userId", "name phoneNumber")
      .sort({ createdAt: -1 });

    const totalBookings = allBookings.length;
    const totalRevenue = allBookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
    const pendingBookings = allBookings.filter(b => !b.isPaid).length;

    const bookings = allBookings.map(b => ({
      userName: b.userId?.name || "N/A",
      phone: b.userId?.phoneNumber || "N/A",
      roomName: b.room?.name || "N/A",
      amount: b.totalPrice || 0,
      status: b.isPaid ? "Completed" : "Pending"
    }));

    res.status(200).json({
      totalBookings,
      totalRevenue,
      pendingBookings,
      bookings // ✅ all bookings, not just recent
    });
  } catch (err) {
    console.error("❌ Admin metrics error:", err);
    res.status(500).json({ error: "Failed to load metrics" });
  }
});


export default router;
