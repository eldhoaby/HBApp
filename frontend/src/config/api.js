// frontend/src/config/api.js

export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://homystay-backend.onrender.com');

export const getAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http://localhost:3000")) {
    return url.replace("http://localhost:3000", API_BASE_URL);
  }
  if (url.startsWith("/")) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

export default API_BASE_URL;
