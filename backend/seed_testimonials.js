// backend/seed_testimonials.js

import mongoose from "mongoose";
import "dotenv/config";
import Testimonial from "./models/Testimonial.js";

const sampleTestimonials = [
  {
    name: "Sarah Jenkins",
    location: "New York, USA",
    rating: 5,
    comment: "HomyStay made our vacation planning so simple! The AI Chatbot suggested the perfect beachfront room within seconds, and the local guide recommendations were spot on. Highly recommended!",
    avatarUrl: "",
    status: "approved"
  },
  {
    name: "David Chen",
    location: "Singapore",
    rating: 5,
    comment: "Booking with HomyStay was a seamless experience. The pricing is transparent, dates checking was accurate, and the customer support chatbot resolved my questions instantly. A premium service!",
    avatarUrl: "",
    status: "approved"
  },
  {
    name: "Elena Rostova",
    location: "London, UK",
    rating: 4,
    comment: "The room was clean and matching the pictures exactly. Navigating through different hotel properties was swift and easy. Five stars for the booking interface and search filters!",
    avatarUrl: "",
    status: "approved"
  },
  {
    name: "Aria Patel",
    location: "Mumbai, India",
    rating: 5,
    comment: "I love the detailed room walkthroughs, filters choices, and the dynamic pricing matching our currency preference instantly. Will book all my upcoming stays via HomyStay!",
    avatarUrl: "",
    status: "approved"
  },
  {
    name: "Oliver Schmid",
    location: "Berlin, Germany",
    rating: 4,
    comment: "A highly intuitive hotel booking platform. The cancellation flow is transparent and customer service responses are quick. Very impressed with the design aesthetic.",
    avatarUrl: "",
    status: "approved"
  }
];

const seedTestimonials = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI.endsWith("/")
      ? `${process.env.MONGODB_URI}HomyStay`
      : `${process.env.MONGODB_URI}/HomyStay`;

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for testimonials seeding...");

    await Testimonial.deleteMany({});
    console.log("Cleared old testimonials.");

    for (const t of sampleTestimonials) {
      const doc = new Testimonial({
        ...t,
        userId: new mongoose.Types.ObjectId()
      });
      await doc.save();
    }

    console.log("Seeded 5 testimonials successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Testimonials seeding failed:", err);
    process.exit(1);
  }
};

seedTestimonials();
