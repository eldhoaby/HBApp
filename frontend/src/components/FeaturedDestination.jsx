import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import Title from './Title';
import Login from './Login';

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3000/rooms');
        const data = await response.json();

        const validRooms = data.filter(
          (room) =>
            room?.images?.length > 0 &&
            (room.price !== undefined || room.pricePerNight !== undefined)
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

  const handleViewAllDestinations = () => {
    navigate('/rooms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title
        title='Featured Destination'
        subTitle='Discover our exclusive range of exceptional accommodations worldwide and experience the finest in luxury.'
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 w-full'>
        {loading && <p className='text-gray-500'>Loading featured rooms...</p>}
        {error && <p className='text-red-500'>Error loading featured rooms.</p>}
        {!loading && !error && rooms.length === 0 && (
          <p className='text-gray-500'>No featured rooms found.</p>
        )}
        {!loading && !error &&
          rooms.map((room, index) => (
            <HotelCard
              key={room._id || index}
              room={room}
              index={index}
              onBookNow={() => setShowLogin(true)}
            />
          ))}
      </div>

      <button
        onClick={handleViewAllDestinations}
        className='my-16 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all'
      >
        View All Destinations
      </button>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={() => {}}
        />
      )}
    </div>
  );
};

export default FeaturedDestination;
