import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaWifi, FaParking, FaSwimmer, FaTv, FaFireAlt, FaSnowflake,
  FaUtensils, FaCoffee, FaLeaf, FaBiking, FaMountain, FaWater,
  FaEye, FaChair, FaCouch
} from 'react-icons/fa';
import StarRating from '../components/StarRating';

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

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className='font-light select-none'>{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
    />
    <span className='font-light select-none'>{label}</span>
  </label>
);

const AllRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('');

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suit"];
  const priceRanges = ['0 to 500', '500 to 1000', '1000 to 2000', '2000 to 3000'];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3000/rooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handlePriceRangeChange = (checked, label) => {
    const cleanLabel = label.replace('₹', '').trim();
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, cleanLabel] : prev.filter((item) => item !== cleanLabel)
    );
  };

  const handleSortOptionChange = (label) => {
    setSelectedSortOption(label);
  };

  const filteredRooms = rooms
    .filter((room) => {
      const matchesType =
        selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.roomType);
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => {
          const [min, max] = range.split('to').map(Number);
          return room.price >= min && room.price <= max;
        });
      return matchesType && matchesPrice;
    })
    .sort((a, b) => {
      if (selectedSortOption === 'Price Low to High') return a.price - b.price;
      if (selectedSortOption === 'Price High to Low') return b.price - a.price;
      return 0;
    });

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div>
        <h1 className='font-playfair text-4xl'>Hotel Rooms</h1>
        <p className='text-sm text-gray-500 mt-2 max-w-2xl'>
          Enjoy luxury and comfort. Browse and book your ideal stay.
        </p>

        {filteredRooms.length === 0 ? (
          <p className='mt-10 text-gray-500'>No rooms match your filters.</p>
        ) : (
          filteredRooms.map((room) => (
            <div key={room._id} className='flex flex-col md:flex-row py-10 gap-6 border-b'>
              <img
                onClick={() => navigate(`/rooms/${room._id}`)}
                src={room.images[0]}
                alt="room-img"
                className='max-h-64 md:w-1/2 rounded-xl object-cover cursor-pointer shadow-lg'
              />
              <div className='md:w-1/2'>
                <p className='text-gray-500'>{room.city}</p>
                <p
                  onClick={() => navigate(`/rooms/${room._id}`)}
                  className='text-2xl font-playfair cursor-pointer'
                >
                  {room.name} <span className='text-sm font-normal'>({room.roomType})</span>
                </p>
                <div className='flex items-center gap-2 mt-1'>
                  <StarRating /> <span>{room.reviewsCount}+ reviews</span>
                </div>
                <p className='text-sm text-gray-600 mt-1'>{room.address}</p>

                <div className='flex flex-wrap mt-3 gap-3'>
                  {room.amenities?.map((item, i) => (
                    <span
                      key={i}
                      className='text-xs px-3 py-1 bg-gray-100 rounded-lg flex items-center gap-2'
                    >
                      {amenityIcons[item] || "🏨"} {item}
                    </span>
                  ))}
                </div>

                <p className='text-xl font-medium text-gray-800 mt-4'>
                  ₹{room.price}/night
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters Panel */}
      <div className="bg-white w-80 border text-gray-600 mb-8 lg:mb-0 mt-0 lg:mt-16">
        <div className={`flex items-center justify-between px-5 py-2.5 ${openFilters && "border-b"}`}>
          <p className='text-base font-medium text-gray-800'>FILTERS</p>
          <div className='text-xs cursor-pointer'>
            <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span
              className='hidden lg:block'
              onClick={() => {
                setSelectedRoomTypes([]);
                setSelectedPriceRanges([]);
                setSelectedSortOption('');
              }}
            >
              CLEAR
            </span>
          </div>
        </div>

        <div className={`${openFilters ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Room Types</p>
            {roomTypes.map((type, i) => (
              <CheckBox
                key={i}
                label={type}
                selected={selectedRoomTypes.includes(type)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRanges.map((range, i) => (
              <CheckBox
                key={i}
                label={`₹ ${range}`}
                selected={selectedPriceRanges.includes(range)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>
          <div className='px-5 pt-5 pb-6'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((opt, i) => (
              <RadioButton
                key={i}
                label={opt}
                selected={selectedSortOption === opt}
                onChange={handleSortOptionChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
