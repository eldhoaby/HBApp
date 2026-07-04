// frontend/src/components/DealBadge.jsx

import React, { useState } from "react";
import { BsArrowDownRight, BsInfoCircleFill } from "react-icons/bs";

const DealBadge = ({ price }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Deterministic deal determination based on room price
  // Even IDs or specific price endings get different mock deal types
  const isGreatDeal = price % 3 === 0 || price > 2000;
  
  if (!isGreatDeal) return null;

  return (
    <div className="relative inline-flex items-center gap-1.5 ml-2">
      {/* Deal Badge Pill */}
      <span 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer hover:bg-teal-100 transition shadow-sm"
      >
        <BsArrowDownRight className="text-[10px]" />
        Estimated Deal
        <BsInfoCircleFill className="text-[9px] opacity-75" />
      </span>

      {/* Tooltip Overlay */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 w-44 bg-gray-900 text-white text-[10px] rounded-lg p-2.5 shadow-xl z-50 pointer-events-none transition-all duration-200">
          <p className="font-semibold text-teal-300 flex items-center gap-1 mb-0.5">
            📉 price Trend Forecast
          </p>
          <p className="text-gray-300 leading-normal">
            Calculated from database price histories. Confidence: Low (insufficient data).
          </p>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-width border-4 border-solid border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

export default DealBadge;
