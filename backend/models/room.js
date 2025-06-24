import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxCount: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  amenities: { type: [String], required: true },
  imageUrl: { type: String, required: true }
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
