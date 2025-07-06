// import express from "express";
// import Booking from "../models/booking.js";

// const router = express.Router();

// // CREATE Booking
// router.post("/", async (req, res) => {
//   console.log("📦 Booking request received:", req.body);

//   try {
//     const booking = new Booking(req.body);
//     await booking.save();
//     res.status(201).json(booking);
//   } catch (error) {
//     console.error("❌ Booking Error:", error);
//     res.status(500).json({ error: "Failed to create booking" });
//   }
// });

// // READ Bookings by User ID
// router.get("/user/:userId", async (req, res) => {
//   try {
//     const bookings = await Booking.find({ userId: req.params.userId });
//     res.status(200).json(bookings);
//   } catch (error) {
//     console.error("❌ Fetch Error:", error);
//     res.status(500).json({ error: "Failed to fetch bookings" });
//   }
// });

// // UPDATE Booking (e.g., mark as paid)
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedBooking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     );
//     res.status(200).json(updatedBooking);
//   } catch (err) {
//     console.error("❌ Update Error:", err);
//     res.status(500).json({ error: "Failed to update booking" });
//   }
// });

// // DELETE Booking
// router.delete("/:id", async (req, res) => {
//   try {
//     await Booking.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Booking deleted successfully" });
//   } catch (err) {
//     console.error("❌ Delete Error:", err);
//     res.status(500).json({ error: "Failed to delete booking" });
//   }
// });

// export default router;
import express from "express";
import Booking from "../models/booking.js";

const router = express.Router();

// Create booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get bookings by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ✅ Update booking (status or other fields)
// ✅ UPDATE booking with status logic
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If payment is marked as true, also update status
    if (updateData.isPaid === true) {
      updateData.status = "Completed";
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
});


// Delete booking
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

export default router;
