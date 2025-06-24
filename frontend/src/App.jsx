import React, { useState } from "react";
import NavBar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
// <<<<<<< HEAD
// import MyBookings from "./pages/MyBookings";
// import HotelReg from "./components/HotelReg";
// =======
// import AllRooms from "./pages/AllRooms";
// import RoomDetails from "./pages/RoomDetails";

// >>>>>>> 8805a3823936144ccbf351f8ce421db6ded237d3

import MyBookings from "./pages/MyBookings";
import HotelReg from "./components/HotelReg";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";


const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // ✅ Add register modal state

  return (
    <div>
      {!isOwnerPath && (
        <NavBar
          onLoginClick={() => setShowLogin(true)}
        />
      )}
      {false && <HotelReg/>}
      <div className="min-h-[70vh]">
        {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin/>} />
<<<<<<< HEAD
           <Route path="/my-bookings" element={<MyBookings/>} />
=======
           <Route path="/rooms" element={<AllRooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
>>>>>>> 8805a3823936144ccbf351f8ce421db6ded237d3
        </Routes> */}
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/admin" element={<Admin />} />
  <Route path="/my-bookings" element={<MyBookings />} />
  <Route path="/rooms" element={<AllRooms />} />
  <Route path="/rooms/:id" element={<RoomDetails />} />
</Routes>

      </div>
      <Footer />

      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* Register Modal */}
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