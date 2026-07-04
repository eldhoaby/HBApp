// frontend/src/pages/Wishlist.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsHeartFill, BsGeoAltFill } from "react-icons/bs";
import { FaWifi, FaParking, FaSwimmer, FaTv, FaSnowflake, FaUtensils } from 'react-icons/fa';
import StarRating from "../components/StarRating";
import DealBadge from "../components/DealBadge";
import { usePreferences } from "../context/DarkModeContext";

const API_BASE_URL = "http://localhost:3000";

const amenityIcons = {
  "WiFi": <FaWifi className="text-blue-600" />,
  "Parking": <FaParking className="text-gray-700" />,
  "Pool": <FaSwimmer className="text-sky-500" />,
  "TV": <FaTv className="text-black" />,
  "AC": <FaSnowflake className="text-cyan-400" />,
  "Breakfast": <FaUtensils className="text-yellow-500" />,
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const getLoggedInUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      return null;
    }
  };

  const fetchWishlist = async () => {
    const user = getLoggedInUser();
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${user._id}/wishlist`);
      setWishlist(res.data || []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setErrorMsg("Failed to connect to wishlist server. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveWishlist = async (e, roomId) => {
    e.stopPropagation(); // Avoid triggering card click navigation
    const user = getLoggedInUser();
    if (!user) return;

    try {
      await axios.delete(`${API_BASE_URL}/users/${user._id}/wishlist/${roomId}`);
      // Instantly filter out of local state
      setWishlist((prev) => prev.filter((room) => room._id !== roomId));
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err);
    }
  };

  const handleCardClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16 flex justify-center items-center min-h-[60vh] dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-600" />
      </div>
    );
  }

  const user = getLoggedInUser();
  if (!user) {
    return (
      <div className="pt-32 pb-16 text-center bg-white dark:bg-gray-900 min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your favorite stays wishlist.</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl text-gray-800 dark:text-white font-bold">
            My Wishlist
          </h1>
          <p className="text-sm text-gray-455 dark:text-gray-450 mt-2">
            Your saved rooms and favorite destinations.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-900/30 animate-fade-in">
            {errorMsg}
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/65 p-12 rounded-3xl text-center shadow-sm">
            <p className="text-gray-400 dark:text-gray-500 text-sm">Your wishlist is currently empty.</p>
            <button
              onClick={() => navigate("/rooms")}
              className="mt-6 inline-flex bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition shadow border-none cursor-pointer"
            >
              Explore Hotels
            </button>
          </div>
        ) : (
          /* Grid Layout matching Rooms page aesthetic */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((room) => (
              <div
                key={room._id}
                onClick={() => handleCardClick(room._id)}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200 cursor-pointer flex flex-col h-full relative"
              >
                {/* Wishlist Heart overlay */}
                <button
                  onClick={(e) => handleRemoveWishlist(e, room._id)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-red-500 hover:text-red-650 hover:scale-105 active:scale-95 transition border-none cursor-pointer"
                  title="Remove from wishlist"
                >
                  <BsHeartFill size={15} />
                </button>

                {/* Cover Image */}
                <div className="h-48 w-full bg-gray-100 dark:bg-gray-750 overflow-hidden relative">
                  <img
                    src={room.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500";
                    }}
                  />
                  <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-teal-800 dark:text-teal-400 flex items-center gap-1 shadow-sm">
                    <BsGeoAltFill size={9} />
                    {room.city}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="font-playfair text-lg text-gray-800 dark:text-white line-clamp-1 font-semibold">
                      {room.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-light mt-0.5">{room.roomType}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {room.reviewsCount > 0 ? (
                        <>
                          <StarRating rating={room.rating} />
                          <span className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">({room.reviewsCount} review{room.reviewsCount > 1 ? "s" : ""})</span>
                        </>
                      ) : (
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 italic font-medium">No reviews yet. Be the first to review!</span>
                      )}
                    </div>

                    {/* Amenities pills */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {room.amenities?.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-650 dark:text-gray-350 text-[9px] px-2 py-0.5 rounded-full"
                        >
                          {amenityIcons[item] || "🏨"}
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer price and deals */}
                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-4 mt-2">
                    <div className="flex items-center">
                      <span className="font-playfair text-lg font-bold text-gray-800 dark:text-white">
                        {formatPrice(room.price)}
                      </span>
                      <span className="text-[10px] text-gray-450 dark:text-gray-500 ml-1">/night</span>
                      <DealBadge price={room.price} />
                    </div>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                      View Stay →
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
