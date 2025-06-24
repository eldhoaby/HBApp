import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onClose, onSwitch }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Validate full form
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@gmail\.com$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle blur on email field
  const handleEmailBlur = () => {
    if (email.trim() && !/^\S+@gmail\.com$/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
    } else {
      setErrors(prev => {
        const { email: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleLogin = () => {
    if (!validate()) return;

    axios.post('http://localhost:3000/login', { email, password })
      .then((res) => {
        const { role, message } = res.data;
        alert(message);
        localStorage.setItem('user', JSON.stringify(res.data));

        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/rooms');
        }

        onClose(); // Close modal after successful login
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Login failed');
      });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✖</button>
        <h2 className="text-2xl font-bold text-center mb-1">Sign in to HomyStay</h2>
        <p className="text-center text-sm text-gray-500 mb-4">Welcome back! Please sign in to continue</p>

        <button className="w-full border py-2 flex items-center justify-center gap-2 rounded mb-4">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="flex items-center gap-2 mb-4">
          <hr className="flex-1" />
          <span className="text-xs text-gray-500">or</span>
          <hr className="flex-1" />
        </div>

        {/* Email Field */}
        <label className="block text-sm font-medium mb-1">
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

        {/* Password Field */}
        <label className="block text-sm font-medium mt-4 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          className={`w-full border rounded px-3 py-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2 rounded mt-5"
        >
          Continue →
        </button>

        <p className="text-xs text-center mt-3">
          Don’t have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={onSwitch}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
