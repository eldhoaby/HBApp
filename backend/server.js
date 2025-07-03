// server.js

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

// Route imports
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import adminRoutes from "./routes/admin.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payment.js";
import razorpayRoutes from "./routes/razorpay.js";

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => res.send("✅ API is working fine"));

// ✅ Mount API routes
app.use("/users", authRoutes);          // Handles /users/login, /users/register, etc.
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payment", paymentRoutes);
app.use("/razorpay", razorpayRoutes);
app.use("/admin", adminRoutes);         // Changed from "/" to "/admin" to avoid route conflict

// ❌ Catch-all 404 handler (should be after all routes)
app.use((req, res) => {
  res.status(404).json({ error: "❌ Route not found" });
});

// ❗ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
