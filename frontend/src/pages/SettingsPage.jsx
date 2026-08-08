// frontend/src/pages/SettingsPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "../context/DarkModeContext";
import ToggleSwitch from "../components/ToggleSwitch";
import { 
  BsSliders, 
  BsBellFill, 
  BsShieldLockFill, 
  BsCreditCard2FrontFill, 
  BsEyeSlashFill,
  BsTrashFill,
  BsPlusLg,
  BsCheckCircleFill,
  BsXCircleFill
} from "react-icons/bs";

import { API_BASE_URL } from "../config/api";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme, currency, setCurrency, language, setLanguage } = usePreferences();
  
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("preferences");
  const [loading, setLoading] = useState(true);

  // Notifications states
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [promoOffers, setPromoOffers] = useState(false);

  // Security states
  const [twoFactor, setTwoFactor] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Payment states
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardType, setCardType] = useState("Visa");

  // Privacy deletion modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadUserSettings = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const parsed = JSON.parse(stored);
        const res = await axios.get(`${API_BASE_URL}/users/${parsed._id}`);
        const data = res.data;
        setUser(data);
        
        if (data.notifications) {
          setEmailNotif(data.notifications.email ?? true);
          setPushNotif(data.notifications.push ?? true);
          setPriceDropAlerts(data.notifications.priceDrop ?? true);
          setBookingReminders(data.notifications.bookingReminder ?? true);
          setPromoOffers(data.notifications.promo ?? false);
        }
        
        if (data.twoFactorEnabled) {
          setTwoFactor(data.twoFactorEnabled);
        }

        if (data.paymentMethods && data.paymentMethods.length > 0) {
          setPaymentMethods(data.paymentMethods);
        }
      } catch (err) {
        console.error("Failed to load user settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  const saveSettings = async (updatedFields) => {
    if (!user) return;
    try {
      await axios.put(`${API_BASE_URL}/users/${user._id}`, updatedFields);
      console.log("Settings synced with DB successfully.");
    } catch (err) {
      console.error("Failed to sync settings with database:", err);
    }
  };

  // Sync theme changes server-side
  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme); // Updates visual context instantly
    
    if (user) {
      try {
        await axios.put(`${API_BASE_URL}/users/${user._id}`, { theme: newTheme });
        setToast({ message: `Theme preference switched to ${newTheme}!`, type: "success" });
        setTimeout(() => setToast(null), 3000);
      } catch (err) {
        console.error("Failed to save theme choice server-side:", err);
        setToast({ message: "Failed to persist theme setting in DB.", type: "error" });
        setTimeout(() => setToast(null), 4000);
      }
    }
  };

  // Toggle notification preference
  const handleToggleNotification = (key, val, setter) => {
    setter(val);
    if (!user) return;
    
    const nextNotifs = {
      email: emailNotif,
      push: pushNotif,
      priceDrop: priceDropAlerts,
      bookingReminder: bookingReminders,
      promo: promoOffers,
      [key]: val
    };

    saveSettings({ notifications: nextNotifs });
    setToast({ message: "Notification preferences updated.", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle 2FA preference
  const handleToggle2FA = (val) => {
    setTwoFactor(val);
    saveSettings({ twoFactorEnabled: val });
    setToast({ message: val ? "Two-Factor authentication enabled." : "Two-Factor authentication disabled.", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  // Add card handler
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim()) {
      setToast({ message: "Please fill in card details.", type: "error" });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    const last4 = cardNumber.slice(-4) || "0000";
    const newCard = {
      id: "pm_" + Math.random().toString(36).substr(2, 9),
      type: cardType,
      last4,
      expiry: cardExpiry,
      cardName
    };

    const nextPayments = [...paymentMethods, newCard];
    setPaymentMethods(nextPayments);
    saveSettings({ paymentMethods: nextPayments });

    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setShowPaymentForm(false);
    
    setToast({ message: "Payment method linked successfully.", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  // Delete card handler
  const handleDeleteCard = (cardId) => {
    const nextPayments = paymentMethods.filter((pm) => pm.id !== cardId);
    setPaymentMethods(nextPayments);
    saveSettings({ paymentMethods: nextPayments });
    setToast({ message: "Payment method unlinked.", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: "New passwords do not match.", type: "error" });
      setTimeout(() => setToast(null), 4500);
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/users/${user._id}`, {
        password: newPassword
      });
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast({ message: "Password updated successfully.", type: "success" });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setToast({ message: "Failed to update password.", type: "error" });
      setTimeout(() => setToast(null), 4500);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${user._id}`);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
      alert("Your account has been deleted successfully. We're sad to see you go!");
    } catch (err) {
      setToast({ message: "Failed to delete account.", type: "error" });
      setTimeout(() => setToast(null), 4500);
    }
  };

  const downloadMyData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `homystay_data_${user?.name?.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
        <p className="text-gray-500 dark:text-gray-400">Please log in to manage your settings preferences.</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-3xl md:text-4xl text-gray-800 dark:text-white font-bold mb-8">
          System Settings
        </h1>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Settings Tabs Sidebar */}
          <div className="w-full md:w-64 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-4 shadow-sm flex flex-col gap-1 shrink-0">
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition cursor-pointer ${
                activeTab === "preferences"
                  ? "bg-teal-600 text-white border-none"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-none"
              }`}
            >
              <BsSliders size={16} /> Preferences
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-teal-600 text-white border-none"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-none"
              }`}
            >
              <BsBellFill size={15} /> Notifications
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition cursor-pointer ${
                activeTab === "security"
                  ? "bg-teal-600 text-white border-none"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-none"
              }`}
            >
              <BsShieldLockFill size={16} /> Security & Payments
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-teal-600 text-white border-none"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-none"
              }`}
            >
              <BsEyeSlashFill size={16} /> Privacy Controls
            </button>
          </div>

          {/* Active Settings Panel content */}
          <div className="flex-1 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* PREFERENCES PANEL */}
            {activeTab === "preferences" && (
              <div className="flex flex-col gap-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-gray-50 dark:border-gray-700/50">
                  Site Preferences
                </h3>

                {/* Appearance Switch */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold text-gray-450 dark:text-gray-450 uppercase tracking-wider">Appearance Theme</label>
                  <div className="grid grid-cols-3 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl max-w-sm">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`py-2 text-xs font-semibold rounded-xl transition cursor-pointer border-none ${
                        theme === "light" 
                          ? "bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm" 
                          : "text-gray-500 hover:text-gray-850 dark:hover:text-gray-200"
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`py-2 text-xs font-semibold rounded-xl transition cursor-pointer border-none ${
                        theme === "dark" 
                          ? "bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm" 
                          : "text-gray-500 hover:text-gray-855 dark:hover:text-gray-200"
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`py-2 text-xs font-semibold rounded-xl transition cursor-pointer border-none ${
                        theme === "system" 
                          ? "bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm" 
                          : "text-gray-500 hover:text-gray-855 dark:hover:text-gray-200"
                      }`}
                    >
                      System
                    </button>
                  </div>
                </div>

                {/* Language selection */}
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <label className="text-xs font-semibold text-gray-455 dark:text-gray-400 uppercase tracking-wider">Preferred Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Malayalam">മലയാളം (Malayalam)</option>
                    <option value="Spanish">Español (Spanish)</option>
                  </select>
                </div>

                {/* Currency selection */}
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <label className="text-xs font-semibold text-gray-455 dark:text-gray-400 uppercase tracking-wider">Preferred Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="₹">₹ (INR - Indian Rupee)</option>
                    <option value="$">$ (USD - United States Dollar)</option>
                    <option value="€">€ (EUR - Euro)</option>
                  </select>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS PANEL */}
            {activeTab === "notifications" && (
              <div className="flex flex-col gap-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-gray-50 dark:border-gray-700/50">
                  Notification Configurations
                </h3>

                <div className="flex flex-col gap-5 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Email Notifications</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Receive booking confirmations and bills via email</p>
                    </div>
                    <ToggleSwitch 
                      checked={emailNotif} 
                      onChange={(val) => handleToggleNotification("email", val, setEmailNotif)} 
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Push Notifications</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Receive instant alerts regarding reservation status changes</p>
                    </div>
                    <ToggleSwitch 
                      checked={pushNotif} 
                      onChange={(val) => handleToggleNotification("push", val, setPushNotif)} 
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Price Drop Alerts</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Notify me when rooms on my wishlist drop in price</p>
                    </div>
                    <ToggleSwitch 
                      checked={priceDropAlerts} 
                      onChange={(val) => handleToggleNotification("priceDrop", val, setPriceDropAlerts)} 
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Booking Reminders</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Remind me of upcoming check-in and travel dates</p>
                    </div>
                    <ToggleSwitch 
                      checked={bookingReminders} 
                      onChange={(val) => handleToggleNotification("bookingReminder", val, setBookingReminders)} 
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Promotional Offers</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Receive updates on discounts and holiday deals</p>
                    </div>
                    <ToggleSwitch 
                      checked={promoOffers} 
                      onChange={(val) => handleToggleNotification("promo", val, setPromoOffers)} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY & PAYMENTS PANEL */}
            {activeTab === "security" && (
              <div className="flex flex-col gap-8">
                {/* Change Password Trigger */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-playfair text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-gray-50 dark:border-gray-700/50">
                    Account Security
                  </h3>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Add an extra layer of security to your HomyStay account</p>
                    </div>
                    <ToggleSwitch checked={twoFactor} onChange={handleToggle2FA} />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="mt-4 w-fit px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer border-none shadow"
                  >
                    Change Password
                  </button>
                </div>

                {/* Tokenized Payment Cards list */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-700/50">
                    <h3 className="font-playfair text-xl font-bold text-gray-800 dark:text-white">
                      Saved Payment Methods
                    </h3>
                    {!showPaymentForm && (
                      <button
                        type="button"
                        onClick={() => setShowPaymentForm(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline transition cursor-pointer border-none"
                      >
                        <BsPlusLg size={10} /> Add Card
                      </button>
                    )}
                  </div>

                  {/* Add payment form card */}
                  {showPaymentForm && (
                    <form onSubmit={handleAddCard} className="bg-gray-50 dark:bg-gray-900/50 border p-5 rounded-2xl flex flex-col gap-4 animate-fade-in border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Link New Card</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-gray-400">Card Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. HDFC Credit"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="bg-white dark:bg-gray-900 border px-3 py-2 rounded-xl text-xs text-gray-800 dark:text-white outline-none border-gray-200 dark:border-gray-700"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-gray-400">Card Type</label>
                          <select
                            value={cardType}
                            onChange={(e) => setCardType(e.target.value)}
                            className="bg-white dark:bg-gray-900 border px-3 py-2 rounded-xl text-xs text-gray-800 dark:text-white outline-none cursor-pointer border-gray-200 dark:border-gray-700"
                          >
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                            <option value="Rupay">RuPay</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-gray-400">Card Number</label>
                          <input 
                            type="text" 
                            maxLength="16"
                            placeholder="16-digit card number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="bg-white dark:bg-gray-900 border px-3 py-2 rounded-xl text-xs text-gray-800 dark:text-white outline-none border-gray-200 dark:border-gray-700"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-gray-400">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            maxLength="5"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="bg-white dark:bg-gray-900 border px-3 py-2 rounded-xl text-xs text-gray-800 dark:text-white outline-none border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => setShowPaymentForm(false)}
                          className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-750 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
                        >
                          Add Card
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Masked cards layout list */}
                  {paymentMethods.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500">No linked payment methods.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {paymentMethods.map((pm) => (
                        <div key={pm.id} className="border border-gray-100 dark:border-gray-700/60 p-4 rounded-2xl flex justify-between items-center bg-gray-50/20 dark:bg-gray-800/10 hover:border-gray-200 transition">
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-xl">
                              <BsCreditCard2FrontFill size={18} />
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-gray-800 dark:text-white">{pm.cardName}</p>
                              <p className="text-[11px] text-gray-400 dark:text-gray-450 mt-0.5">
                                {pm.type} •••• {pm.last4} (Exp: {pm.expiry})
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteCard(pm.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-lg cursor-pointer bg-transparent border-none"
                          >
                            <BsTrashFill size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Login session activity */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-playfair text-lg font-semibold text-gray-800 dark:text-white pb-2 border-b border-gray-50 dark:border-gray-700/50">
                    Active Login Activity
                  </h3>
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                      <div>
                        <p className="font-semibold text-gray-850 dark:text-gray-200">Chrome (Windows 11) • Active Session</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Mumbai, India • 192.168.1.15</p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">This device</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 border-t border-gray-50 dark:border-gray-700/50 pt-3">
                      <div>
                        <p className="font-semibold text-gray-850 dark:text-gray-200">HomyStay App (iPhone 15)</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Delhi, India • 3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRIVACY PANEL */}
            {activeTab === "privacy" && (
              <div className="flex flex-col gap-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-gray-50 dark:border-gray-700/50">
                  Data & Privacy Controls
                </h3>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-gray-50 dark:bg-gray-900/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Download My Data</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Export a full JSON record of your bookings and personal profile.</p>
                    </div>
                    <button
                      onClick={downloadMyData}
                      className="px-4 py-2 bg-gray-105 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer border-none"
                    >
                      Download JSON
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-red-50/20 border border-red-100/50 dark:border-red-950/30 p-5 rounded-2xl mt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-red-650 dark:text-red-400">Delete Account</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Permanently delete your profile and booking history. This cannot be undone.</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 border border-red-200 dark:border-red-900 text-red-655 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Change Password modal overlay */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <form onSubmit={handleChangePassword} className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl relative animate-scale-up border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white text-base mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">Change Password</h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400">Current Password</label>
                <input 
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-white dark:bg-gray-900 border px-3 py-2 rounded-xl text-xs text-gray-800 dark:text-white outline-none border-gray-200 dark:border-gray-705"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white dark:bg-gray-900 border px-3 py-2 rounded-xl text-xs text-gray-800 dark:text-white outline-none border-gray-200 dark:border-gray-705"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400">Confirm New Password</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white dark:bg-gray-900 border px-3 py-2 rounded-xl text-xs text-gray-800 dark:text-white outline-none border-gray-200 dark:border-gray-705"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Destructive Account deletion modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl relative animate-scale-up border border-red-500/20">
            <h3 className="font-semibold text-red-600 dark:text-red-400 text-base mb-2">Delete HomyStay Account?</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              This action is permanent and cannot be undone. You will lose access to all your booked stays, billing histories, and saved wishlist items.
            </p>
            <div className="flex gap-2 justify-end border-t pt-4 border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 cursor-pointer"
              >
                No, Keep Account
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer border-none"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

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

export default SettingsPage;
