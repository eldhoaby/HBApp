// frontend/src/config/api.js

export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://homystay-backend.onrender.com');

export default API_BASE_URL;
