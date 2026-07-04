// frontend/src/components/FiltersPanel.jsx

import React from "react";
import { BsBellFill, BsXCircle } from "react-icons/bs";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm select-none">
    <input
      type="checkbox"
      className="accent-teal-600 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className="font-light text-gray-700 dark:text-gray-350">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm select-none">
    <input
      type="radio"
      name="sortOption"
      className="accent-teal-600 bg-white dark:bg-gray-900"
      checked={selected}
      onChange={() => onChange(label)}
    />
    <span className="font-light text-gray-700 dark:text-gray-350">{label}</span>
  </label>
);

const FiltersPanel = ({
  openFilters,
  setOpenFilters,
  roomTypes,
  selectedRoomTypes,
  handleRoomTypeChange,
  priceRanges,
  selectedPriceRanges,
  handlePriceRangeChange,
  sortOptions,
  selectedSortOption,
  handleSortOptionChange,
  onClear,
  dealAlertsOnly,
  handleDealAlertsChange,
  isLoggedIn
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 w-full lg:w-80 shrink-0 border border-gray-150 dark:border-gray-700/60 rounded-2xl text-gray-600 dark:text-gray-300 mb-8 lg:mb-0 mt-0 lg:mt-16 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header Accordion Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-800 dark:text-white tracking-wider">FILTERS</p>
        <div className="text-xs cursor-pointer flex gap-4 font-semibold text-teal-600 dark:text-teal-400">
          <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden hover:text-teal-700 dark:hover:text-teal-300">
            {openFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
          </span>
          <span className="hidden lg:flex items-center gap-1 hover:text-teal-705 dark:hover:text-teal-300" onClick={onClear}>
            <BsXCircle size={11} /> CLEAR ALL
          </span>
        </div>
      </div>

      {/* Accordion Content wrapper */}
      <div className={`${openFilters ? "max-h-[1000px] opacity-100" : "max-h-0 lg:max-h-[1000px] opacity-0 lg:opacity-100"} overflow-hidden transition-all duration-500 ease-in-out`}>
        {/* Room Types Filter */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <p className="font-semibold text-[10px] uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2">Room Types</p>
          {roomTypes.map((type, i) => (
            <CheckBox
              key={i}
              label={type}
              selected={selectedRoomTypes.includes(type)}
              onChange={handleRoomTypeChange}
            />
          ))}
        </div>

        {/* Price Ranges Filter */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <p className="font-semibold text-[10px] uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2">Price Range (₹)</p>
          {priceRanges.map((range, i) => (
            <CheckBox
              key={i}
              label={range}
              selected={selectedPriceRanges.includes(range.trim().replace('₹', '').trim())}
              onChange={handlePriceRangeChange}
            />
          ))}
        </div>

        {/* Sort Options Filter */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <p className="font-semibold text-[10px] uppercase text-gray-400 dark:text-gray-500 tracking-wider pb-2">Sort By</p>
          {sortOptions.map((opt, i) => (
            <RadioButton
              key={i}
              label={opt}
              selected={selectedSortOption === opt}
              onChange={handleSortOptionChange}
            />
          ))}
        </div>

        {/* Deal alerts switch */}
        <div className="px-5 pt-5 pb-6 bg-teal-50/20 dark:bg-teal-950/10">
          <div className="flex items-center gap-1.5 pb-2">
            <span className="p-1 bg-teal-100 dark:bg-teal-900/40 rounded-md text-teal-700 dark:text-teal-400">
              <BsBellFill size={12} />
            </span>
            <p className="font-semibold text-[10px] uppercase text-teal-800 dark:text-teal-400 tracking-wider font-playfair">Deal Alerts</p>
          </div>
          
          <label className="flex gap-3 items-start cursor-pointer mt-2 text-sm select-none">
            <input
              type="checkbox"
              className="accent-teal-600 rounded border-gray-300 mt-0.5"
              checked={dealAlertsOnly}
              onChange={(e) => handleDealAlertsChange(e.target.checked)}
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 dark:text-gray-200 text-xs">Notify me when price drops</span>
              <span className="text-[9px] text-gray-450 dark:text-gray-400 mt-0.5 leading-normal">
                {isLoggedIn 
                  ? "🔔 Active subscription via Email" 
                  : "🔓 Log in to subscribe to notifications"}
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
