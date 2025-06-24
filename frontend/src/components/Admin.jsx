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

  // If admin already logged in, redirect to dashboard
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/admin/dashboard'); // or wherever your admin panel is
    }
  }, [navigate]);

  const handleLogin = () => {
    axios
      .post('http://localhost:3000/admin/login', credentials)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data));
        alert('Login successful!');
        navigate('/admin/dashboard');
      })
      .catch((err) => {
        console.error(err);
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
