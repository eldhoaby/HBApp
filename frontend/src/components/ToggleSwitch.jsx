// frontend/src/components/ToggleSwitch.jsx

import React from "react";

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {/* Track */}
        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
          checked ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'
        }`} />
        
        {/* Thumb */}
        <div className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
          checked ? 'transform translate-x-5' : ''
        }`} />
      </div>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;
