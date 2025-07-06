import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";           // Logo
import adminIcon from "../../assets/adminIcon.png"; // Admin avatar icon

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const handleScroll = () => {
      const alwaysSolid = location.pathname.startsWith("/admin");
      setIsScrolled(window.scrollY > 10 || alwaysSolid);
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    // ⛔ Close dropdown on route change
    setShowDropdown(false);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/"); // ✅ Redirect to homepage
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/90 shadow-md text-gray-700 backdrop-blur-sm py-3 md:py-4"
          : "py-4 md:py-6 text-white"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={logo}
          alt="logo"
          className={`h-9 transition-opacity ${isScrolled ? "invert opacity-80" : ""}`}
        />
      </Link>

      {/* Admin Avatar + Dropdown */}
      {role === "admin" && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="focus:outline-none"
          >
            <img
              src={adminIcon}
              alt="Admin"
              className="h-9 w-9 cursor-pointer rounded-full border border-gray-300 hover:scale-105 transition"
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg text-sm z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
