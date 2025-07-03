import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String, // fine for now
    required: true
  },
  hotel: {
    name: String,
    address: String
  },
  room: {
    roomType: String,
    name: String,         // ✅ Add this
    address: String,      // ✅ Add this
    images: [String],
    amenities: [String],  // ✅ Add this
    price: Number         // ✅ Add this
  },
  checkInDate: String,
  checkOutDate: String,
  guests: Number,
  totalPrice: Number,
  isPaid: Boolean
});

export default mongoose.model("Booking", bookingSchema);
