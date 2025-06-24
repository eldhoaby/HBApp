import React, { useState } from "react";
import NavBar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';

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
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin/>} />
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