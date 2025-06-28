// src/App.jsx
import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";

// Pages
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import Payment from "./pages/Payment"; // ✅ FIXED: Correct import
import Confirmation from "./pages/Confirmation";


const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      {!isOwnerPath && (
        <NavBar onLoginClick={() => setShowLogin(true)} />
      )}

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />

        </Routes>
      </div>

      <Footer />

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitch={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};

export default App;
