// backend/models/Testimonial.js

import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "approved"
  }
}, {
  timestamps: true
});

export default mongoose.model("Testimonial", testimonialSchema);
