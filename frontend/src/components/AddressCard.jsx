// frontend/src/components/AddressCard.jsx

import React from "react";
import { BsHouseDoorFill, BsBriefcaseFill, BsGeoAltFill, BsTrashFill } from "react-icons/bs";

const AddressCard = ({ address, onDelete }) => {
  const getIcon = (label) => {
    const l = (label || "").toLowerCase();
    if (l === "home") return <BsHouseDoorFill className="text-teal-600 dark:text-teal-400" size={16} />;
    if (l === "work") return <BsBriefcaseFill className="text-teal-600 dark:text-teal-400" size={16} />;
    return <BsGeoAltFill className="text-teal-600 dark:text-teal-400" size={16} />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm flex justify-between items-start hover:shadow-md transition duration-200">
      <div className="flex gap-4">
        {/* Label icon */}
        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center shrink-0">
          {getIcon(address.label)}
        </div>
        
        {/* Address text */}
        <div>
          <h4 className="font-semibold text-sm text-gray-800 dark:text-white capitalize flex items-center gap-1.5">
            {address.label}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            {address.street}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
            {address.city}, {address.state} - {address.pincode}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium uppercase">
            {address.country}
          </p>
        </div>
      </div>

      {/* Delete trigger */}
      {onDelete && (
        <button
          onClick={() => onDelete(address.id)}
          className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition"
          title="Delete address"
        >
          <BsTrashFill size={13} />
        </button>
      )}
    </div>
  );
};

export default AddressCard;
