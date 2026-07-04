// frontend/src/components/PriceTrendChart.jsx

import React, { useState } from "react";

const PriceTrendChart = ({ basePrice }) => {
  const [view, setView] = useState("30"); // "7" or "30"

  // Generate deterministic mock price trend data based on basePrice
  const generateTrendData = (days) => {
    const data = [];
    const seed = basePrice;
    
    // Deterministic trend: slight fluctuation with a downward trend at the end
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      // Calculate a pseudo-random value using math functions
      const wave1 = Math.sin(i * 0.5) * 100;
      const wave2 = Math.cos(i * 0.2) * 50;
      const drop = i < 3 ? -120 * (3 - i) / 3 : 0; // Drop at the end (near future/recent days)
      
      const price = Math.round(seed + wave1 + wave2 + drop);
      data.push({ label, price });
    }
    return data;
  };

  const trendData = generateTrendData(Number(view));
  const prices = trendData.map((d) => d.price);
  const minPrice = Math.min(...prices) - 50;
  const maxPrice = Math.max(...prices) + 50;
  const priceRange = maxPrice - minPrice || 1;

  // Chart layout config
  const chartHeight = 120;
  const chartWidth = 320;
  const paddingX = 15;
  const paddingY = 15;

  // Compute SVG line points
  const points = trendData
    .map((d, index) => {
      const x = paddingX + (index * (chartWidth - paddingX * 2)) / (trendData.length - 1);
      const y = chartHeight - paddingY - ((d.price - minPrice) * (chartHeight - paddingY * 2)) / priceRange;
      return `${x},${y}`;
    })
    .join(" ");

  // Find coordinates for the final dot and low-point dot
  const getDotCoords = (index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (trendData.length - 1);
    const y = chartHeight - paddingY - ((trendData[index].price - minPrice) * (chartHeight - paddingY * 2)) / priceRange;
    return { x, y };
  };

  const finalDot = getDotCoords(trendData.length - 1);
  const lowPriceIndex = prices.indexOf(Math.min(...prices));
  const lowDot = getDotCoords(lowPriceIndex);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">Price Trends & Forecast</h4>
          <p className="text-xs text-emerald-600 font-medium">Price is low. Good time to book! 📉</p>
        </div>
        <div className="flex bg-gray-100 p-0.5 rounded-lg">
          <button
            onClick={() => setView("7")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
              view === "7" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setView("30")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
              view === "30" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* SVG Sparkline chart */}
      <div className="relative flex justify-center items-center">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
          {/* Subtle area gradient background */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area under the line */}
          <path
            d={`M ${paddingX},${chartHeight - paddingY} L ${points} L ${
              paddingX + (trendData.length - 1) * (chartWidth - paddingX * 2) / (trendData.length - 1)
            },${chartHeight - paddingY} Z`}
            fill="url(#chartGradient)"
          />

          {/* Sparkline path */}
          <polyline
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Low price highlight dot */}
          <circle cx={lowDot.x} cy={lowDot.y} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          
          {/* Forecasted price highlight dot */}
          <circle cx={finalDot.x} cy={finalDot.y} r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="1.5" />

          {/* Low label text */}
          <text
            x={lowDot.x}
            y={lowDot.y - 8}
            fontSize="9"
            fill="#ef4444"
            fontWeight="bold"
            textAnchor="middle"
            className="font-sans"
          >
            ₹{trendData[lowPriceIndex].price} (Low)
          </text>

          {/* Final Forecasted Price text */}
          <text
            x={finalDot.x - 5}
            y={finalDot.y + 14}
            fontSize="9"
            fill="#0d9488"
            fontWeight="bold"
            textAnchor="end"
            className="font-sans"
          >
            ₹{trendData[trendData.length - 1].price} (Forecast)
          </text>
        </svg>
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2 px-1 border-t border-gray-50 pt-2">
        <span>{trendData[0].label}</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Teal: AI Forecast
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block ml-2" /> Red: Historic Low
        </span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default PriceTrendChart;
