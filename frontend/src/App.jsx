import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Shared Components
import NavBar from "./components/Navbar";
import AdminNavbar from "./components/hotelOwner/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";

// Admin Page
import Admin from "./components/hotelOwner/Admin";

// Pages
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Check if admin route to use AdminNavbar
  const isAdminPath = location.pathname.startsWith("/admin");

  // Optional: Clear user info on tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Switch between modals
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
      {/* Show correct navbar */}
      {isAdminPath ? (
        <AdminNavbar />
      ) : (
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

          {/* Optional: Direct login/register routes for fallback */}
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

      <Footer />

      {/* Modal Versions (Popup style) */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={handleSwitchToRegister}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitch={handleSwitchToLogin}
        />
      )}
    </div>
  );
};

export default App;
