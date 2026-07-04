// backend/routes/reviews.js

import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import Review from "../models/Review.js";
import Room from "../models/room.js";
import Booking from "../models/booking.js";

const router = express.Router();

// Multer setup for review optional photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/reviews/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `review_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
  }
});

// ✅ GET /rooms/:roomId/reviews - Fetch approved reviews for a room
router.get("/rooms/:roomId/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      roomId: req.params.roomId,
      status: "approved"
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ✅ GET /rooms/:roomId/check-eligibility - Verify if user can write review
router.get("/rooms/:roomId/check-eligibility", async (req, res) => {
  try {
    const { userId } = req.query;
    const { roomId } = req.params;
    if (!userId) return res.json({ eligible: false });

    const dbRoom = await Room.findById(roomId);
    if (!dbRoom) return res.status(404).json({ error: "Room not found" });

    // Check if the user has already left a review for this room
    const existingReview = await Review.findOne({ userId, roomId });
    if (existingReview) {
      return res.json({ eligible: false, message: "You have already reviewed this room." });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    
    // Find any completed booking
    const verifiedBooking = await Booking.findOne({
      userId,
      $or: [
        { roomId: roomId },
        { hotelId: roomId },
        { "room.name": dbRoom.name }
      ],
      status: { $nin: ["Cancelled by User", "Cancelled by Admin"] },
      checkOutDate: { $lte: todayStr }
    });

    res.json({ eligible: !!verifiedBooking });
  } catch (error) {
    console.error("Check eligibility error:", error);
    res.json({ eligible: false });
  }
});

// ✅ POST /rooms/:roomId/reviews - Create moderated review (with optional photo upload)
router.post("/rooms/:roomId/reviews", upload.single("photo"), async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, userName, userAvatar, rating, comment } = req.body;

    if (!userId || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const dbRoom = await Room.findById(roomId);
    if (!dbRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    // 1. Verify user completed stay
    const todayStr = new Date().toISOString().split("T")[0];
    const verifiedBooking = await Booking.findOne({
      userId,
      $or: [
        { roomId: roomId },
        { hotelId: roomId },
        { "room.name": dbRoom.name }
      ],
      status: { $nin: ["Cancelled by User", "Cancelled by Admin"] },
      checkOutDate: { $lte: todayStr }
    });

    if (!verifiedBooking) {
      return res.status(403).json({ error: "Only verified guests with a completed stay can write a review." });
    }

    // 2. Moderation Check: Profanity and Spam Links
    const badWords = ["scam", "fraud", "cheat", "abuse", "fake", "badword"];
    const commentLower = comment.toLowerCase();
    
    let isSuspicious = false;
    for (const word of badWords) {
      if (commentLower.includes(word)) {
        isSuspicious = true;
        break;
      }
    }

    const hasLink = /https?:\/\/[^\s]+/i.test(comment) || /www\.[^\s]+/i.test(comment);
    if (hasLink) {
      isSuspicious = true;
    }

    const status = isSuspicious ? "flagged" : "approved";

    // 3. Save Review
    let photoUrl = "";
    if (req.file) {
      photoUrl = `http://localhost:3000/uploads/reviews/${req.file.filename}`;
    }

    const review = new Review({
      userId,
      userName,
      userAvatar: userAvatar || "",
      roomId,
      bookingId: verifiedBooking._id,
      rating: Number(rating),
      comment,
      photo: photoUrl,
      status
    });

    const savedReview = await review.save();

    // 4. Update Hotel average rating if approved
    if (status === "approved") {
      const approvedReviews = await Review.find({ roomId, status: "approved" });
      const reviewsCount = approvedReviews.length;
      const avgRating = reviewsCount > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
        : 0;

      await Room.findByIdAndUpdate(roomId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewsCount
      });
    }

    res.status(201).json({
      message: status === "flagged" 
        ? "Your review was submitted and is pending approval by moderation." 
        : "Review submitted successfully!",
      review: savedReview
    });

  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: error.message || "Failed to submit review" });
  }
});

export default router;
