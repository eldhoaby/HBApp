import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaUserShield } from "react-icons/fa";

const NavBar = ({ onLoginClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [firstLetter, setFirstLetter] = useState("");

  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setFirstLetter("");
    setRole("");
    navigate("/");
  };

  const loadUserFromLocalStorage = () => {
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (storedRole) {
      setRole(storedRole);
    } else {
      setRole("");
    }

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name && typeof parsed.name === "string") {
          setFirstLetter(parsed.name.charAt(0).toUpperCase());
        }
      } catch (err) {
        console.error("Error parsing stored user", err);
        setFirstLetter("");
      }
    } else {
      setFirstLetter("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const alwaysSolid =
        location.pathname.startsWith("/rooms") ||
        location.pathname === "/my-bookings" ||
        location.pathname.startsWith("/admin") ||
        location.pathname === "/payment" ||
        location.pathname === "/confirmation";

      setIsScrolled(window.scrollY > 10 || alwaysSolid);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    const syncUserFromStorage = () => {
      loadUserFromLocalStorage();
    };

    loadUserFromLocalStorage();
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", syncUserFromStorage);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", syncUserFromStorage);
    };
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled && "invert opacity-80"}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}
        <button
          className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
            isScrolled ? "text-black" : "text-white"
          } transition-all`}
        >
          Dashboard
        </button>
      </div>

      {/* User Section */}
      <div className="hidden md:flex items-center gap-4 relative">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`${isScrolled && "invert"} h-7 transition-all duration-500`}
        />

        {role === "user" && (
          <div ref={dropdownRef} className="relative">
            <div
              title="User"
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm cursor-pointer"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              {firstLetter || "U"}
            </div>
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg text-sm z-50">
                <Link
                  to="/my-bookings"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowUserDropdown(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {role === "admin" && (
          <FaUserShield title="Admin" className="text-xl" />
        )}

        {!role && (
          <button
            onClick={onLoginClick}
            className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="flex items-center gap-3 md:hidden">
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menu"
          className={`${isScrolled && "invert"} h-4`}
        />
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
          Dashboard
        </button>

        {role === "user" && (
          <>
            <div
              title="User"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-lg"
            >
              {firstLetter || "U"}
            </div>
            <Link
              to="/my-bookings"
              onClick={() => setIsMenuOpen(false)}
              className="text-blue-600"
            >
              My Bookings
            </Link>
          </>
        )}

        {role === "admin" && (
          <FaUserShield title="Admin" className="text-2xl" />
        )}

        {!role && (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onLoginClick();
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
          >
            Login
          </button>
        )}

        {role && (
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="text-sm text-red-600 border border-red-600 px-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
