// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import HotelCard from './HotelCard';
// import { roomsDummyData } from '../assets/assets'; // ✅ Corrected import

// import Title from './Title'; // Assuming you're using a Title component for heading

// const FeaturedDestination = () => {
//   const navigate = useNavigate();

//   return (
//     <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
//       <Title title='Featured Destination' subTitle='Discover our exclusive range of exceptional accommodations worldwide and experience the finest in luxury.'/>

//       <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
//         {roomsDummyData.slice(0, 4).map((room, index) => (
//           <HotelCard key={room._id} room={room} index={index} />
//         ))}
//       </div>

//       <button
//         onClick={() => {
//           navigate('/rooms');
//           scrollTo(0, 0);
//         }}
//         className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'
//       >
//         View All Destinations
//       </button>
//     </div>
//   );
// };

// export default FeaturedDestination;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import Title from './Title';

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(false); // error state

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3000/rooms');
        const data = await response.json();

        const validRooms = data.filter(
          (room) => room?.images?.length > 0 && (room.price || room.pricePerNight)
        );

        setRooms(validRooms.slice(0, 4));
      } catch (err) {
        console.error("Error fetching featured rooms:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title
        title='Featured Destination'
        subTitle='Discover our exclusive range of exceptional accommodations worldwide and experience the finest in luxury.'
      />

      <div className='flex flex-wrap items-center justify-center gap-6 mt-20 w-full'>
        {loading && <p className='text-gray-500'>Loading featured rooms...</p>}
        {error && <p className='text-red-500'>Error loading featured rooms.</p>}
        {!loading && !error && rooms.length === 0 && (
          <p className='text-gray-500'>No featured rooms found.</p>
        )}
        {!loading &&
          !error &&
          rooms.map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
      </div>

      <button
        onClick={() => {
          navigate('/rooms');
          window.scrollTo(0, 0);
        }}
        className='my-16 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all'
      >
        View All Destinations
      </button>
    </div>
  );
};

export default FeaturedDestination;

