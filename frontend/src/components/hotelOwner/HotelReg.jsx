import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const amenityOptions = [
  'WiFi', 'Pool', 'Breakfast', 'Parking', 'AC', 'TV',
  'Fireplace', 'Balcony', 'Heater', 'Mountain View', 'Rooftop', 'Sea View'
];

const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];

const HotelReg = () => {
  const navigate = useNavigate();

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
    imageUrls: ['', '', '', '', '']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.imageUrls];
    updatedImages[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: updatedImages }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleClose = () => {
    navigate('/admin/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      reviewsCount: Number(formData.reviewsCount),
      images: formData.imageUrls.filter(Boolean)
    };

    try {
      await axios.post('http://localhost:3000/rooms', dataToSend);
      alert('Hotel registered successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error registering hotel:', error);
      alert('Error registering hotel');
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/70 overflow-y-auto'>
      <form
        onSubmit={handleSubmit}
        className='flex bg-white rounded-xl max-w-4xl w-full mx-4 my-10 md:my-20 overflow-y-auto max-h-[90vh]'
      >
        {/* Image panel */}
        <img
          src={assets.regImage}
          alt="reg"
          className='w-1/2 rounded-xl hidden md:block object-cover'
        />

        {/* Form panel */}
        <div className='relative flex flex-col md:w-1/2 p-8 md:p-10 overflow-y-auto'>
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
            onClick={handleClose}
          />

          <p className='text-2xl font-semibold mt-6 mb-4 text-center'>Register Your Hotel</p>

          {/* Basic info */}
          {[
            { id: 'name', label: 'Hotel Name' },
            { id: 'phoneNumber', label: 'Phone Number' },
            { id: 'address', label: 'Address' },
            { id: 'city', label: 'City' },
            { id: 'price', label: 'Price (per night)' },
            { id: 'rating', label: 'Rating (e.g. 4.5)' },
            { id: 'reviewsCount', label: 'Reviews Count' }
          ].map((field) => (
            <div className='w-full mt-3' key={field.id}>
              <label htmlFor={field.id} className="font-medium text-gray-600 text-sm">{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                type="text"
                placeholder="Type here..."
                value={formData[field.id]}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full px-3 py-2 mt-1 outline-indigo-500 font-light focus:ring focus:ring-indigo-200"
                required
              />
            </div>
          ))}

          {/* Room Type Dropdown */}
          <div className='w-full mt-4'>
            <label htmlFor="roomType" className="font-medium text-gray-600 text-sm">Room Type</label>
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
            <label className="font-medium text-gray-600 text-sm">Amenities</label>
            <div className='grid grid-cols-2 gap-x-4 gap-y-2 mt-2'>
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="accent-indigo-500"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image URLs */}
          <div className='w-full mt-6'>
            <label className="font-medium text-gray-600 text-sm">Hotel Image URLs</label>
            {formData.imageUrls.map((url, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Image URL ${index + 1}`}
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="border border-gray-300 rounded w-full px-3 py-2 mt-2 outline-indigo-500 font-light focus:ring focus:ring-indigo-200"
                required={index === 0}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white font-medium px-6 py-2 rounded mt-6 self-start'
          >
            Register Hotel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
