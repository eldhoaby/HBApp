// frontend/src/components/Recommendations.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsStarFill, BsGeoAltFill } from "react-icons/bs";
import { FaWifi, FaParking, FaSwimmer, FaTv, FaSnowflake, FaUtensils } from 'react-icons/fa';
import DealBadge from "./DealBadge";
import { API_BASE_URL } from "../config/api";

const amenityIcons = {
  "WiFi": <FaWifi className="text-blue-600" />,
  "Parking": <FaParking className="text-gray-700" />,
  "Pool": <FaSwimmer className="text-sky-500" />,
  "TV": <FaTv className="text-black" />,
  "AC": <FaSnowflake className="text-cyan-400" />,
  "Breakfast": <FaUtensils className="text-yellow-500" />,
};

const Recommendations = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [title, setTitle] = useState("Trending Stays");
  const [subtitle, setSubtitle] = useState("Our guests' top choices this week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch all rooms
        const roomsResponse = await fetch(`${API_BASE_URL}/rooms`);
        if (!roomsResponse.ok) throw new Error("Failed to fetch rooms");
        const allRooms = await roomsResponse.json();

        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          
          // Fetch user's bookings
          const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/user/${user._id}`);
          if (bookingsResponse.ok) {
            const bookings = await bookingsResponse.json();
            
            if (bookings && bookings.length > 0) {
              // Extract preferred cities from past bookings
              const bookedCities = bookings
                .map((b) => b.room?.city || b.hotel?.city || b.hotel?.address?.split(",")?.pop()?.trim())
                .filter(Boolean);
              
              const uniqueCities = [...new Set(bookedCities)];

              if (uniqueCities.length > 0) {
                // Filter rooms in those cities
                const recommended = allRooms.filter((room) =>
                  uniqueCities.some((c) => (room.city || "").toLowerCase().includes(c.toLowerCase()))
                );

                if (recommended.length > 0) {
                  setRooms(recommended.slice(0, 3));
                  setTitle("Recommended for You");
                  setSubtitle(`Based on your interest in ${uniqueCities.slice(0, 2).join(" & ")}`);
                  setLoading(false);
                  return;
                }
              }
            }
          }
          
          // Fallback if logged-in user has no bookings: High rating
          const topRated = allRooms.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
          setRooms(topRated);
          setTitle("Recommended for You");
          setSubtitle("Handpicked top-rated stays matching your profile");
        } else {
          // Guest User: Trending stays (sorted by rating and reviews count)
          const trending = allRooms
            .sort((a, b) => {
              if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0);
              return (b.reviewsCount || 0) - (a.reviewsCount || 0);
            })
            .slice(0, 3);
          
          setRooms(trending);
          setTitle("Trending Stays");
          setSubtitle("The most popular choices this week");
        }
      } catch (err) {
        console.error("Error loading recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleCardClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || rooms.length === 0) return null;

  return (
    <div className="py-12 bg-gray-50/50 dark:bg-gray-900/40 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="font-playfair text-3xl text-gray-800 dark:text-white font-semibold">{title}</h2>
          <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">{subtitle}</p>
        </div>

        {/* 3 Grid Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => handleCardClick(room._id)}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Image Header */}
              <div className="relative h-56 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img
                  src={room.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500";
                  }}
                />
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1 shadow-sm">
                  <BsGeoAltFill className="text-teal-600 dark:text-teal-400 text-[10px]" />
                  {room.city}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-playfair text-xl text-gray-800 dark:text-white line-clamp-1 font-semibold flex-1">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 font-medium text-sm ml-2">
                      <BsStarFill className="text-amber-400 text-xs" />
                      {room.rating || "4.5"}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-3">{room.roomType}</p>

                  {/* Amenity tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-medium"
                      >
                        {amenityIcons[amenity] || "🏨"}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
                  <div className="flex items-center">
                    <span className="font-playfair text-xl font-bold text-gray-800">
                      ₹{room.price}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/night</span>
                    <DealBadge price={room.price} />
                  </div>
                  <span className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition">
                    View Stay →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
