import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

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
    imageSources: ['', '', '', '']  // Can be base64 or URL
  });

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

  const handleImageFileChange = async (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...formData.imageSources];
      updated[index] = reader.result;
      setFormData(prev => ({ ...prev, imageSources: updated }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleClose = () => navigate('/admin/dashboard');

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
      await axios.post('http://localhost:3000/rooms', dataToSend);
      alert("Hotel registered successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error registering hotel:", error);
      alert("Error registering hotel");
    }
  };

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
          <p className='text-2xl font-semibold mt-6 mb-4 text-center'>Register Your Hotel</p>

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

          {/* Image Upload / URL */}
          <div className='w-full mt-6'>
            <label className='text-sm text-gray-600 font-medium'>Hotel Images (max 4)</label>
            {formData.imageSources.map((src, index) => (
              <div key={index} className='mt-3'>
                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  value={src.startsWith('data:') ? '' : src}
                  onChange={(e) => handleImageURLChange(index, e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2 outline-indigo-500 font-light focus:ring focus:ring-indigo-200"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileChange(index, e.target.files[0])}
                  className='mt-2 text-sm'
                />
                {src && (
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full object-cover rounded mt-2 border"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
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
