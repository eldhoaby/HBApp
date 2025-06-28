import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import {
  FaWifi, FaParking, FaSwimmer, FaTv, FaFireAlt, FaSnowflake,
  FaUtensils, FaCoffee, FaLeaf, FaBiking, FaMountain, FaWater,
  FaEye, FaChair, FaCouch
} from 'react-icons/fa';
import { MdLocationOn } from "react-icons/md";

const amenityIcons = {
  "WiFi": <FaWifi className="text-blue-600" />,
  "Wi-Fi": <FaWifi className="text-blue-600" />,
  "Parking": <FaParking className="text-gray-700" />,
  "Pool": <FaSwimmer className="text-sky-500" />,
  "TV": <FaTv className="text-black" />,
  "AC": <FaSnowflake className="text-cyan-400" />,
  "Fireplace": <FaFireAlt className="text-orange-600" />,
  "Breakfast": <FaUtensils className="text-yellow-500" />,
  "Mini Bar": <FaCoffee className="text-amber-600" />,
  "Garden": <FaLeaf className="text-green-600" />,
  "Bike Rental": <FaBiking className="text-emerald-600" />,
  "Mountain View": <FaMountain className="text-gray-700" />,
  "Heater": <FaFireAlt className="text-red-600" />,
  "Sea View": <FaWater className="text-blue-400" />,
  "Balcony": <FaEye className="text-indigo-600" />,
  "Traditional Decor": <FaChair className="text-orange-800" />,
  "Rooftop": <FaCouch className="text-purple-700" />,
  "Air Conditioning": <FaSnowflake className="text-sky-600" />,
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

    if (new Date(checkIn) < new Date()) {
      setMessage("❌ Check-in date must be today or later.");
      setIsAvailable(false);
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setMessage("❌ Check-out date must be after check-in.");
      setIsAvailable(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/rooms/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        }),
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

  const handleAddToBookings = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return navigate("/login");

    const user = JSON.parse(userData);
    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = room.price * nights;

    try {
      const res = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          hotel: {
            name: room.name,
            address: room.address
          },
          room: {
            roomType: room.roomType,
            images: room.images
          },
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guests,
          totalPrice,
          isPaid: false
        })
      });

      if (!res.ok) throw new Error("Booking failed");
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add to bookings.");
    }
  };

  const handleBooking = () => {
    navigate("/payment", {
      state: {
        room,
        checkIn,
        checkOut,
        guests
      }
    });
  };

  if (error) return <p className='pt-32 text-red-600'>{error}</p>;
  if (!room) return <p className='pt-32'>Loading room details...</p>;

  return (
    <div className='pt-32 pb-16 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>
          {room.name} <span className='font-inter text-sm'>({room.roomType})</span>
        </h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% Off</p>
      </div>

      <div className='flex items-center gap-1 mt-2'>
        <StarRating />
        <p className='ml-2'>{room.reviewsCount || 0}+ reviews</p>
      </div>

      <div className='flex items-center gap-2 text-gray-500 mt-2'>
        <MdLocationOn className="text-lg" />
        <span>{room.address}</span>
      </div>

      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img src={mainImage} alt="Room" className='w-full rounded-xl shadow-lg object-cover' />
        </div>
        <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {room.images?.slice(0, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setMainImage(img)}
              className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === img ? 'outline outline-2 outline-orange-500' : ''}`}
              alt={`room-${i}`}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div>
          <h1 className='text-3xl font-playfair'>Experience Luxury Like Never Before</h1>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {room.amenities?.map((item, index) => (
              <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                {amenityIcons[item] || "🏨"}
                <p className='text-xs'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className='text-2xl font-medium text-gray-800'>
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(room.price)} /night
        </p>
      </div>

      <div className='bg-white shadow-md p-6 rounded-xl mt-12 max-w-6xl'>
        <form className='flex flex-wrap gap-6' onSubmit={handleCheckAvailability}>
          <div>
            <label className='font-medium'>Check-In</label>
            <input type="date" className='block rounded border border-gray-300 px-3 py-2 mt-1' value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </div>
          <div>
            <label className='font-medium'>Check-Out</label>
            <input type="date" className='block rounded border border-gray-300 px-3 py-2 mt-1' value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
          </div>
          <div>
            <label className='font-medium'>Guests</label>
            <input type="number" className='block w-20 rounded border border-gray-300 px-3 py-2 mt-1' min="1" value={guests} onChange={(e) => setGuests(e.target.value)} required />
          </div>
          {!isAvailable && (
            <button type='submit' className="bg-blue-700 text-white px-6 py-2 rounded mt-6">
              Check Availability
            </button>
          )}
          {isAvailable && (
            <div className='flex gap-4 mt-6'>
              <button type="button" onClick={handleBooking} className="bg-gray-700 text-white px-6 py-2 rounded">Book Now</button>
              <button type="button" onClick={handleAddToBookings} className="bg-green-600 text-white px-6 py-2 rounded">Add to My Bookings</button>
            </div>
          )}
        </form>
        {isAvailable !== null && (
          <p className={`mt-4 font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
