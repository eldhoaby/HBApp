// import mongoose from "mongoose";

// const roomSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   city: { type: String, required: true },
//   address: { type: String, required: true },
//   maxCount: { type: Number, required: true },
//   phoneNumber: { type: String, required: true },
//   amenities: { type: [String], required: true },
//   price: { type: Number, required: true },
//   rating: { type: Number, required: true },
//   reviewsCount: { type: Number, required: true },
//   images: { type: [String], required: true }, // array of image URLs
//   roomType: { type: String, required: true }, // e.g. "Luxury Room"
//   owner: {
//     name: String,
//     image: String
//   }
// });

// const Room = mongoose.model("Room", roomSchema);
// export default Room;

// models/room.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  maxCount: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  amenities: { type: [String], required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewsCount: { type: Number, required: true },
  images: { type: [String], required: true },
  roomType: { type: String, required: true },
  owner: {
    name: String,
    image: String
  }
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
