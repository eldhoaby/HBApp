// frontend/src/components/AvatarUpload.jsx

import React, { useState, useRef } from "react";
import { BsCameraFill, BsX } from "react-icons/bs";
import { getAvatarUrl } from "../config/api";

const AvatarUpload = ({ currentAvatar, onSave, userName }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewFile(reader.result);
      setZoom(1);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveCrop = () => {
    const img = new Image();
    img.src = previewFile;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Scale down to max 1024x1024px while keeping aspect ratio
      const MAX_SIZE = 1024;
      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Export as a compressed JPEG blob at 80% quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas toBlob compression failed.");
            onSave(null, previewFile);
            return;
          }
          const compressedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          
          // Generate a compressed local preview dataURL
          const reader = new FileReader();
          reader.onloadend = () => {
            onSave(compressedFile, reader.result);
          };
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.8
      );
    };

    setShowCropModal(false);
    setPreviewFile(null);
  };

  const initials = userName?.[0]?.toUpperCase() || "A";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circle Container */}
      <div 
        onClick={triggerFileInput}
        className="group relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md cursor-pointer bg-teal-50 dark:bg-teal-900/10 flex items-center justify-center transition"
      >
        {currentAvatar ? (
          <img 
            src={getAvatarUrl(currentAvatar)} 
            alt="User avatar" 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <span className="text-4xl font-bold font-playfair text-teal-700 dark:text-teal-400">
            {initials}
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-1 transition duration-200">
          <BsCameraFill className="text-white" size={20} />
          <span className="text-[10px] text-white font-medium uppercase tracking-wider">Change Photo</span>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      {/* Lightweight Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl relative animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white text-base">Crop Profile Picture</h3>
              <button 
                onClick={() => setShowCropModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                <BsX size={24} />
              </button>
            </div>

            {/* Viewport crop mask */}
            <div className="py-8 flex flex-col items-center bg-gray-50 dark:bg-gray-900/50 rounded-xl mt-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-dashed border-teal-500 flex items-center justify-center relative bg-gray-100 dark:bg-gray-800">
                <img
                  src={previewFile}
                  alt="Crop preview"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: "transform 0.1s"
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Zoom control slider */}
              <div className="w-64 mt-6 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <span>Zoom Out</span>
                  <span>Zoom In</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="accent-teal-600 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
