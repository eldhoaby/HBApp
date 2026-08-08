// frontend/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsPersonFill, BsMapFill, BsPlusLg, BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import AvatarUpload from "../components/AvatarUpload";
import { API_BASE_URL } from "../config/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState("");
  const [addresses, setAddresses] = useState([]);
  
  // Pending upload avatar state
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrLabel, setAddrLabel] = useState("Home");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrCountry, setAddrCountry] = useState("India");

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // toast structure: { message: "", type: "success" | "error" }

  // Load user data from DB to ensure freshest records
  const fetchUserData = async () => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setLoading(false);
      return;
    }
    
    try {
      const parsed = JSON.parse(stored);
      const res = await axios.get(`${API_BASE_URL}/users/${parsed._id}`);
      const userData = res.data;
      
      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhoneNumber(userData.phoneNumber || "");
      setDob(userData.dob || "");
      setGender(userData.gender || "");
      setAvatar(userData.avatar || "");
      setAddresses(userData.addresses || []);
    } catch (err) {
      console.error("Failed to load profile data:", err);
      setToast({ message: "Failed to connect to database server. Showing offline details.", type: "error" });
      setTimeout(() => setToast(null), 5000);
      
      const parsed = JSON.parse(stored);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAvatarChange = (file, previewUrl) => {
    setPendingAvatarFile(file);
    setAvatar(previewUrl); // Show local crop preview immediately
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrCity.trim() || !addrState.trim() || !addrPincode.trim()) {
      setToast({ message: "Please fill out all address fields.", type: "error" });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    const newAddress = {
      id: "addr_" + Math.random().toString(36).substr(2, 9),
      label: addrLabel,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      country: addrCountry
    };

    setAddresses([...addresses, newAddress]);
    
    setAddrStreet("");
    setAddrCity("");
    setAddrState("");
    setAddrPincode("");
    setAddrLabel("Home");
    setShowAddressForm(false);
    
    setToast({ message: "Address added. Click 'Save Changes' to persist.", type: "success" });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter((addr) => addr.id !== addressId));
    setToast({ message: "Address removed. Click 'Save Changes' to persist.", type: "success" });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
      setToast({ message: "Name, Email, and Phone number are required fields.", type: "error" });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setToast(null);
    let finalAvatarUrl = avatar;

    try {
      // 1. Perform secure image upload if user selected a new profile picture
      if (pendingAvatarFile) {
        const formData = new FormData();
        formData.append("avatar", pendingAvatarFile);
        
        try {
          const uploadRes = await axios.post(`${API_BASE_URL}/users/upload-avatar`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          finalAvatarUrl = uploadRes.data.url;
        } catch (uploadErr) {
          const errMsg = uploadErr.response?.data?.message || "Failed to upload avatar.";
          setToast({ message: `Upload error: ${errMsg}`, type: "error" });
          setTimeout(() => setToast(null), 5000);
          return;
        }
      }

      // 2. Persist profile fields in MongoDB
      const updatePayload = {
        name,
        email,
        phoneNumber,
        dob,
        gender,
        avatar: finalAvatarUrl,
        addresses
      };

      const res = await axios.put(`${API_BASE_URL}/users/${user._id}`, updatePayload);
      const updatedUser = res.data.user;

      // 3. Update localStorage session variables instantly
      const freshUserInfo = {
        _id: user._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: "user",
        avatar: updatedUser.avatar,
        theme: updatedUser.theme || user.theme
      };
      localStorage.setItem("user", JSON.stringify(freshUserInfo));
      
      // Dispatch storage event to alert navbar details
      window.dispatchEvent(new Event("storage"));
      
      // Sync local component states
      setPendingAvatarFile(null);
      setAvatar(updatedUser.avatar);
      setUser(updatedUser);

      setToast({ message: "🎉 Profile changes saved successfully!", type: "success" });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error("Save error:", err);
      setToast({ message: "❌ Failed to save profile details. Please try again.", type: "error" });
      setTimeout(() => setToast(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16 flex justify-center items-center min-h-[60vh] bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-16 text-center bg-white dark:bg-gray-900 min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-3xl md:text-4xl text-gray-800 dark:text-white font-bold mb-8">
          Personal Profile
        </h1>

        <form onSubmit={handleSaveChanges} className="flex flex-col gap-8">
          {/* Circular picture and basic headers */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <AvatarUpload 
              currentAvatar={avatar} 
              onSave={handleAvatarChange} 
              userName={name}
            />
            <div className="text-center sm:text-left">
              <h2 className="font-playfair text-2xl font-semibold text-gray-800 dark:text-white">{name || "User Profile"}</h2>
              <p className="text-sm text-gray-450 dark:text-gray-400 mt-1">{email}</p>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-2 uppercase tracking-wide">HomyStay Guest</p>
            </div>
          </div>

          {/* Editable account details card */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-gray-700/50">
              <BsPersonFill className="text-teal-600 dark:text-teal-400" size={18} />
              <h3 className="font-semibold text-gray-800 dark:text-white text-base">Account Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-450 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-white focus:border-teal-500 dark:focus:border-teal-500 outline-none transition"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-450 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/50 px-4 py-3 text-sm text-gray-450 dark:text-gray-450 cursor-not-allowed outline-none"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-455 dark:text-gray-400 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-white focus:border-teal-500 dark:focus:border-teal-500 outline-none transition"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* DOB */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-455 dark:text-gray-400 uppercase tracking-wider">Date of Birth</label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-white focus:border-teal-500 dark:focus:border-teal-500 outline-none transition"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-455 dark:text-gray-400 uppercase tracking-wider">Gender</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-white focus:border-teal-500 dark:focus:border-teal-500 outline-none transition cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Management section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <BsMapFill className="text-teal-600 dark:text-teal-400" size={16} />
                <h3 className="font-semibold text-gray-800 dark:text-white text-base">Saved Addresses</h3>
              </div>
              {!showAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline transition cursor-pointer"
                >
                  <BsPlusLg size={10} /> Add New Address
                </button>
              )}
            </div>

            {/* Address expansion form */}
            {showAddressForm && (
              <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl animate-fade-in">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white mb-4">Add Saved Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Address Type Label */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Address Label</label>
                    <select
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  {/* Pincode */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pincode</label>
                    <input 
                      type="text"
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      placeholder="e.g. 400001"
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-white outline-none"
                    />
                  </div>

                  {/* Street address */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Street Address</label>
                    <input 
                      type="text"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      placeholder="Street, flat/house no, landmark"
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-white outline-none"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">City</label>
                    <input 
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-white outline-none"
                    />
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">State</label>
                    <input 
                      type="text"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-5">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-805 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            )}

            {/* Address Grid list */}
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No saved addresses. Add an address to speed up your booking checkout!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    onDelete={handleDeleteAddress}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 active:scale-98 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 text-xs font-bold text-white transition-all duration-300 animate-slide-up ${
          toast.type === "success" ? "bg-teal-600" : "bg-red-600"
        }`}>
          {toast.type === "success" ? <BsCheckCircleFill size={16} /> : <BsXCircleFill size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
