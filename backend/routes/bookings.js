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
import Room from "../models/room.js";

const router = express.Router();

// Create booking
router.post("/", async (req, res) => {
  try {
    const { room: roomData, checkInDate, checkOutDate } = req.body;
    
    // Find room from DB to check actual price
    const roomId = roomData?._id || req.body.roomId;
    if (roomId) {
      const dbRoom = await Room.findById(roomId);
      if (dbRoom) {
        const oneDay = 24 * 60 * 60 * 1000;
        const numDays = Math.round(Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay)) || 1;
        const calculatedPrice = dbRoom.price * numDays;
        
        // Enforce server-calculated price to override client values
        req.body.totalPrice = calculatedPrice;
        req.body.roomId = roomId;
        req.body.hotelId = roomId;
        if (req.body.room) {
          req.body.room.price = dbRoom.price;
        }

        // Prevent double booking on overlapping active dates
        const overlappingBookings = await Booking.find({
          roomId,
          bookingStatus: { $ne: "cancelled" },
          status: { $nin: ["Cancelled by User", "Cancelled by Admin"] },
          $or: [
            {
              checkInDate: { $lt: checkOutDate },
              checkOutDate: { $gt: checkInDate },
            },
          ],
        });

        if (overlappingBookings.length > 0) {
          return res.status(400).json({ error: "Selected dates are already booked. Please choose other dates." });
        }

      } else {
        return res.status(404).json({ error: "Selected room not found." });
      }
    } else {
      return res.status(400).json({ error: "Room details are required to book." });
    }

    // Default status tracking fields on creation
    req.body.paymentStatus = "unpaid";
    req.body.bookingStatus = "confirmed";
    req.body.isPaid = false;
    req.body.status = "Pending";

    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ error: error.message || "Failed to create booking" });
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

// ✅ Update booking (mark as paid etc.)
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If payment is successful (via isPaid or paymentStatus update)
    if (updateData.isPaid === true || updateData.paymentStatus === "paid") {
      updateData.paymentStatus = "paid";
      updateData.isPaid = true;
      updateData.status = "Confirmed";
      updateData.bookingStatus = "confirmed";
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

// ✅ Cancel booking (with refund handling)
router.post("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (booking.checkInDate <= todayStr) {
      return res.status(400).json({ error: "cancellation is only allowed for upcoming bookings." });
    }

    booking.bookingStatus = "cancelled";
    booking.status = "Cancelled by User";

    // If booking was paid, refund payment
    if (booking.paymentStatus === "paid" || booking.isPaid) {
      booking.paymentStatus = "refunded";
      booking.isPaid = false;
    }

    await booking.save();
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("❌ Cancel Error:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
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
