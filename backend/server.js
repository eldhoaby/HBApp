import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import razorpayRoutes from './routes/razorpay.js';
import paymentRoutes from "./routes/payment.js";



import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import adminRoutes from "./routes/admin.js";
import bookingRoutes from "./routes/bookings.js";


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
// Health check
app.get("/", (req, res) => res.send("API is working fine"));

// Routes
app.use("/users", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/", adminRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payment", paymentRoutes);
app.use("/razorpay", razorpayRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start Server LAST
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
