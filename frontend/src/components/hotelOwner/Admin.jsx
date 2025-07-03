import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Admin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = () => {
    console.log("Sending login:", credentials);  // ✅ Debug

    axios
      .post('http://localhost:3000/admin/login', credentials)
      .then((res) => {
        console.log("Response:", res.data);  // ✅ Debug
        localStorage.setItem('user', JSON.stringify(res.data));
        alert('Login successful!');
        navigate('/admin/dashboard');
      })
      .catch((err) => {
        console.error("Login failed:", err.response?.data || err.message);  // ✅ Debug
        alert('Invalid email or password');
      });
  };

  return (
    <div>
      <Typography variant="h2" style={{ marginLeft: '30px' }}>Login</Typography><br /><br /><br />

      <TextField
        label="Email"
        name="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
      /><br /><br />

      <TextField
        label="Password"
        type="password"
        name="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      /><br /><br /><br />

      <Button variant="contained" onClick={handleLogin} style={{ marginLeft: '4.8em' }}>
        Login
      </Button><br /><br />
    </div>
  );
};

export default Admin;
