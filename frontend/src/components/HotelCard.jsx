// import React from 'react'
// import { Link } from 'react-router-dom'
// import {assets} from "../assets/assets";

// const HotelCard = ({room,index}) => {
//   return (
//     <Link to ={'/rooms/'+ room._id} onClick={()=>scrollTo(0,0)} key={room._id}
//         className='relative max-w-70 w-full
// rounded-x1 overflow-hidden bg-white text-gray-500/90 shadow-
// [0px_4px_4px_rgba(0,0,0,0.05)]' >
//         <img src={room.images[0]} alt=""/>
//         {index === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs
// bg-white text-gray-800 font-medium rounded-full' >Best Seller</p>}

//         <div className='p-4 pt-5'>
//             <div className='flex items-center justify-between'>
//                 <p className='font-playfair text-xl font-medium text-gray-800'>
//                 {room.hotel.name}</p>
//                 <div className='flex items-center gap-1'>
//                     <img src={assets.starIconFilled} alt="star-icon" />4.5
//                 </div>
//             </div>
//             <div className='flex items-center gap-1 text-sm'>
//                 <img src={assets.locationIcon} alt="location-icon" />
//                 <span>{room.hotel.address}</span>
//             </div>
//             <div className='flex items-center justify-between mt-4'>
//                 <p><span>₹{room.pricePerNight}</span>/night</p>
//                 <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover: bg-gray-50 transition-all cursor-pointer' >
//                     Book Now</button>

//             </div>
//         </div>
    
//     </Link>
//   )
// }

// export default HotelCard


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const HotelCard = ({ room, index }) => {
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

  return (
    <div
      onClick={() => navigate(`/rooms/${_id}`)}
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
          className="w-full mt-4 bg-gray-100 text-black font-medium py-2 rounded hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/rooms/${_id}`);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
