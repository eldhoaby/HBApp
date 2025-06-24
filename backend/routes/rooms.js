import express from "express";
import Room from "../models/room.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).send("Error fetching rooms");
  }
});

router.post("/", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.send("Room added successfully");
  } catch (error) {
    res.status(500).send("Error adding room");
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Room.findByIdAndUpdate(req.params.id, req.body);
    res.send("Room updated successfully");
  } catch (error) {
    res.status(500).send("Error updating room");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.send("Room deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting room");
  }
});

export default router;
