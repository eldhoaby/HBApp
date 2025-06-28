// models/booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
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
