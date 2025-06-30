// // models/booking.js
// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User"
//   },
//   hotel: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Room" // assuming you don’t have a separate Hotel model
//   },
//   room: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Room"
//   },
//   checkInDate: String,
//   checkOutDate: String,
//   guests: Number,
//   totalPrice: Number,
//   isPaid: Boolean
// });

// export default mongoose.model("Booking", bookingSchema);

// models/booking.js
// models/booking.js

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String, // Keep it as string if you're not referencing User model with ObjectId
    required: true
  },
  hotel: {
    name: String,
    address: String
  },
  room: {
    roomType: String,
    images: [String]
  },
  checkInDate: String,
  checkOutDate: String,
  guests: Number,
  totalPrice: Number,
  isPaid: Boolean
});

export default mongoose.model("Booking", bookingSchema);

