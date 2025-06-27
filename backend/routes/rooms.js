import express from "express";
import Room from "../models/room.js";
import Booking from "../models/booking.js"; // ✅ Required to check date conflicts

const router = express.Router();

// ✅ Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).send("Error fetching rooms");
  }
});

// ✅ Get room by ID
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).send("Room not found");
    res.json(room);
  } catch (error) {
    res.status(500).send("Error fetching room details");
  }
});

// ✅ Add new room
router.post("/", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.send("Room added successfully");
  } catch (error) {
    res.status(500).send("Error adding room");
  }
});

// ✅ Update room by ID
router.put("/:id", async (req, res) => {
  try {
    await Room.findByIdAndUpdate(req.params.id, req.body);
    res.send("Room updated successfully");
  } catch (error) {
    res.status(500).send("Error updating room");
  }
});

// ✅ Delete room by ID
router.delete("/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.send("Room deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting room");
  }
});

// ✅ Check room availability with validation and booking conflict check
router.post("/check-availability", async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ available: false, message: "Room ID and dates are required." });
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const checkIn = new Date(checkInDate).setHours(0, 0, 0, 0);
    const checkOut = new Date(checkOutDate).setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({ available: false, message: "Check-in date is in the past." });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ available: false, message: "Check-out must be after check-in." });
    }

    // Check if the room is already booked for these dates
    const overlappingBookings = await Booking.find({
      roomId,
      $or: [
        {
          checkInDate: { $lte: checkOutDate },
          checkOutDate: { $gte: checkInDate },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(200).json({ available: false, message: "Room is not available for selected dates." });
    }

    res.status(200).json({ available: true, message: "✅ Room is available!" });
  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({ available: false, message: "Server error checking availability." });
  }
});

export default router;
