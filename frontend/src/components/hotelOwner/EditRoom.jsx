import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';

const amenityOptions = [
  'WiFi', 'Pool', 'Breakfast', 'Parking', 'AC', 'TV',
  'Fireplace', 'Balcony', 'Heater', 'Mountain View', 'Rooftop', 'Sea View'
];

const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];

const EditRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // room id from URL param

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    phoneNumber: '',
    amenities: [],
    price: '',
    rating: '',
    reviewsCount: '',
    roomType: '',
    imageSources: ['', '', '', '']
  });

  const [loading, setLoading] = useState(true);

  // Fetch room data on mount
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/rooms/${id}`);
        const room = res.data;

        setFormData({
          name: room.name || '',
          city: room.city || '',
          address: room.address || '',
          phoneNumber: room.phoneNumber || '',
          amenities: room.amenities || [],
          price: room.price?.toString() || '',
          rating: room.rating?.toString() || '',
          reviewsCount: room.reviewsCount?.toString() || '',
          roomType: room.roomType || '',
          imageSources: (room.images && room.images.length > 0)
            ? [...room.images, '', '', '', ''].slice(0, 4)  // max 4 URLs
            : ['', '', '', '']
        });
      } catch (error) {
        console.error("Error fetching room:", error);
        alert("Failed to load room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageURLChange = (index, value) => {
    const updated = [...formData.imageSources];
    updated[index] = value;
    setFormData(prev => ({ ...prev, imageSources: updated }));
  };

  const handleClose = () => navigate('/admin/list-rooms');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      reviewsCount: Number(formData.reviewsCount),
      images: formData.imageSources.filter(Boolean)
    };

    try {
      await axios.put(`http://localhost:3000/rooms/${id}`, dataToSend);
      alert("Room updated successfully!");
      navigate("/admin/list-rooms");
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Error updating room");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading room details...</div>;
  }

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex justify-center items-center overflow-y-auto'>
      <form
        onSubmit={handleSubmit}
        className='flex bg-white rounded-xl max-w-4xl w-full mx-4 my-10 md:my-20 overflow-y-auto max-h-[90vh]'
      >
        {/* Left image */}
        <img src={assets.regImage} alt="reg" className='w-1/2 hidden md:block object-cover rounded-l-xl' />

        {/* Form */}
        <div className='relative flex flex-col md:w-1/2 p-8 overflow-y-auto'>
          <img
            src={assets.closeIcon}
            alt="close"
            className='absolute top-4 right-4 w-5 h-5 cursor-pointer'
            onClick={handleClose}
          />
          <p className='text-2xl font-semibold mt-6 mb-4 text-center'>Edit Room Details</p>

          {/* Fields */}
          {[
            { id: 'name', label: 'Hotel Name' },
            { id: 'phoneNumber', label: 'Phone Number' },
            { id: 'address', label: 'Address' },
            { id: 'city', label: 'City' },
            { id: 'price', label: 'Price (per night)' },
            { id: 'rating', label: 'Rating (e.g. 4.5)' },
            { id: 'reviewsCount', label: 'Reviews Count' }
          ].map((f) => (
            <div className='w-full mt-3' key={f.id}>
              <label htmlFor={f.id} className='text-sm text-gray-600 font-medium'>{f.label}</label>
              <input
                id={f.id}
                name={f.id}
                type='text'
                placeholder='Type here...'
                value={formData[f.id]}
                onChange={handleChange}
                className='border border-gray-300 rounded w-full px-3 py-2 mt-1 outline-indigo-500 font-light focus:ring focus:ring-indigo-200'
                required
              />
            </div>
          ))}

          {/* Room Type */}
          <div className='w-full mt-4'>
            <label htmlFor="roomType" className="text-sm text-gray-600 font-medium">Room Type</label>
            <select
              id="roomType"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-3 py-2 mt-1 outline-indigo-500 font-light focus:ring focus:ring-indigo-200"
              required
            >
              <option value="">Select Room Type</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Amenities */}
          <div className='w-full mt-6'>
            <label className="text-sm text-gray-600 font-medium">Amenities</label>
            <div className='grid grid-cols-2 gap-2 mt-2'>
              {amenityOptions.map((a) => (
                <label key={a} className='flex items-center space-x-2 text-sm'>
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(a)}
                    onChange={() => handleAmenityToggle(a)}
                    className="accent-indigo-500"
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image URLs with Preview */}
          <div className='w-full mt-6'>
            <label className='text-sm text-gray-600 font-medium'>Hotel Images (URLs Only)</label>
            {formData.imageSources.map((src, index) => (
              <div key={index} className='mt-3'>
                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  value={src}
                  onChange={(e) => handleImageURLChange(index, e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2 outline-indigo-500 font-light focus:ring focus:ring-indigo-200"
                />
                {src?.trim() && (
                  <div className="mt-2 border rounded overflow-hidden">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white font-medium px-6 py-2 rounded mt-6 self-start'
          >
            Update Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
