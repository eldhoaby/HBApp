import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaWifi, FaParking, FaSwimmer, FaTv, FaFireAlt, FaSnowflake,
  FaUtensils, FaCoffee, FaLeaf, FaBiking, FaMountain, FaWater,
  FaEye, FaChair, FaCouch
} from 'react-icons/fa';
import { MdLocationOn } from "react-icons/md";

const amenityIcons = {
  "WiFi": <FaWifi className="text-blue-600" />, "Wi-Fi": <FaWifi className="text-blue-600" />,
  "Parking": <FaParking className="text-gray-700" />, "Pool": <FaSwimmer className="text-sky-500" />,
  "TV": <FaTv className="text-black" />, "AC": <FaSnowflake className="text-cyan-400" />,
  "Fireplace": <FaFireAlt className="text-orange-600" />, "Breakfast": <FaUtensils className="text-yellow-500" />,
  "Mini Bar": <FaCoffee className="text-amber-600" />, "Garden": <FaLeaf className="text-green-600" />,
  "Bike Rental": <FaBiking className="text-emerald-600" />, "Mountain View": <FaMountain className="text-gray-700" />,
  "Heater": <FaFireAlt className="text-red-600" />, "Sea View": <FaWater className="text-blue-400" />,
  "Balcony": <FaEye className="text-indigo-600" />, "Traditional Decor": <FaChair className="text-orange-800" />,
  "Rooftop": <FaCouch className="text-purple-700" />, "Air Conditioning": <FaSnowflake className="text-sky-600" />
};

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [guestError, setGuestError] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:3000/rooms/${id}`);
        if (!res.ok) throw new Error("Room not found");
        const data = await res.json();
        setRoom(data);
        setMainImage(data.images?.[0]);
      } catch (err) {
        setError(err.message || "Unknown error");
      }
    };
    fetchRoom();
  }, [id]);

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    checkInDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setMessage("❌ Check-in date must be today or later.");
      setIsAvailable(false);
      return;
    }

    if (checkOutDate <= checkInDate) {
      setMessage("❌ Check-out date must be after check-in.");
      setIsAvailable(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/rooms/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: id, checkInDate: checkIn, checkOutDate: checkOut }),
      });
      const data = await res.json();
      setIsAvailable(data.available);
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error checking availability.");
      setIsAvailable(false);
    }
  };

  const calculateNights = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleBooking = async () => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      alert("Please log in to book.");
      return navigate("/login");
    }

    const user = JSON.parse(userJson);
    if (!checkIn || !checkOut) {
      setMessage("❌ Please select both check-in and check-out dates.");
      return;
    }

    if (!isAvailable) {
      setMessage("❌ Please check availability before booking.");
      return;
    }

    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = room.price * nights;

    const bookingData = {
      userId: user._id,
      hotel: { name: room.name, address: room.address },
      room: {
        roomType: room.roomType,
        images: room.images,
        name: room.name,
        address: room.address,
        amenities: room.amenities,
        price: room.price,
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalPrice,
      isPaid: false,
      name: user.name,
      email: user.email
    };

    try {
      const res = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Booking failed");

      const createdBooking = await res.json();
      navigate("/payment", { state: { booking: createdBooking } });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Booking Error:", err);
      setMessage("❌ Failed to proceed to payment.");
    }
  };

  const handleAddToBookings = async () => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      alert("Please log in to add bookings.");
      return navigate("/login");
    }

    const user = JSON.parse(userJson);
    if (!checkIn || !checkOut) {
      setMessage("❌ Please select both check-in and check-out dates.");
      return;
    }

    if (!isAvailable) {
      setMessage("❌ Please check availability before adding to bookings.");
      return;
    }

    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = room.price * nights;

    const bookingData = {
      userId: user._id,
      hotel: { name: room.name, address: room.address },
      room: {
        roomType: room.roomType,
        images: room.images,
        name: room.name,
        address: room.address,
        amenities: room.amenities,
        price: room.price,
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalPrice,
      isPaid: false,
    };

    try {
      const res = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("✅ Room added to your bookings!");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking Error:", err);
      setMessage("❌ Failed to add to bookings.");
    }
  };

  if (error) return <p className='pt-32 text-red-600'>{error}</p>;
  if (!room) return <p className='pt-32'>Loading room details...</p>;

  return (
    <div className='pt-32 pb-16 px-4 md:px-16 lg:px-24 xl:px-32'>
      <h1 className='text-3xl md:text-4xl font-playfair'>{room.name}</h1>
      <p className='text-sm text-gray-500 mt-1 flex items-center'>
        <MdLocationOn className="mr-1" />{room.address}
      </p>

      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <img src={mainImage} alt="Room" className='w-full rounded-xl object-cover' />
        <div className='grid grid-cols-2 gap-4'>
          {room.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setMainImage(img)}
              className={`rounded-xl object-cover cursor-pointer ${mainImage === img ? 'ring-2 ring-orange-500' : ''}`}
              alt={`room-${i}`}
            />
          ))}
        </div>
      </div>

      <div className='mt-8'>
        <h2 className='text-2xl font-semibold mb-4'>Amenities</h2>
        <div className='flex flex-wrap gap-4'>
          {room.amenities?.map((item, idx) => (
            <div key={idx} className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg'>
              {amenityIcons[item] || "🏨"}<span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white shadow-md p-6 rounded-xl mt-10 max-w-4xl'>
        <form className='flex flex-wrap gap-6' onSubmit={handleCheckAvailability}>
          <div>
            <label>Check-In</label>
            <input type="date" className='block rounded border border-gray-300 px-3 py-2 mt-1' value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </div>
          <div>
            <label>Check-Out</label>
            <input type="date" className='block rounded border border-gray-300 px-3 py-2 mt-1' value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
          </div>
          <div>
            <label>Guests</label>
            <input
  type="number"
  min="1"
  value={guests}
  onChange={(e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 5) {
      setGuestError("❌ Maximum 5 guests allowed.");
    } else {
      setGuests(value);
      setGuestError("");
    }
  }}
  className='block w-20 rounded border border-gray-300 px-3 py-2 mt-1'
/>
{guestError && (
  <p className="text-red-600 text-sm mt-1">{guestError}</p>
)}

          </div>
          <button type='submit' className="bg-blue-700 text-white px-6 py-2 rounded mt-6">Check Availability</button>
        </form>
        {isAvailable !== null && (
          <p className={`mt-4 font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
        )}

        {isAvailable && (
          <div className='flex gap-4 mt-6'>
            <button onClick={handleBooking} className='bg-gray-700 text-white px-6 py-2 rounded'>Book Now</button>
            <button onClick={handleAddToBookings} className='bg-green-600 text-white px-6 py-2 rounded'>Add to My Bookings</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
