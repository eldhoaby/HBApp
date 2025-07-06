

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();

  const [destinationInput, setDestinationInput] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [destinationError, setDestinationError] = useState("");
  const [dateError, setDateError] = useState("");
  const [guestError, setGuestError] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost:3000/rooms");
        const data = await res.json();
        const citySet = new Set();

        data.forEach((room) => {
          const city = room?.hotel?.city || room?.city;
          if (city) citySet.add(city.trim());
        });

        setAllCities([...citySet]);
      } catch (err) {
        console.error("Failed to fetch room cities:", err);
      }
    };

    fetchCities();
  }, []);

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationInput(value);

    if (!value.trim()) {
      setFilteredCities([]);
      setShowDropdown(false);
      return;
    }

    const matches = allCities
      .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
      .sort();

    setFilteredCities(matches);
    setShowDropdown(matches.length > 0);
  };

  const handleSelectCity = (city) => {
    setDestinationInput(city);
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    checkInDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);

    let isValid = true;

    if (!destinationInput.trim()) {
      setDestinationError("❌ Destination is required.");
      isValid = false;
    } else {
      setDestinationError("");
    }

    if (!checkIn || checkInDate < today) {
      setDateError("❌ Check-in must be today or later.");
      isValid = false;
    } else if (!checkOut || checkOutDate <= checkInDate) {
      setDateError("❌ Check-out must be after check-in.");
      isValid = false;
    } else {
      setDateError("");
    }

    if (guests < 1 || guests > 5) {
      setGuestError("❌ Guests must be between 1 and 5.");
      isValid = false;
    } else {
      setGuestError("");
    }

    if (!isValid) return;

    const query = new URLSearchParams({
      city: destinationInput.trim(),
      checkIn,
      checkOut,
      guests,
    });

    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/src/assets/6.jpg')] bg-no-repeat bg-cover bg-center h-screen">
      <p className="bg-[#4989FF]/60 px-3.5 py-1 rounded-full mt-20">The Ultimate Hotel Experience</p>
      <h1 className="font-playfair text-2xl md:text-5xl font-bold max-w-xl mt-4">Step into the journey of your dreams</h1>
      <p className="max-w-130 mt-2 text-sm md:text-base text-white">
        Experience true luxury and comfort at the world’s finest hotels. Begin your journey today.
      </p>

      <form
        className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto relative z-10"
        onSubmit={handleSearch}
      >
        {/* Destination */}
        <div className="relative w-full md:w-48">
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            id="destinationInput"
            type="text"
            value={destinationInput}
            onChange={handleDestinationChange}
            className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Type city name"
            autoComplete="on"
          />
          {showDropdown && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow z-20 max-h-40 overflow-y-auto text-sm">
              {filteredCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectCity(city)}
                  className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
          {destinationError && <p className="text-red-600 text-sm mt-1">{destinationError}</p>}
        </div>

        {/* Check-in */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* Check-out */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
          {dateError && <p className="text-red-600 text-sm mt-1">{dateError}</p>}
        </div>

        {/* Guests */}
        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            type="number"
            min={1}
            max={5}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
            placeholder="1"
          />
          {guestError && <p className="text-red-600 text-sm mt-1">{guestError}</p>}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1"
        >
          <img src={assets.searchIcon} alt="searchIcon" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
