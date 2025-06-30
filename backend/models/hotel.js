// models/hotel.js
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: String,
  image: String
});

export default mongoose.model("Hotel", hotelSchema);
