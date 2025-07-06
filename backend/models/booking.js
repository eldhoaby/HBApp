import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,   // ✅ Use ObjectId
    ref: "User",                            // ✅ Reference the User model
    required: true
  },
  hotel: {
    name: String,
    address: String
  },
  room: {
    roomType: String,
    name: String,
    address: String,
    images: [String],
    amenities: [String],
    price: Number
  },
  checkInDate: String,
  checkOutDate: String,
  guests: Number,
  totalPrice: Number,
  isPaid: Boolean
}, {
  timestamps: true
});

export default mongoose.model("Booking", bookingSchema);
