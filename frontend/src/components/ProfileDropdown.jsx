// frontend/src/components/ProfileDropdown.jsx

import React from "react";
import { Link } from "react-router-dom";
import { 
  BsPersonFill, 
  BsGearFill, 
  BsCalendarCheckFill, 
  BsHeartFill, 
  BsBoxArrowRight 
} from "react-icons/bs";

import Avatar from "./Avatar";

const ProfileDropdown = ({ onClose, onLogout, firstLetter, userName, userEmail }) => {
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  return (
    <div className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-2xl shadow-xl text-sm z-50 overflow-hidden animate-fade-in">
      {/* User info summary header */}
      <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-800/40 flex items-center gap-3">
        <Avatar
          name={userName}
          userId={storedUser?._id}
          imageUrl={storedUser?.avatar}
          size="w-8 h-8 text-xs font-bold"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 dark:text-white line-clamp-1 text-xs">{userName || "Guest User"}</p>
          <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5 line-clamp-1">{userEmail || ""}</p>
        </div>
      </div>

      {/* Navigation menu list */}
      <div className="py-1">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition font-medium"
        >
          <BsPersonFill className="text-teal-600 dark:text-teal-400" size={16} />
          My Profile
        </Link>
        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition font-medium"
        >
          <BsGearFill className="text-teal-600 dark:text-teal-400" size={16} />
          Settings
        </Link>
        <Link
          to="/my-bookings"
          onClick={onClose}
          className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition font-medium"
        >
          <BsCalendarCheckFill className="text-teal-600 dark:text-teal-400" size={15} />
          My Bookings
        </Link>
        <Link
          to="/wishlist"
          onClick={onClose}
          className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition font-medium"
        >
          <BsHeartFill className="text-teal-600 dark:text-teal-400" size={15} />
          Wishlist
        </Link>
        
        <div className="border-t border-gray-50 dark:border-gray-700/50 my-1" />
        
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-3 px-5 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition font-semibold"
        >
          <BsBoxArrowRight size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
