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
  status: {            // <--- Add this field
    type: String,
    default: "Pending" // or whatever default you prefer
  }
}, {
  timestamps: true
});

export default mongoose.model("Booking", bookingSchema);