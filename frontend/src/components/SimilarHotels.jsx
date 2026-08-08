// frontend/src/components/SimilarHotels.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsStarFill, BsGeoAltFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { FaWifi, FaParking, FaSwimmer, FaTv, FaSnowflake, FaUtensils } from 'react-icons/fa';
import DealBadge from "./DealBadge";
import { usePreferences } from "../context/DarkModeContext";
import { API_BASE_URL } from "../config/api";

const amenityIcons = {
  "WiFi": <FaWifi className="text-blue-600" />,
  "Parking": <FaParking className="text-gray-700" />,
  "Pool": <FaSwimmer className="text-sky-500" />,
  "TV": <FaTv className="text-black" />,
  "AC": <FaSnowflake className="text-cyan-400" />,
  "Breakfast": <FaUtensils className="text-yellow-500" />,
};

const SimilarHotels = ({ currentRoomId, city }) => {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userWishlist, setUserWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, []);

  useEffect(() => {
    const fetchUserWishlist = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) {
        setUserWishlist([]);
        return;
      }
      try {
        const parsed = JSON.parse(stored);
        const res = await fetch(`${API_BASE_URL}/users/${parsed._id}/wishlist`);
        if (res.ok) {
          const data = await res.json();
          setUserWishlist(data.map((r) => r._id));
        }
      } catch (err) {
        console.error("Error fetching user wishlist:", err);
      }
    };
    fetchUserWishlist();
  }, [isLoggedIn]);

  const handleToggleWishlist = async (e, roomId) => {
    e.stopPropagation();
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("Please log in to manage your wishlist stays!");
      return;
    }

    const parsed = JSON.parse(stored);
    const isWishlisted = userWishlist.includes(roomId);

    try {
      if (isWishlisted) {
        const res = await fetch(`${API_BASE_URL}/users/${parsed._id}/wishlist/${roomId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setUserWishlist((prev) => prev.filter((id) => id !== roomId));
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/users/${parsed._id}/wishlist/${roomId}`, {
          method: "POST"
        });
        if (res.ok) {
          setUserWishlist((prev) => [...prev, roomId]);
        }
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/rooms`);
        if (!response.ok) throw new Error("Failed to load rooms");
        const allRooms = await response.json();

        // Filter out current room
        let filtered = allRooms.filter((room) => room._id !== currentRoomId);

        // Prioritize rooms in the same city
        let matches = filtered.filter(
          (room) => (room.city || "").toLowerCase() === (city || "").toLowerCase()
        );

        // If not enough matches, add other popular rooms from the database
        if (matches.length < 3) {
          const otherRooms = filtered.filter(
            (room) => (room.city || "").toLowerCase() !== (city || "").toLowerCase()
          );
          matches = [...matches, ...otherRooms].slice(0, 3);
        } else {
          matches = matches.slice(0, 3);
        }

        setRecommendations(matches);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentRoomId) {
      fetchRecommendations();
    }
  }, [currentRoomId, city]);

  const handleCardClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || recommendations.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-10">
      <h3 className="font-playfair text-2xl text-gray-850 dark:text-white mb-6">Recommended for You</h3>
      
      {/* Horizontally scrollable row */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-250 dark:scrollbar-thumb-gray-800">
        {recommendations.map((room) => (
          <div
            key={room._id}
            onClick={() => handleCardClick(room._id)}
            className="flex-shrink-0 w-80 bg-white dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer"
          >
            {/* Image container */}
            <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img
                src={room.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500";
                }}
              />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-teal-800 dark:text-teal-400 flex items-center gap-1 shadow-sm font-playfair">
                <BsGeoAltFill className="text-teal-600 text-[10px]" />
                {room.city}
              </div>
              
              {/* Heart button */}
              {(() => {
                const isWishlisted = userWishlist.includes(room._id);
                return (
                  <button
                    onClick={(e) => handleToggleWishlist(e, room._id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow flex items-center justify-center text-teal-600 dark:text-teal-400 hover:scale-105 active:scale-95 transition border-none cursor-pointer"
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isWishlisted ? (
                      <BsHeartFill className="text-red-500" size={13} />
                    ) : (
                      <BsHeart className="text-gray-400 hover:text-red-500" size={13} />
                    )}
                  </button>
                );
              })()}
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h4 className="font-playfair text-lg text-gray-855 dark:text-white line-clamp-1 flex-1 font-semibold">
                  {room.name}
                </h4>
                <div className="flex items-center gap-1 text-amber-500 font-medium text-sm ml-2 shrink-0">
                  {room.reviewsCount > 0 ? (
                    <>
                      <BsStarFill className="text-amber-400 text-xs" />
                      <span>{room.rating}</span>
                    </>
                  ) : (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">No reviews</span>
                  )}
                </div>
              </div>

              {/* Amenity Pills */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {room.amenities?.slice(0, 3).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-full font-medium"
                  >
                    {amenityIcons[amenity] || "🏨"}
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Price and Deal badge */}
              <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-3 mt-1">
                <div className="flex items-center">
                  <span className="font-playfair text-lg font-bold text-gray-800 dark:text-white">
                    {formatPrice(room.price)}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1">/night</span>
                  <DealBadge price={room.price} />
                </div>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition">
                  View Stay →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarHotels;
