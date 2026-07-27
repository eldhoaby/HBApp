// backend/seed_reviews.js

import mongoose from "mongoose";
import "dotenv/config";
import Room from "./models/room.js";
import User from "./models/user.js";
import Booking from "./models/booking.js";
import Review from "./models/Review.js";

const reviewerNames = [
  "Sarah Jenkins", "David Chen", "Elena Rostova", "Marcus Thorne", "Aria Patel",
  "Liam O'Connor", "Sofia Rodriguez", "Kenji Tanaka", "Amara Diop", "Gabriel Silva",
  "Chloe Leblanc", "Oliver Schmid", "Amira Mansour", "Vikram Malhotra", "Emily Watson"
];

const reviewerAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150"
];

const comments = [
  "The pool view was absolutely breathtaking, and the room was sparkling clean. Wi-Fi was fast enough for my remote meetings.",
  "Great central location, close to restaurants and transit. Complimentary breakfast had a wonderful selection of hot foods.",
  "Beds were super comfortable and the staff went above and beyond to accommodate our early check-in. Highly recommended!",
  "Excellent value for money. Cozy rooms, decent TV, and friendly room service. Will definitely stay here again.",
  "A beautiful stay! The traditional decor felt very authentic, and the bathroom had excellent water pressure.",
  "Very clean, neat, and quiet. Perfect place to unwind. The air conditioning was quiet and worked perfectly.",
  "The location near the beach was superb! Woke up to the sound of waves every morning. Fast Wi-Fi too.",
  "Loved the rooftop lounge and the gym facilities. Safe parking area and polite reception desk staff.",
  "Nice breakfast options and comfortable couch in the lobby. The room size was a bit small but very cozy and functional.",
  "Absolutely stunning garden area. Perfect place for a weekend getaway. Everything was clean and well-maintained."
];

const seedReviews = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI.endsWith("/")
      ? `${process.env.MONGODB_URI}HomyStay`
      : `${process.env.MONGODB_URI}/HomyStay`;

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // 1. Clean existing reviews to start fresh
    await Review.deleteMany({});
    console.log("Cleared existing reviews.");

    // 2. Fetch all rooms
    const rooms = await Room.find({});
    if (rooms.length === 0) {
      console.log("No rooms found in database. Please seed rooms first.");
      process.exit(0);
    }
    console.log(`Found ${rooms.length} rooms to seed reviews for.`);

    // 3. Ensure a dummy seed user exists
    let dummyUser = await User.findOne({ email: "seedguest@homystay.com" });
    if (!dummyUser) {
      dummyUser = new User({
        name: "Seed Guest Account",
        email: "seedguest@homystay.com",
        password: "seedpassword123",
        phoneNumber: "9876543210",
        age: 30,
        country: "India",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      });
      await dummyUser.save();
      console.log("Created dummy seed user.");
    }

    const today = new Date();

    // 4. Generate reviews for each room
    for (const room of rooms) {
      // Generate between 5 and 12 reviews per room
      const reviewCount = Math.floor(Math.random() * 8) + 5; 
      console.log(`Seeding ${reviewCount} reviews for room: ${room.name}...`);

      let totalRating = 0;

      for (let i = 0; i < reviewCount; i++) {
        // Pick reviewer details
        const reviewerName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
        const reviewerAvatar = reviewerAvatars[Math.floor(Math.random() * reviewerAvatars.length)];
        const comment = comments[Math.floor(Math.random() * comments.length)];

        // Generate rating: ~60% 5-star, ~30% 4-star, ~10% 3-star
        const rand = Math.random();
        let rating = 5;
        if (rand > 0.6 && rand <= 0.9) {
          rating = 4;
        } else if (rand > 0.9) {
          rating = 3;
        }
        totalRating += rating;

        // Generate date spread across last 10 to 300 days
        const daysAgo = Math.floor(Math.random() * 290) + 10;
        const reviewDate = new Date(today);
        reviewDate.setDate(today.getDate() - daysAgo);

        // Generate a corresponding booking (so review verification checks succeed / audit is consistent)
        const checkInDate = new Date(reviewDate);
        checkInDate.setDate(reviewDate.getDate() - 3); // Stayed 3 days
        const checkOutDate = new Date(reviewDate);
        checkOutDate.setDate(reviewDate.getDate() - 1); // Checked out 1 day before review date

        const checkInStr = checkInDate.toISOString().split("T")[0];
        const checkOutStr = checkOutDate.toISOString().split("T")[0];

        const randomReviewerId = new mongoose.Types.ObjectId();

        const booking = new Booking({
          userId: randomReviewerId,
          hotelId: room._id,
          roomId: room._id,
          hotel: { name: room.name, address: room.address },
          room: {
            roomType: room.roomType,
            images: room.images,
            name: room.name,
            address: room.address,
            amenities: room.amenities,
            price: room.price,
          },
          checkInDate: checkInStr,
          checkOutDate: checkOutStr,
          guests: 2,
          totalPrice: room.price * 2,
          isPaid: true,
          status: "Completed",
          name: reviewerName,
          email: `${reviewerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          createdAt: checkInDate
        });
        await booking.save();

        // Create the review
        const review = new Review({
          userId: randomReviewerId,
          userName: reviewerName,
          userAvatar: "",
          roomId: room._id,
          bookingId: booking._id,
          rating,
          comment,
          photo: "",
          status: "approved",
          createdAt: reviewDate
        });
        await review.save();
      }

      // Update room rating and reviewsCount in Mongoose
      const avgRating = parseFloat((totalRating / reviewCount).toFixed(1));
      await Room.findByIdAndUpdate(room._id, {
        rating: avgRating,
        reviewsCount: reviewCount
      });
    }

    console.log("Seeding completed successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
};

seedReviews();
