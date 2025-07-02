import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const HotelCard = ({ room, index, onBookNow }) => {
  const navigate = useNavigate();

  const {
    _id,
    name = 'Unnamed Hotel',
    address = 'Address not available',
    price,
    pricePerNight,
    rating = 4.5,
    images = [],
  } = room;

  const handleCardClick = () => {
    navigate(`/rooms/${_id}`);
  };

  const handleBookNowClick = (e) => {
    e.stopPropagation(); // prevent card click
    onBookNow();         // open login popup
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition w-full max-w-xs"
    >
      <div className="relative h-48 rounded-t-xl overflow-hidden">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover"
        />
        {index === 0 && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
            Best Seller
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <FaMapMarkerAlt className="text-gray-400" />
          {address}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm font-bold text-black">
            ₹{price ?? pricePerNight ?? 'N/A'}
            <span className="text-sm font-normal text-gray-500">/night</span>
          </p>
          <p className="text-sm flex items-center gap-1 text-orange-500">
            <FaStar /> {rating}
          </p>
        </div>

        <button
          className="w-full mt-4 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
          onClick={handleBookNowClick}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
