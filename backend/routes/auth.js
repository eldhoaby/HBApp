import express from "express";
import dotenv from "dotenv";
import User from "../models/user.js";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";

dotenv.config();
const router = express.Router();

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// Secure storage configuration for uploaded profile avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype === "image/png" ? ".png" : file.mimetype === "image/webp" ? ".webp" : ".jpg";
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randomName}${ext}`);
  }
});

// File content filter to validate extensions and prevent insecure files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP image uploads are allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file limit
  fileFilter
});

// ✅ POST /users/upload-avatar - Secure avatar file upload with error handling
router.post("/upload-avatar", (req, res) => {
  upload.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image too large, please upload a photo under 5MB" });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded." });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, url: fileUrl });
  });
});

// ✅ GET /users - Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /users/:id - Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /users/login - Admin + User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // ✅ Admin login
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

  // ✅ User login
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
      avatar: user.avatar || "",
      theme: user.theme || "system",
      currency: user.currency || "₹",
      language: user.language || "English"
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /users/register - New user registration
router.post("/register", async (req, res) => {
  try {
    const { name, age, country, phoneNumber, email, password } = req.body;

    if (!name || !age || !country || !phoneNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, age, country, phoneNumber, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /users/:id/bookings - Fetch user bookings
router.get("/:id/bookings", async (req, res) => {
  try {
    const Booking = mongoose.model("Booking");
    const bookings = await Booking.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Fetch user bookings error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /users/:id/wishlist - Fetch user wishlist (populated)
router.get("/:id/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.wishlist || []);
  } catch (error) {
    console.error("Get wishlist error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /users/:id/wishlist/:hotelId - Add to wishlist
router.post("/:id/wishlist/:hotelId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { hotelId } = req.params;
    if (!user.wishlist.includes(hotelId)) {
      user.wishlist.push(hotelId);
    }
    await user.save();
    res.json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Add wishlist error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE /users/:id/wishlist/:hotelId - Remove from wishlist
router.delete("/:id/wishlist/:hotelId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { hotelId } = req.params;
    user.wishlist = user.wishlist.filter(id => id.toString() !== hotelId);
    await user.save();
    res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Delete wishlist error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /users/:id/wishlist - Toggle room in wishlist (Backward compatibility)
router.post("/:id/wishlist", async (req, res) => {
  try {
    const { roomId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.wishlist.indexOf(roomId);
    let favorited = false;
    if (index === -1) {
      user.wishlist.push(roomId);
      favorited = true;
    } else {
      user.wishlist.splice(index, 1);
      favorited = false;
    }
    await user.save();
    res.json({ 
      message: favorited ? "Added to wishlist" : "Removed from wishlist", 
      wishlist: user.wishlist, 
      favorited 
    });
  } catch (error) {
    console.error("Wishlist error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT /users/:id - Update user
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE /users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
