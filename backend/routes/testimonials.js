// backend/routes/testimonials.js

import express from "express";
import Testimonial from "../models/Testimonial.js";

const router = express.Router();

const PROFANITY_WORDS = ["spam", "scam", "cheat", "fake", "badword", "abuse"];

// GET approved testimonials (newest first)
router.get("/", async (req, res) => {
  try {
    const { status = "approved" } = req.query;
    const testimonials = await Testimonial.find({ status })
      .sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("❌ Fetch testimonials error:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// POST a new guest testimonial
router.post("/", async (req, res) => {
  try {
    const { userId, name, location, rating, comment, avatarUrl } = req.body;

    if (!userId || !name || !rating || !comment) {
      return res.status(400).json({ error: "Required details are missing." });
    }

    // Basic profanity / spam filtering
    const containsProfanity = PROFANITY_WORDS.some(word => 
      comment.toLowerCase().includes(word)
    );

    const status = containsProfanity ? "pending" : "approved";

    const testimonial = new Testimonial({
      userId,
      name,
      location: location || "Guest",
      rating,
      comment,
      avatarUrl: avatarUrl || "",
      status
    });

    await testimonial.save();
    
    res.status(201).json({
      message: status === "approved" 
        ? "Thank you! Your testimonial has been shared successfully."
        : "Thank you! Your testimonial is submitted and pending moderation.",
      testimonial
    });
  } catch (error) {
    console.error("❌ Testimonial submission error:", error);
    res.status(500).json({ error: "Failed to submit testimonial" });
  }
});

export default router;
