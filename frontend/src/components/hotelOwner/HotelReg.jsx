import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets'; // make sure this path is correct
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HotelReg = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    maxCount: '',
    phoneNumber: '',
    amenities: '',
    price: '',
    rating: '',
    reviewsCount: '',
    roomType: '',
    images: '',
    ownerImage: ''
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/cities');
        setCities(res.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    navigate('/admin/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      maxCount: Number(formData.maxCount),
      price: Number(formData.price),
      rating: Number(formData.rating),
      reviewsCount: Number(formData.reviewsCount),
      amenities: formData.amenities.split(',').map(item => item.trim()),
      images: formData.images.split(',').map(url => url.trim()),
      owner: {
        image: formData.ownerImage
      }
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
        <img
          src={assets.regImage}
          alt="reg-image"
          className='w-1/2 rounded-xl hidden md:block object-cover'
        />
        <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10 overflow-y-auto'>
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
            onClick={handleClose}
          />

          <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

          {[ 
            { id: 'name', label: 'Hotel Name' },
            { id: 'phoneNumber', label: 'Phone Number' },
            { id: 'address', label: 'Address' },
            { id: 'maxCount', label: 'Max Guests' },
            { id: 'price', label: 'Price (per night)' },
            { id: 'rating', label: 'Rating (e.g. 4.5)' },
            { id: 'reviewsCount', label: 'Reviews Count' },
            { id: 'roomType', label: 'Room Type' },
            { id: 'amenities', label: 'Amenities (comma-separated)' },
            { id: 'images', label: 'Image URLs (comma-separated)' },
            { id: 'ownerImage', label: 'Owner Image URL' }
          ].map((field) => (
            <div className='w-full mt-4' key={field.id}>
              <label htmlFor={field.id} className="font-medium text-gray-500">{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                type="text"
                placeholder="Type Here"
                value={formData[field.id]}
                onChange={handleChange}
                className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                required
              />
            </div>
          ))}

          {/* City Dropdown */}
          <div className='w-full mt-4 max-w-60 mr-auto'>
            <label htmlFor="city" className="font-medium text-gray-500">City</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
