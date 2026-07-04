// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   hotel: {
//     name: String,
//     address: String
//   },
//   room: {
//     roomType: String,
//     name: String,
//     address: String,
//     images: [String],
//     amenities: [String],
//     price: Number
//   },
//   checkInDate: {
//     type: String,
//     required: true
//   },
//   checkOutDate: {
//     type: String,
//     required: true
//   },
//   guests: {
//     type: Number,
//     required: true
//   },
//   totalPrice: {
//     type: Number,
//     required: true
//   },
//   isPaid: {
//     type: Boolean,
//     default: false
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "Confirmed", "Cancelled by Admin", "Cancelled by User"],
//     default: "Pending"
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model("Booking", bookingSchema);
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hotel: {
    name: String,
    address: String
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  room: {
    roomType: String,
    name: String,
    address: String,
    images: [String],
    amenities: [String],
    price: Number
  },
  checkInDate: {
    type: String,
    required: true
  },
  checkOutDate: {
    type: String,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "Pending"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid"
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed"
  }
}, {
  timestamps: true
});

export default mongoose.model("Booking", bookingSchema);