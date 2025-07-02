import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  const [destinationInput, setDestinationInput] = useState("");
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:3000/rooms");
        const data = await res.json();
        const placeSet = new Set();

        data.forEach((room) => {
          const address = room?.hotel?.address || room?.address || room?.location || null;
          if (address) placeSet.add(address);
        });

        setAllPlaces([...placeSet]);
      } catch (err) {
        console.error("Failed to fetch room locations:", err);
      }
    };

    fetchRooms();
  }, []);

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationInput(value);

    if (value.trim() === "") {
      setFilteredPlaces([]);
      setShowDropdown(false);
      return;
    }

    const matches = allPlaces.filter((place) =>
      place.toLowerCase().startsWith(value.toLowerCase())
    );

    setFilteredPlaces(matches);
    setShowDropdown(matches.length > 0);
  };

  const handleSelectPlace = (place) => {
    setDestinationInput(place);
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/src/assets/2.jpg')] bg-no-repeat bg-cover bg-center h-screen">
      <p className="bg-[#4989FF]/56 px-3.5 py-1 rounded-full mt-20">
        The Ultimate Hotel Experience
      </p>
      <h1 className="font-playfair text-2x1 md:text-5x1 md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-x1 mt-4">
        Step into the journey of your dreams
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base text-black">
        Experience true luxury and comfort at the world’s finest hotels. Begin your journey today.
      </p>

      <form className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto relative z-10">

        {/* Destination Input */}
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
            placeholder="Type city or location"
            autoComplete="off"
          />
          {showDropdown && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow z-20 max-h-40 overflow-y-auto text-sm">
              {filteredPlaces.map((place, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectPlace(place)}
                  className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {place}
                </li>
              ))}
            </ul>
          )}
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
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* Guests */}
        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={4}
            id="guests"
            type="number"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
            placeholder="0"
          />
        </div>

        {/* Search Button */}
        <button className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1">
          <img src={assets.searchIcon} alt="searchIcon" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;