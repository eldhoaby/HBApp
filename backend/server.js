import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import adminRoutes from "./routes/admin.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/", adminRoutes);

app.get("/", (req, res) => res.send("API is working fine"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
