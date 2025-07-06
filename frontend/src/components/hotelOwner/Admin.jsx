import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, Routes, Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import HotelReg from './HotelReg';
import ListRooms from './ListRooms';
import Dashboard from './Dashboard';
import EditRoom from './EditRoom';  // <-- Added import for EditRoom

const Admin = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role');
    if (user && role === 'admin') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    axios
      .post('http://localhost:3000/admin/login', credentials)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('role', 'admin');
        alert('Login successful!');
        setIsAuthenticated(true);
        navigate('/admin/dashboard');
      })
      .catch((err) => {
        console.error("Login failed:", err.response?.data || err.message);
        alert('Invalid email or password');
      });
  };

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen pt-[80px] bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md fixed h-full z-10">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-room" element={<HotelReg />} />
            <Route path="list-rooms" element={<ListRooms />} />
            <Route path="edit-room/:id" element={<EditRoom />} /> {/* <-- Added EditRoom route */}
          </Routes>
        </div>
      </div>
    );
  }

  // Login screen
  return (
    <div style={{ marginTop: '100px', padding: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '2em' }}>
        Admin Login
      </Typography>

      <TextField
        label="Email"
        name="email"
        fullWidth
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        style={{ marginBottom: '1em' }}
      />

      <TextField
        label="Password"
        type="password"
        name="password"
        fullWidth
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        style={{ marginBottom: '2em' }}
      />

      <Button
        variant="contained"
        onClick={handleLogin}
        fullWidth
        style={{ padding: '10px', fontSize: '16px' }}
      >
        Login
      </Button>
    </div>
  );
};

export default Admin;
