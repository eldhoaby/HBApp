import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, Routes, Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import HotelReg from './HotelReg';
import ListRooms from './ListRooms';

// Dummy Dashboard component (replace with your real dashboard)
const Dashboard = () => (
  <div className="space-y-6">
    {/* Top metrics */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-blue-500 text-white rounded p-6 shadow">
        <h3 className="text-lg font-medium">Total Bookings</h3>
        <p className="text-2xl font-bold mt-2">0</p>
      </div>
      <div className="bg-green-500 text-white rounded p-6 shadow">
        <h3 className="text-lg font-medium">Total Revenue</h3>
        <p className="text-2xl font-bold mt-2">₹0</p>
      </div>
      <div className="bg-yellow-500 text-white rounded p-6 shadow">
        <h3 className="text-lg font-medium">Pending Bookings</h3>
        <p className="text-2xl font-bold mt-2">0</p>
      </div>
    </div>

    {/* Recent Bookings Table */}
    <div className="bg-white rounded shadow p-4 mt-6 overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 font-medium">User</th>
            <th className="py-2 px-4 font-medium">Amount</th>
            <th className="py-2 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="py-3 px-4 text-gray-500" colSpan={3}>No bookings yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

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

  // 🟡 Logged-in view
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen pt-[80px] bg-gray-50">
        {/* Sidebar (fixed left) */}
        <div className="w-64 bg-white shadow-md fixed h-full z-10">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-room" element={<HotelReg />} />
            <Route path="list-rooms" element={<ListRooms />} />
          </Routes>
        </div>
      </div>
    );
  }

  // 🔒 Login screen (unauthenticated)
  return (
    <div style={{ marginTop: '100px', padding: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '2em' }}>Admin Login</Typography>

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