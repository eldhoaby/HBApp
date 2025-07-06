// import mongoose from "mongoose";

// const roomSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   city: { type: String, required: true },
//   address: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   amenities: { type: [String], required: true },
//   price: { type: Number, required: true },
//   rating: { type: Number, required: true },
//   reviewsCount: { type: Number, required: true },
//   images: { type: [String], required: true },
//   roomType: { type: String, required: true },
//   owner: {
//     _id: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User"
//     },
//     name: { type: String, required: true },
//     image: { type: String, default: "" }
//   }
// });

// const Room = mongoose.model("Room", roomSchema);
// export default Room;
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  amenities: { type: [String], required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewsCount: { type: Number, required: true },
  images: { type: [String], required: true },
  roomType: { type: String, required: true },
  owner: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,      // Made optional
      ref: "User"
    },
    name: { type: String, required: false }, // Optional
    image: { type: String, default: "" }
  }
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
