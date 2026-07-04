// frontend/src/pages/RoomDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaWifi, FaParking, FaSwimmer, FaTv, FaFireAlt, FaSnowflake,
  FaUtensils, FaCoffee, FaLeaf, FaBiking, FaMountain, FaWater,
  FaEye, FaChair, FaCouch
} from 'react-icons/fa';
import { MdLocationOn } from "react-icons/md";
import { BsHeart, BsHeartFill, BsStarFill } from "react-icons/bs";
import PriceTrendChart from "../components/PriceTrendChart";
import SimilarHotels from "../components/SimilarHotels";
import { usePreferences } from "../context/DarkModeContext";
import Avatar from "../components/Avatar";

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
  const { formatPrice } = usePreferences();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [guestError, setGuestError] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [message, setMessage] = useState("");

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [isEligible, setIsEligible] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState(null);
  const [reviewMsg, setReviewMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState(false);

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

    const fetchWishlistStatus = async () => {
      const userJson = localStorage.getItem("user");
      if (!userJson) return;
      try {
        const user = JSON.parse(userJson);
        const res = await fetch(`http://localhost:3000/users/${user._id}/wishlist`);
        if (res.ok) {
          const wishlist = await res.json();
          setIsWishlisted(wishlist.some((r) => r._id === id));
        }
      } catch (err) {
        console.error("Wishlist check error:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:3000/reviews/rooms/${id}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Reviews load error:", err);
      }
    };

    const checkReviewEligibility = async () => {
      const userJson = localStorage.getItem("user");
      if (!userJson) return;
      try {
        const user = JSON.parse(userJson);
        const res = await fetch(`http://localhost:3000/reviews/rooms/${id}/check-eligibility?userId=${user._id}`);
        if (res.ok) {
          const data = await res.json();
          setIsEligible(data.eligible);
        }
      } catch (err) {
        console.error("Eligibility check error:", err);
      }
    };

    fetchRoom();
    fetchWishlistStatus();
    fetchReviews();
    checkReviewEligibility();
  }, [id]);

  const handleToggleWishlist = async () => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      alert("Please log in to manage your wishlist stays!");
      return navigate("/login");
    }
    const user = JSON.parse(userJson);

    try {
      if (isWishlisted) {
        const res = await fetch(`http://localhost:3000/users/${user._id}/wishlist/${id}`, {
          method: "DELETE"
        });
        if (res.ok) setIsWishlisted(false);
      } else {
        const res = await fetch(`http://localhost:3000/users/${user._id}/wishlist/${id}`, {
          method: "POST"
        });
        if (res.ok) setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

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
      hotelId: room._id,
      roomId: room._id,
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
      hotelId: room._id,
      roomId: room._id,
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      alert("Please fill in a review comment.");
      return;
    }

    setSubmitting(true);
    setReviewMsg("");

    const userJson = localStorage.getItem("user");
    if (!userJson) return;
    const user = JSON.parse(userJson);

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("userName", user.name);
    formData.append("userAvatar", user.avatar || "");
    formData.append("rating", ratingInput);
    formData.append("comment", commentInput);
    if (reviewPhoto) {
      formData.append("photo", reviewPhoto);
    }

    try {
      const res = await fetch(`http://localhost:3000/reviews/rooms/${id}/reviews`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Review submission failed");
      }

      setReviewMsg(`✅ ${data.message}`);
      setCommentInput("");
      setReviewPhoto(null);

      // Re-fetch reviews list
      const revRes = await fetch(`http://localhost:3000/reviews/rooms/${id}/reviews`);
      if (revRes.ok) {
        const freshReviews = await revRes.json();
        setReviews(freshReviews);
      }

      // Re-fetch room to refresh average star rating
      const rRes = await fetch(`http://localhost:3000/rooms/${id}`);
      if (rRes.ok) {
        const freshRoom = await rRes.json();
        setRoom(freshRoom);
      }

      setIsEligible(false);
    } catch (err) {
      console.error("Review save error:", err);
      setReviewMsg(`❌ Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <p className='pt-32 text-red-600'>{error}</p>;
  if (!room) return <p className='pt-32 text-gray-800 dark:text-white bg-white dark:bg-gray-900 min-h-screen pl-6'>Loading room details...</p>;

  return (
    <div className='pt-32 pb-16 px-4 md:px-16 lg:px-24 xl:px-32 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-150 transition-colors duration-300'>
      {/* Header layout containing title and heart toggle */}
      <div className="flex justify-between items-center max-w-4xl">
        <h1 className='text-3xl md:text-4xl font-playfair text-gray-850 dark:text-white font-semibold'>{room.name}</h1>
        <button
          onClick={handleToggleWishlist}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-teal-650 dark:text-teal-400 hover:scale-105 active:scale-95 transition border-none cursor-pointer"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <BsHeartFill className="text-red-500" size={18} />
          ) : (
            <BsHeart className="text-gray-400 dark:text-gray-500 hover:text-red-500" size={18} />
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-4xl border-b dark:border-gray-800 pb-2">
        <div className="flex flex-wrap gap-2 items-center">
          {room.reviewsCount > 0 ? (
            <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-semibold">
              <BsStarFill className="text-amber-400" size={11} />
              <span>{room.rating}</span>
              <span className="font-normal text-gray-450 dark:text-gray-400">({room.reviewsCount} review{room.reviewsCount > 1 ? "s" : ""})</span>
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-550 font-medium italic">No reviews yet. Be the first to review!</span>
          )}
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="flex items-center"><MdLocationOn className="mr-0.5 text-teal-650" />{room.address}</span>
        </div>
        <span className="text-xl font-bold text-teal-600 dark:text-teal-400 shrink-0">
          {formatPrice(room.price)}
          <span className="text-xs text-gray-400 font-normal"> / night</span>
        </span>
      </div>

      {/* Hotel Images Grid */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <img src={mainImage} alt="Room" className='w-full rounded-xl object-cover h-[350px] shadow-sm' />
        <div className='grid grid-cols-2 gap-4'>
          {room.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setMainImage(img)}
              className={`rounded-xl object-cover h-[165px] w-full cursor-pointer transition ${mainImage === img ? 'ring-2 ring-teal-500' : ''}`}
              alt={`room-${i}`}
            />
          ))}
        </div>
      </div>

      {/* Amenities Section */}
      <div className='mt-8'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-850 dark:text-white font-playfair'>Amenities</h2>
        <div className='flex flex-wrap gap-4'>
          {room.amenities?.map((item, idx) => (
            <div key={idx} className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm'>
              {amenityIcons[item] || "🏨"}<span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking and availability panel */}
      <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-6 rounded-3xl mt-10 max-w-4xl'>
        <h3 className="text-lg font-bold mb-4 font-playfair text-gray-850 dark:text-white">Check Availability & Book</h3>
        <form className='flex flex-wrap gap-6' onSubmit={handleCheckAvailability}>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Check-In</label>
            <input type="date" className='block rounded-xl border border-gray-250 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 mt-1 outline-none text-sm dark:text-white' value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Check-Out</label>
            <input type="date" className='block rounded-xl border border-gray-250 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 mt-1 outline-none text-sm dark:text-white' value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Guests</label>
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
              className='block w-20 rounded-xl border border-gray-255 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 mt-1 outline-none text-sm dark:text-white'
            />
            {guestError && (
              <p className="text-red-600 text-xs mt-1 font-semibold">{guestError}</p>
            )}
          </div>
          <button type='submit' className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-6 py-3 rounded-xl mt-6 transition border-none cursor-pointer">Check Availability</button>
        </form>
        
        {isAvailable !== null && (
          <p className={`mt-4 font-semibold text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
        )}

        {isAvailable && (
          <div className='flex gap-4 mt-6 border-t dark:border-gray-700 pt-4'>
            <button onClick={handleBooking} className='bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition border-none cursor-pointer'>Book Now</button>
            <button onClick={handleAddToBookings} className='bg-gray-105 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-white font-semibold text-xs px-6 py-3 rounded-xl transition border-none cursor-pointer'>Add to My Bookings</button>
          </div>
        )}
      </div>

      {/* Price Trend collapsible section */}
      <div className="mt-8 max-w-4xl">
        <details className="group border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden" open>
          <summary className="flex justify-between items-center font-medium text-gray-700 dark:text-gray-300 cursor-pointer p-4 select-none hover:bg-gray-50 dark:hover:bg-gray-700/50 list-none">
            <span className="font-playfair text-lg font-semibold text-gray-855 dark:text-white">📊 View AI Price Trend & Forecast (INR Base)</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="p-4 border-t border-gray-50 dark:border-gray-705 bg-gray-50/10 dark:bg-gray-900/50">
            <PriceTrendChart basePrice={room.price} />
          </div>
        </details>
      </div>

      {/* reviews block details list */}
      <div className="mt-12 max-w-4xl">
        <h3 className="font-playfair text-2xl text-gray-850 dark:text-white font-bold mb-6">Guest Reviews ({room.reviewsCount})</h3>
        
        {/* Write review section - eligible stays only */}
        {isEligible && (
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm mb-8 animate-fade-in">
            <h4 className="font-playfair text-lg font-semibold text-teal-650 dark:text-teal-400 mb-4">Write a Verified Guest Review</h4>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <label className="text-xs font-semibold text-gray-450 uppercase tracking-wide">Star Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className="text-amber-400 hover:scale-110 active:scale-95 transition bg-transparent border-none cursor-pointer p-0"
                    >
                      <BsStarFill className={ratingInput >= star ? "text-amber-550" : "text-gray-250 dark:text-gray-700"} size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-450 uppercase tracking-wide">Your Comments:</label>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share details of your experience staying here..."
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-white focus:border-teal-500 outline-none transition min-h-[100px]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-455 uppercase tracking-wide">Upload Review Photo (Optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReviewPhoto(e.target.files?.[0] || null)}
                  className="text-xs text-gray-500 outline-none"
                />
              </div>

              {reviewMsg && (
                <p className="text-xs font-semibold mt-1">{reviewMsg}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-fit bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition border-none cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Existing reviews list */}
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic py-4">No reviews have been written for this room yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {(expandedReviews ? reviews : reviews.slice(0, 3)).map((rev) => (
              <div key={rev._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-5 rounded-3xl shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={rev.userName}
                      userId={rev.userId}
                      imageUrl={rev.userAvatar}
                      size="w-10 h-10 text-sm font-semibold"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{rev.userName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
                    <BsStarFill className="text-amber-400 mr-1" size={11} />
                    {rev.rating}.0
                  </div>
                </div>

                <p className="text-xs text-gray-650 dark:text-gray-300 mt-3 leading-relaxed font-light">{rev.comment}</p>

                {rev.photo && (
                  <img
                    src={rev.photo}
                    alt="review-photo"
                    className="w-40 h-28 object-cover rounded-xl mt-3 shadow-sm border border-gray-100 dark:border-gray-700/80"
                  />
                )}
              </div>
            ))}

            {reviews.length > 3 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setExpandedReviews(!expandedReviews)}
                  className="bg-transparent border border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                >
                  {expandedReviews ? "Show Less" : `Read More Reviews (${reviews.length - 3} more)`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Similar Hotels recommendations */}
      <SimilarHotels currentRoomId={room._id} city={room.city} />
    </div>
  );
};

export default RoomDetails;
