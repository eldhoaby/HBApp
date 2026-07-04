// frontend/src/components/Avatar.jsx

import React from "react";

// Deterministic hashing helper to get a consistent color index
const getHashColor = (seedString = "") => {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // A premium palette of 10 tailwind-based colors
  const colors = [
    "bg-teal-600 text-white",      // Teal
    "bg-emerald-600 text-white",   // Emerald
    "bg-blue-600 text-white",      // Blue
    "bg-indigo-600 text-white",    // Indigo
    "bg-purple-600 text-white",    // Purple
    "bg-rose-600 text-white",      // Rose
    "bg-amber-600 text-white",     // Amber
    "bg-sky-600 text-white",       // Sky
    "bg-cyan-600 text-white",      // Cyan
    "bg-orange-600 text-white",    // Orange
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const Avatar = ({ name = "", userId = "", imageUrl = "", size = "w-10 h-10 text-sm font-semibold" }) => {
  const cleanName = name.trim();
  const initial = cleanName ? cleanName[0].toUpperCase() : "U";
  
  // Seed the color with userId if available, otherwise fallback to the user's name
  const colorClass = getHashColor(userId || cleanName || "U");

  if (imageUrl) {
    return (
      <div className={`${size} rounded-full overflow-hidden border border-gray-100 dark:border-gray-700/80 shadow-sm shrink-0`}>
        <img
          src={imageUrl}
          alt={cleanName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if the image URL fails to load
            e.target.style.display = "none";
            const parent = e.target.parentElement;
            if (parent) {
              parent.className = `${size} rounded-full flex items-center justify-center font-playfair uppercase ${colorClass} shrink-0 shadow-sm`;
              parent.innerText = initial;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${size} rounded-full flex items-center justify-center font-playfair uppercase ${colorClass} shrink-0 shadow-sm`}>
      {initial}
    </div>
  );
};

export default Avatar;
