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
import { Link } from 'react-router-dom';
import { assets } from "../assets/assets";

const HotelCard = ({ room, index }) => {
  const hotelName = room.hotel?.name || "Unnamed Hotel";
  const hotelAddress = room.hotel?.address || "Address not available";
  const imageUrl = room.images?.[0] || assets.defaultRoomImage;

  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className='relative w-full max-w-xs rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-md'
    >
      <img
        src={imageUrl}
        alt="room-img"
        className='h-48 w-full object-cover'
      />

      {index === 0 && (
        <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>
          Best Seller
        </p>
      )}

      <div className='p-4 pt-5'>
        <div className='flex items-center justify-between'>
          <p className='font-playfair text-xl font-medium text-gray-800'>
            {hotelName}
          </p>
          <div className='flex items-center gap-1'>
            <img src={assets.starIconFilled} alt="star-icon" className='w-4 h-4' />
            4.5
          </div>
        </div>
        <div className='flex items-center gap-1 text-sm mt-1'>
          <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
          <span>{hotelAddress}</span>
        </div>
        <div className='flex items-center justify-between mt-4'>
          <p>
            <span className='font-semibold text-gray-800'>₹{room.pricePerNight}</span>/night
          </p>
          <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'>
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
