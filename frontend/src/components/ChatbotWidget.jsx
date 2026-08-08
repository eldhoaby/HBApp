// frontend/src/components/ChatbotWidget.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  BsChatDotsFill, 
  BsX, 
  BsSendFill, 
  BsArrowRepeat, 
  BsGeoAltFill, 
  BsStarFill, 
  BsHeadset,
  BsFillQuestionSquareFill,
  BsCompassFill,
  BsCheckCircleFill,
  BsCalendarCheckFill
} from "react-icons/bs";
import "./ChatbotWidget.css";
import DealBadge from "./DealBadge";
import { API_BASE_URL } from "../config/api";

// Preprogrammed HomyStay FAQ policies
const FAQ_ANSWERS = {
  cancellation: "📅 **Cancellation Policy:**\nYou can cancel any booking up to 24 hours before your scheduled check-in time for a full refund. Cancellations made within 24 hours of check-in will incur a charge equal to the first night's stay.",
  checkinout: "⏰ **Check-In & Check-Out Times:**\n- Standard Check-In: 12:00 PM (Noon)\n- Standard Check-Out: 11:00 AM\nEarly check-in or late check-out is subject to room availability and may incur nominal additional fees.",
  refund: "💳 **Refund Policy:**\nOnce cancellation is processed, refunds are automatically credited back to your original payment method (Stripe/Razorpay) within 5 to 7 business days.",
  amenities: "🛠️ **Hotel Amenities:**\nMost HomyStay rooms include high-speed Wi-Fi, television, air conditioning (AC), and hot water. Select premium stays offer swimming pool access, parking, and complimentary breakfast. Check individual room pills!",
};

import { usePreferences } from "../context/DarkModeContext";

const ChatbotWidget = () => {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  
  // State variables - loaded from sessionStorage to persist across page navigation
  const [isOpen, setIsOpen] = useState(() => {
    return sessionStorage.getItem("chatbot_isOpen") === "true";
  });
  
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("chatbot_activeTab") || "concierge"; // "concierge" or "faq"
  });

  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("chatbot_messages");
    return saved ? JSON.parse(saved) : [
      {
        role: "bot",
        content: "👋 Welcome to Ask HomyStay AI!\n\nI can help you search hotels, filter by budget, check details, or book directly in this chat.\n\nWhere would you like to stay? (e.g. Goa, Mumbai, Delhi, Jaipur...)",
        timestamp: new Date()
      }
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [sessionId, setSessionId] = useState(() => {
    return sessionStorage.getItem("chatbot_sessionId") || "session_" + Math.random().toString(36).substr(2, 9);
  });

  const [userLocation, setUserLocation] = useState(null);
  const [escalated, setEscalated] = useState(() => {
    return sessionStorage.getItem("chatbot_escalated") === "true";
  });

  const messagesEndRef = useRef(null);

  // Sync state to sessionStorage for persistence across page navigation
  useEffect(() => {
    sessionStorage.setItem("chatbot_isOpen", isOpen);
    sessionStorage.setItem("chatbot_activeTab", activeTab);
    sessionStorage.setItem("chatbot_messages", JSON.stringify(messages));
    sessionStorage.setItem("chatbot_sessionId", sessionId);
    sessionStorage.setItem("chatbot_escalated", escalated);
  }, [isOpen, activeTab, messages, sessionId, escalated]);

  // Scroll to bottom when messages or loading state updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Request browser geolocation automatically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Location access not shared on load.")
      );
    }
  }, []);

  const addSystemMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { role: "bot", content: text, timestamp: new Date() }
    ]);
  };

  const handleQuickReply = (text) => {
    handleSend(text);
  };

  const handleResetChat = async () => {
    try {
      await axios.post(`${API_BASE_URL}/chatbot/reset`, { sessionId });
      setMessages([
        {
          role: "bot",
          content: "🔄 Conversation reset. How can I help you find a hotel today?",
          timestamp: new Date()
        }
      ]);
      setEscalated(false);
      setActiveTab("concierge");
    } catch (err) {
      console.error("Failed to reset chatbot:", err);
    }
  };

  const handleEscalate = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: "📞 Connecting to a human support agent. A representative will join this chat shortly to assist you directly.",
        timestamp: new Date()
      }
    ]);
    setEscalated(true);
  };

  const getLoggedInUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      return null;
    }
  };

  // View room detail page directly
  const handleViewRoom = (roomId) => {
    setIsOpen(false);
    navigate(`/rooms/${roomId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Triggered when user clicks "Book Now" on hotel recommendations cards
  const handleBookNow = async (room) => {
    const currentUser = getLoggedInUser();
    
    if (!currentUser) {
      addSystemMessage("🔒 Please log in first. You can log in by clicking 'Login' at the top of the page, then try booking again.");
      return;
    }

    setIsLoading(true);
    try {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 1);
      const checkOut = new Date();
      checkOut.setDate(checkOut.getDate() + 3);

      const checkInStr = checkIn.toISOString().split("T")[0];
      const checkOutStr = checkOut.toISOString().split("T")[0];

      const response = await axios.post(`${API_BASE_URL}/chatbot/chat`, {
        message: `Book room ${room._id} from ${checkInStr} to ${checkOutStr} for 2 guests`,
        sessionId,
        userLocation,
        userId: currentUser._id
      });

      const { reply, bookingPending } = response.data;
      
      setMessages((prev) => [
        ...prev,
        { 
          role: "bot", 
          content: reply, 
          bookingPending: bookingPending || null,
          timestamp: new Date() 
        }
      ]);
    } catch (error) {
      console.error("Direct checkout request failed:", error);
      addSystemMessage("❌ Failed to initiate booking. Please try booking directly from the room page.");
    } finally {
      setIsLoading(false);
    }
  };

  // Securely execute booking confirmation after clicking the Confirm card button
  const handleConfirmPending = async (msgIndex, pendingData) => {
    setIsLoading(true);
    const currentUser = getLoggedInUser();
    
    if (!currentUser) {
      addSystemMessage("🔒 Please log in to complete booking.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/confirm-booking`, {
        ...pendingData,
        userId: currentUser._id
      });

      const { message, booking } = response.data;

      // Update message inline to show success and remove confirmation buttons
      setMessages((prev) => {
        const next = [...prev];
        next[msgIndex] = {
          ...next[msgIndex],
          content: message,
          bookingPending: null // Removes the confirmation box UI
        };
        return next;
      });

      if (booking) {
        // Automatically redirect user to reservation page
        setTimeout(() => {
          setIsOpen(false);
          navigate("/my-bookings");
        }, 3500);
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
        content: "Reservation draft cancelled by user.",
        bookingPending: null
      };
      return next;
    });
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user query to chat history
    const userMsg = {
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const currentUser = getLoggedInUser();

    // If active tab is FAQ Support, process locally for immediate trained responses
    if (activeTab === "faq") {
      setTimeout(() => {
        let answer = "I'm sorry, I didn't quite catch that. You can toggle the 'Concierge' tab to search hotels, or click 'Talk to a human' to escalate to human support.";
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
      }, 500);
      return;
    }

    // Normal Concierge flow
    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/chat`, {
        message: text,
        sessionId,
        userLocation,
        userId: currentUser ? currentUser._id : null
      });

      const { reply, rooms, escalated: sessionEscalated, bookingPending } = response.data;

      const botMsg = {
        role: "bot",
        content: reply,
        rooms: rooms || [],
        bookingPending: bookingPending || null,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
      
      if (sessionEscalated) {
        setEscalated(true);
      }
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
      {/* Floating Chat Trigger Button (Site's Teal Accent Color) */}
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
          {/* Top Header Row */}
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛎️</span>
              <div>
                <h3 className="font-semibold text-sm leading-tight font-playfair">Ask HomyStay AI</h3>
                <span className="text-[10px] opacity-80 flex items-center gap-1">
                  Online <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="text-[11px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition border-none cursor-pointer text-white"
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

          {/* Navigation Tabs (Concierge Search vs FAQ policies) */}
          <div className="flex bg-teal-700/50 border-t border-teal-500/20 text-xs font-medium">
            <button
              onClick={() => setActiveTab("concierge")}
              className={`flex-1 py-2 text-center border-b-2 flex justify-center items-center gap-1.5 transition cursor-pointer ${
                activeTab === "concierge" 
                  ? "border-white text-white font-semibold" 
                  : "border-transparent text-white/75 hover:text-white hover:bg-white/5"
              }`}
            >
              <BsCompassFill size={10} /> Concierge
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

        {/* Conversation Message area */}
        <div className="chatbot-messages bg-gray-50/50 dark:bg-gray-900/40 flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-msg-row ${msg.role}`}>
              <div className="chatbot-msg-bubble shadow-sm max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed">
                <div style={{ whiteSpace: "pre-line" }}>{msg.content}</div>

                {/* Secure Interactive Confirmation Card (bookingPending) */}
                {msg.bookingPending && (
                  <div className="bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50 p-4 rounded-xl mt-3 flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-teal-100/50 dark:border-teal-900/30">
                      <BsCalendarCheckFill className="text-teal-700 dark:text-teal-400" size={14} />
                      <h4 className="font-semibold text-xs text-teal-850 dark:text-teal-300 uppercase tracking-wider">Draft Reservation Details</h4>
                    </div>
                    
                    <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1 mt-1">
                      <p><strong>Room:</strong> {msg.bookingPending.roomName}</p>
                      <p><strong>Check-In:</strong> {msg.bookingPending.checkInDate}</p>
                      <p><strong>Check-Out:</strong> {msg.bookingPending.checkOutDate}</p>
                      <p><strong>Guests:</strong> {msg.bookingPending.guests}</p>
                      <p><strong>Total Price:</strong> <span className="text-teal-700 dark:text-teal-400 font-semibold">{formatPrice(msg.bookingPending.totalPrice)}</span></p>
                    </div>

                    <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-teal-100/50 dark:border-teal-900/30">
                      <button
                        onClick={() => handleCancelPending(idx)}
                        className="text-[10px] font-semibold text-gray-650 dark:text-gray-300 bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition border-none cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmPending(idx, msg.bookingPending)}
                        className="text-[10px] font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition border-none cursor-pointer flex items-center gap-1"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}

                {/* Hotel Recommendation Cards */}
                {msg.rooms && msg.rooms.length > 0 && (
                  <div className="chatbot-room-cards-container flex flex-col gap-3 mt-3">
                    {msg.rooms.map((room) => (
                      <div key={room._id} className="chatbot-room-card bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
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

                          <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-2 mt-1">
                            <div className="flex items-center">
                              <span className="font-bold text-gray-800 dark:text-white text-sm">{formatPrice(room.price)}</span>
                              <span className="text-[9px] text-gray-400 dark:text-gray-550">/n</span>
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

        {/* Escalation support info */}
        {activeTab === "faq" && !escalated && (
          <div className="px-4 py-2 border-t border-gray-150 dark:border-gray-800 flex justify-between items-center bg-teal-50/10 dark:bg-teal-950/5 shrink-0">
            <span className="text-[11px] text-gray-500 font-medium">Need human help?</span>
            <button 
              className="text-[10px] font-semibold bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-full flex items-center gap-1 transition border-none cursor-pointer"
              onClick={handleEscalate}
            >
              <BsHeadset size={10} /> Talk to a human
            </button>
          </div>
        )}

        {/* Quick replies Chips (Concierge Mode) */}
        {activeTab === "concierge" && (
          <div className="chatbot-quick-replies flex gap-1.5 p-3 overflow-x-auto border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shrink-0">
            <button className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent dark:text-gray-300" onClick={() => handleQuickReply("Rooms in Goa")}>🏖️ Goa</button>
            <button className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent dark:text-gray-300" onClick={() => handleQuickReply("Rooms under ₹2000")}>💰 Under ₹2000</button>
            <button className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent dark:text-gray-300" onClick={() => handleQuickReply("Show rooms with WiFi and Pool")}>🏊 WiFi & Pool</button>
            <button className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent dark:text-gray-300" onClick={() => handleQuickReply("Cheap rooms in Mumbai")}>🌆 Mumbai Budget</button>
          </div>
        )}

        {/* Quick replies Chips (FAQ Mode) */}
        {activeTab === "faq" && (
          <div className="chatbot-quick-replies flex gap-1.5 p-3 overflow-x-auto border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shrink-0">
            <button className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent dark:text-gray-300" onClick={() => handleQuickReply("Cancellation policy")}>📅 Cancellations</button>
            <button className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent dark:text-gray-300" onClick={() => handleQuickReply("Check-in and Check-out times")}>⏰ Check-In/Out</button>
            <button className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent dark:text-gray-300" onClick={() => handleQuickReply("Refund timeline")}>💳 Refunds</button>
            <button className="chatbot-quick-btn text-xs px-3 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950/20 transition shrink-0 border border-gray-250 dark:border-gray-700 bg-transparent dark:text-gray-300" onClick={() => handleQuickReply("Room amenities")}>🛠️ Amenities FAQ</button>
          </div>
        )}

        {/* Footer Input area */}
        <div className="chatbot-input-area border-t border-gray-100 dark:border-gray-800 p-3 flex gap-2 items-center bg-white dark:bg-gray-800 shrink-0">
          <input 
            type="text" 
            className="chatbot-input flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-850 dark:text-white focus:border-teal-500 rounded-xl px-3 py-2 text-sm outline-none transition" 
            placeholder={activeTab === "faq" ? "Ask about policies (cancellations, refunds...)" : "Search rooms (Goa, cheap, pool...)"}
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
