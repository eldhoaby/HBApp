import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/Navbar";
import AdminNavbar from "./components/hotelOwner/AdminNavbar"; // ✅ Corrected import
import Footer from "./components/Footer"; // ✅ Keep footer if used elsewhere

import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/hotelOwner/Admin";

import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Layout from "./pages/hotelOwner/Layout";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  const isAdminPath = location.pathname.startsWith("/admin");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <div>
      {isAdminPath ? (
        <AdminNavbar />
      ) : (
        <NavBar onLoginClick={() => setShowLogin(true)} user={user} />
      )}

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/dashboard" element={<Layout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/rooms" element={<AllRooms setUser={setUser} />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route
            path="/login"
            element={
              <Login
                onClose={() => navigate("/")}
                onSwitch={handleSwitchToRegister}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                onClose={() => navigate("/")}
                onSwitch={handleSwitchToLogin}
              />
            }
          />
        </Routes>
      </div>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={handleSwitchToRegister}
          onLoginSuccess={(userData) => {
            setUser(userData);
            setShowLogin(false);
          }}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitch={handleSwitchToLogin}
        />
      )}

      {!isAdminPath && <Footer />}
    </div>
  );
};

export default App;
