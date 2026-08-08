// frontend/src/components/ChatbotWidget.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  BsChatDotsFill, 
  BsX, 
  BsSendFill, 
  BsGeoAltFill, 
  BsStarFill, 
  BsHeadset,
  BsFillQuestionSquareFill,
  BsCompassFill,
  BsCalendarCheckFill,
  BsCheckCircleFill,
  BsSliders,
  BsArrowRightShort,
  BsCreditCardFill
} from "react-icons/bs";
import "./ChatbotWidget.css";
import DealBadge from "./DealBadge";
import { API_BASE_URL } from "../config/api";
import { usePreferences } from "../context/DarkModeContext";

// Grounded FAQ Policy text
const FAQ_ANSWERS = {
  cancellation: "📅 **Cancellation Policy:**\nYou can cancel any booking up to 24 hours before your scheduled check-in time for a full 100% refund. Cancellations made within 24 hours of check-in will incur a fee equal to the first night's stay.",
  checkinout: "⏰ **Check-In & Check-Out Times:**\n- Standard Check-In: 12:00 PM (Noon)\n- Standard Check-Out: 11:00 AM\nEarly check-in or late check-out is subject to room availability and nominal fee.",
  refund: "💳 **Refund Policy:**\nOnce a cancellation is confirmed, refunds are automatically returned to your original payment method (Razorpay/Stripe) within 5 to 7 business days.",
  amenities: "🛠️ **Hotel Amenities:**\nMost HomyStay rooms include high-speed Wi-Fi, TV, AC, and hot water. Select premium stays offer swimming pool, parking, and complimentary breakfast.",
};

const ChatbotWidget = () => {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  
  // State variables - loaded from sessionStorage for cross-navigation persistence
  const [isOpen, setIsOpen] = useState(() => sessionStorage.getItem("chatbot_isOpen") === "true");
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem("chatbot_activeTab") || "concierge");
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("chatbot_messages");
    return saved ? JSON.parse(saved) : [
      {
        role: "bot",
        content: "👋 Welcome to Ask HomyStay AI Concierge!\n\nI can assist with multi-constraint hotel searches (location, budget, dates, amenities), answer policy queries, or complete your booking right here in chat.\n\nWhere would you like to stay? (e.g. Goa, Mumbai, Delhi, Jaipur, Manali...)",
        timestamp: new Date()
      }
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => sessionStorage.getItem("chatbot_sessionId") || "session_" + Math.random().toString(36).substr(2, 9));
  const [userLocation, setUserLocation] = useState(null);
  const [escalated, setEscalated] = useState(() => sessionStorage.getItem("chatbot_escalated") === "true");
  const [activeFilters, setActiveFilters] = useState(null);
  const [dynamicChips, setDynamicChips] = useState(["Beach Stays in Goa", "Under ₹3000", "With Pool & WiFi", "Cheap Rooms in Mumbai"]);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  const messagesEndRef = useRef(null);

  // Sync state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("chatbot_isOpen", isOpen);
    sessionStorage.setItem("chatbot_activeTab", activeTab);
    sessionStorage.setItem("chatbot_messages", JSON.stringify(messages));
    sessionStorage.setItem("chatbot_sessionId", sessionId);
    sessionStorage.setItem("chatbot_escalated", escalated);
  }, [isOpen, activeTab, messages, sessionId, escalated]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Request browser geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => console.log("Location access skipped.")
      );
    }
  }, []);

  const getLoggedInUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      return null;
    }
  };

  const addSystemMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { role: "bot", content: text, timestamp: new Date() }
    ]);
  };

  const handleResetChat = async () => {
    try {
      await axios.post(`${API_BASE_URL}/chatbot/reset`, { sessionId });
      setMessages([
        {
          role: "bot",
          content: "🔄 Conversation reset. How can I help you find a stay today?",
          timestamp: new Date()
        }
      ]);
      setEscalated(false);
      setActiveFilters(null);
      setConfirmedBookingData(null);
      setDynamicChips(["Stays in Goa", "Under ₹3000", "With Swimming Pool", "Check Policies"]);
    } catch (err) {
      console.error("Failed to reset chatbot:", err);
    }
  };

  const handleEscalate = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: "📞 Connecting you to a live Human Support Representative. An agent will join this conversation shortly to assist you.",
        escalationCard: true,
        timestamp: new Date()
      }
    ]);
    setEscalated(true);
  };

  const handleViewRoom = (roomId) => {
    setIsOpen(false);
    navigate(`/rooms/${roomId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookNow = async (room) => {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
      addSystemMessage("🔒 Please log in first to complete a booking directly in chat. Use the 'Login' button at the top right.");
      return;
    }

    setIsLoading(true);
    try {
      const checkInStr = activeFilters?.checkInDate || new Date(Date.now() + 86400000).toISOString().split("T")[0];
      const checkOutStr = activeFilters?.checkOutDate || new Date(Date.now() + 172800000).toISOString().split("T")[0];
      const guestsCount = activeFilters?.guests || 2;

      const response = await axios.post(`${API_BASE_URL}/chatbot/chat`, {
        message: `Book room ${room._id} from ${checkInStr} to ${checkOutStr} for ${guestsCount} guests`,
        sessionId,
        userLocation,
        userId: currentUser._id
      });

      const { reply, bookingPending, proactiveChips } = response.data;
      
      setMessages((prev) => [
        ...prev,
        { 
          role: "bot", 
          content: reply, 
          bookingPending: bookingPending || null,
          timestamp: new Date() 
        }
      ]);
      if (proactiveChips) setDynamicChips(proactiveChips);
    } catch (error) {
      console.error("Direct checkout request failed:", error);
      addSystemMessage("❌ Failed to initiate booking draft. Please try booking directly from the room listing page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPending = async (msgIndex, pendingData) => {
    setIsLoading(true);
    const currentUser = getLoggedInUser();
    
    if (!currentUser) {
      addSystemMessage("🔒 Please log in to complete reservation.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/confirm-booking`, {
        ...pendingData,
        userId: currentUser._id
      });

      const { message, booking } = response.data;

      // Update inline card to show success state
      setMessages((prev) => {
        const next = [...prev];
        next[msgIndex] = {
          ...next[msgIndex],
          content: message,
          bookingPending: null,
          bookingSuccess: booking || null
        };
        return next;
      });

      if (booking) {
        setConfirmedBookingData(booking);
      }
    } catch (err) {
      console.error("Confirm booking failed:", err);
      const errMsg = err.response?.data?.message || "Failed to confirm booking details.";
      addSystemMessage(`❌ Reservation failed: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPending = (msgIndex) => {
    setMessages((prev) => {
      const next = [...prev];
      next[msgIndex] = {
        ...next[msgIndex],
        content: "Reservation draft cancelled.",
        bookingPending: null
      };
      return next;
    });
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const currentUser = getLoggedInUser();

    if (activeTab === "faq") {
      setTimeout(() => {
        let answer = "I'm sorry, I didn't quite catch that. You can ask about our cancellation policy, refund timelines, or check-in times. You can also switch to 'Concierge' to search hotels.";
        const normalized = text.toLowerCase();
        
        if (normalized.includes("cancel") || normalized.includes("policy")) {
          answer = FAQ_ANSWERS.cancellation;
        } else if (normalized.includes("check") || normalized.includes("time") || normalized.includes("hour")) {
          answer = FAQ_ANSWERS.checkinout;
        } else if (normalized.includes("refund") || normalized.includes("money") || normalized.includes("return")) {
          answer = FAQ_ANSWERS.refund;
        } else if (normalized.includes("amenit") || normalized.includes("wifi") || normalized.includes("pool")) {
          answer = FAQ_ANSWERS.amenities;
        }

        setMessages((prev) => [
          ...prev,
          { role: "bot", content: answer, timestamp: new Date() }
        ]);
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/chat`, {
        message: text,
        sessionId,
        userLocation,
        userId: currentUser ? currentUser._id : null
      });

      const { reply, rooms, filters, isAlternative, escalated: sessionEscalated, bookingPending, proactiveChips } = response.data;

      const botMsg = {
        role: "bot",
        content: reply,
        rooms: rooms || [],
        isAlternative: isAlternative || false,
        bookingPending: bookingPending || null,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
      if (filters) setActiveFilters(filters);
      if (proactiveChips) setDynamicChips(proactiveChips);
      if (sessionEscalated) setEscalated(true);

    } catch (error) {
      console.error("Chatbot query error:", error);
      const errMsg = error.response?.data?.reply || "⚠️ Connection error. Please verify the backend API server is online.";
      addSystemMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button 
        className="chatbot-float-btn bg-teal-600 hover:bg-teal-700 active:scale-95 shadow-lg transition duration-200 border-none" 
        onClick={() => setIsOpen(!isOpen)}
        title="Ask HomyStay AI"
      >
        <BsChatDotsFill size={26} />
      </button>

      {/* Chat Window Panel */}
      <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="bg-teal-600 text-white flex flex-col border-b border-teal-500 shadow-sm shrink-0">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛎️</span>
              <div>
                <h3 className="font-semibold text-sm leading-tight font-playfair">Ask HomyStay AI</h3>
                <span className="text-[10px] opacity-85 flex items-center gap-1">
                  Online Concierge <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="text-[11px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition border-none cursor-pointer text-white font-medium"
                onClick={handleResetChat}
                title="Reset conversation"
              >
                Reset
              </button>
              <button className="text-white opacity-80 hover:opacity-100 transition bg-transparent border-none cursor-pointer" onClick={() => setIsOpen(false)}>
                <BsX size={24} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-teal-700/50 border-t border-teal-500/20 text-xs font-medium">
            <button
              onClick={() => setActiveTab("concierge")}
              className={`flex-1 py-2 text-center border-b-2 flex justify-center items-center gap-1.5 transition cursor-pointer ${
                activeTab === "concierge" 
                  ? "border-white text-white font-semibold" 
                  : "border-transparent text-white/75 hover:text-white hover:bg-white/5"
              }`}
            >
              <BsCompassFill size={10} /> AI Concierge
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`flex-1 py-2 text-center border-b-2 flex justify-center items-center gap-1.5 transition cursor-pointer ${
                activeTab === "faq" 
                  ? "border-white text-white font-semibold" 
                  : "border-transparent text-white/75 hover:text-white hover:bg-white/5"
              }`}
            >
              <BsFillQuestionSquareFill size={10} /> FAQ Support
            </button>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFilters && (activeFilters.location || activeFilters.maxPrice || activeFilters.amenities?.length > 0) && (
          <div className="bg-teal-50 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/40 px-3 py-1.5 text-[10px] text-teal-800 dark:text-teal-300 flex items-center gap-2 overflow-x-auto shrink-0">
            <BsSliders size={10} className="shrink-0 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold shrink-0">Active Filters:</span>
            {activeFilters.location && <span className="bg-white dark:bg-teal-900/60 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/60 shrink-0">📍 {activeFilters.location}</span>}
            {activeFilters.maxPrice && <span className="bg-white dark:bg-teal-900/60 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/60 shrink-0">💰 Max ₹{activeFilters.maxPrice}</span>}
            {activeFilters.guests && <span className="bg-white dark:bg-teal-900/60 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/60 shrink-0">👥 {activeFilters.guests} Guests</span>}
            {activeFilters.amenities?.map((amenity, aIdx) => (
              <span key={aIdx} className="bg-white dark:bg-teal-900/60 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800/60 shrink-0">✨ {amenity}</span>
            ))}
          </div>
        )}

        {/* Conversation Message area */}
        <div className="chatbot-messages bg-gray-50/50 dark:bg-gray-900/40 flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-msg-row ${msg.role}`}>
              <div className="chatbot-msg-bubble shadow-sm max-w-[88%] rounded-2xl p-3.5 text-sm leading-relaxed">
                <div style={{ whiteSpace: "pre-line" }}>{msg.content}</div>

                {/* Human Support Handoff Card */}
                {msg.escalationCard && (
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3.5 rounded-xl mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <BsHeadset className="text-amber-600 dark:text-amber-400" size={20} />
                      <div>
                        <h4 className="font-semibold text-xs text-amber-900 dark:text-amber-200">Support Agent Notified</h4>
                        <p className="text-[10px] text-amber-700 dark:text-amber-400">Your query context has been passed to live support.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Secure Interactive Confirmation Card (bookingPending) */}
                {msg.bookingPending && (
                  <div className="bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 p-4 rounded-xl mt-3 flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-teal-200/60 dark:border-teal-900/40">
                      <BsCalendarCheckFill className="text-teal-700 dark:text-teal-400" size={14} />
                      <h4 className="font-semibold text-xs text-teal-900 dark:text-teal-200 uppercase tracking-wider">Draft Reservation Summary</h4>
                    </div>
                    
                    <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1 mt-0.5">
                      <p><strong>Room:</strong> {msg.bookingPending.roomName}</p>
                      <p><strong>Location:</strong> {msg.bookingPending.city}</p>
                      <p><strong>Dates:</strong> {msg.bookingPending.checkInDate} to {msg.bookingPending.checkOutDate}</p>
                      <p><strong>Guests:</strong> {msg.bookingPending.guests} Adults</p>
                      <p><strong>Total Amount:</strong> <span className="text-teal-700 dark:text-teal-400 font-bold text-sm">{formatPrice(msg.bookingPending.totalPrice)}</span></p>
                    </div>

                    <div className="flex gap-2 justify-end mt-1 pt-2 border-t border-teal-200/60 dark:border-teal-900/40">
                      <button
                        onClick={() => handleCancelPending(idx)}
                        className="text-[11px] font-semibold text-gray-650 dark:text-gray-300 bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition border-none cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmPending(idx, msg.bookingPending)}
                        className="text-[11px] font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition border-none cursor-pointer flex items-center gap-1"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirmed Booking Success Card */}
                {msg.bookingSuccess && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl mt-3 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                      <BsCheckCircleFill size={16} className="text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-semibold text-xs uppercase tracking-wider">Booking Draft Created!</h4>
                    </div>
                    
                    <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      <p><strong>Reservation ID:</strong> #{msg.bookingSuccess._id?.slice(-8)}</p>
                      <p><strong>Room:</strong> {msg.bookingSuccess.room?.name}</p>
                      <p><strong>Status:</strong> <span className="text-amber-600 dark:text-amber-400 font-semibold">Unpaid (Pending)</span></p>
                      <p><strong>Total:</strong> <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatPrice(msg.bookingSuccess.totalPrice)}</span></p>
                    </div>

                    <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-emerald-200/50 dark:border-emerald-900/40">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/payment", { state: { booking: msg.bookingSuccess } });
                        }}
                        className="w-full text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg transition border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <BsCreditCardFill size={12} /> Complete Payment Now
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/my-bookings");
                        }}
                        className="w-full text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-white dark:bg-gray-800 hover:bg-emerald-100/50 dark:hover:bg-gray-700 py-1.5 rounded-lg transition border border-emerald-200 dark:border-emerald-800 cursor-pointer text-center"
                      >
                        View in My Bookings
                      </button>
                    </div>
                  </div>
                )}

                {/* Hotel Recommendation Cards */}
                {msg.rooms && msg.rooms.length > 0 && (
                  <div className="chatbot-room-cards-container flex flex-col gap-3 mt-3">
                    {msg.rooms.map((room) => (
                      <div key={room._id} className="chatbot-room-card bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <img 
                          src={room.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"} 
                          alt={room.name} 
                          className="w-full h-28 object-cover" 
                        />
                        <div className="p-3 flex flex-col gap-1.5">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1 flex-1 font-playfair">{room.name}</h4>
                            <span className="flex items-center gap-0.5 text-amber-500 font-semibold text-xs shrink-0">
                              <BsStarFill size={9} /> {room.rating}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-light flex flex-wrap items-center gap-1">
                            <span>{room.roomType}</span>
                            {room.distance && (
                              <>
                                <span>•</span>
                                <span className="bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 px-1 rounded">📍 {room.distance}km</span>
                              </>
                            )}
                          </div>
                          
                          {/* Amenities */}
                          <div className="flex gap-1 flex-wrap">
                            {room.amenities?.slice(0, 3).map((amenity, keyIdx) => (
                              <span key={keyIdx} className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-[9px] px-1.5 py-0.5 rounded-full">{amenity}</span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-2 mt-1">
                            <div className="flex items-center">
                              <span className="font-bold text-gray-800 dark:text-white text-sm">{formatPrice(room.price)}</span>
                              <span className="text-[9px] text-gray-400">/n</span>
                              <DealBadge price={room.price} />
                            </div>
                            <div className="flex gap-1">
                              <button 
                                className="text-[10px] font-semibold text-gray-650 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 px-2 py-1 rounded transition border-none cursor-pointer"
                                onClick={() => handleViewRoom(room._id)}
                              >
                                View
                              </button>
                              <button 
                                className="text-[10px] font-semibold text-white bg-teal-600 hover:bg-teal-700 px-2 py-1 rounded transition border-none cursor-pointer"
                                onClick={() => handleBookNow(room)}
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="chatbot-msg-row bot">
              <div className="chatbot-msg-bubble bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm">
                <div className="typing-indicator flex items-center gap-1">
                  <div className="typing-dot bg-teal-600 w-1.5 h-1.5 rounded-full animate-bounce" />
                  <div className="typing-dot bg-teal-600 w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="typing-dot bg-teal-600 w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Escalation support info banner */}
        {activeTab === "faq" && !escalated && (
          <div className="px-4 py-2 border-t border-gray-150 dark:border-gray-800 flex justify-between items-center bg-teal-50/20 dark:bg-teal-950/10 shrink-0">
            <span className="text-[11px] text-gray-500 font-medium">Need human assistance?</span>
            <button 
              className="text-[10px] font-semibold bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-full flex items-center gap-1 transition border-none cursor-pointer"
              onClick={handleEscalate}
            >
              <BsHeadset size={10} /> Talk to a human
            </button>
          </div>
        )}

        {/* Dynamic Quick-Reply Chips */}
        {dynamicChips && dynamicChips.length > 0 && (
          <div className="chatbot-quick-replies flex gap-1.5 p-2.5 overflow-x-auto border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shrink-0">
            {dynamicChips.map((chipText, cIdx) => (
              <button 
                key={cIdx} 
                className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300"
                onClick={() => handleSend(chipText)}
              >
                {chipText}
              </button>
            ))}
          </div>
        )}

        {/* Footer Input area */}
        <div className="chatbot-input-area border-t border-gray-100 dark:border-gray-800 p-3 flex gap-2 items-center bg-white dark:bg-gray-800 shrink-0">
          <input 
            type="text" 
            className="chatbot-input flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-850 dark:text-white focus:border-teal-500 rounded-xl px-3 py-2 text-sm outline-none transition" 
            placeholder={activeTab === "faq" ? "Ask about policies (cancellations, refunds...)" : "Search stays (Goa, under 3000, pool...)"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className="chatbot-send-btn bg-teal-600 hover:bg-teal-700 active:scale-95 text-white w-9 h-9 rounded-xl flex items-center justify-center transition border-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none" 
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
          >
            <BsSendFill size={12} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatbotWidget;
