
// import React, { useEffect, useState } from "react";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const navigate = useNavigate();

//   const fetchBookings = async () => {
//     try {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       const userId = storedUser?._id;

//       if (!userId) {
//         navigate("/login");
//         return;
//       }

//       const res = await axios.get(`http://localhost:3000/bookings/user/${userId}`);
//       setBookings(res.data);
//       console.log("Bookings fetched:", res.data);
//     } catch (err) {
//       console.error("Failed to fetch bookings", err);
//     }
//   };

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (!storedUser || !storedUser._id) {
//       navigate("/login");
//     } else {
//       fetchBookings();
//     }
//   }, []);

//   // Updated: Change booking status to "Cancelled by Admin" instead of deleting
//   const handleRemove = async (bookingId) => {
//     const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
//     if (!confirmCancel) return;

//     try {
//       await axios.put(`http://localhost:3000/bookings/${bookingId}`, { status: "Cancelled by Admin" });
//       setBookings((prev) =>
//         prev.map((b) => (b._id === bookingId ? { ...b, status: "Cancelled by Admin" } : b))
//       );
//       alert("Booking cancelled by admin.");
//     } catch (err) {
//       console.error("Failed to cancel booking", err);
//       alert("❌ Failed to cancel booking.");
//     }
//   };

//   const handlePayNow = (booking) => {
//     window.scrollTo(0, 0);
//     navigate("/payment", {
//       state: { booking },
//     });
//   };

//   return (
//     <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
//       <Title
//         title="My Bookings"
//         subTitle="Easily manage your past, current and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks."
//         align="left"
//       />

//       <div className="max-w-6xl mt-8 w-full text-gray-800">
//         <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
//           <div>Hotels</div>
//           <div>Date & Timings</div>
//           <div>Actions</div>
//         </div>

//         {bookings.map((booking) => (
//           <div
//             key={booking._id}
//             className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
//           >
//             <div className="flex flex-col md:flex-row">
//               <img
//                 src={booking.room?.images?.[0] || assets.defaultRoomImage}
//                 onError={(e) => (e.target.src = assets.defaultRoomImage)}
//                 alt="hotel-img"
//                 className="min-md:w-44 rounded shadow object-cover h-28 w-44"
//               />
//               <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
//                 <p className="font-playfair text-2xl">
//                   {booking.hotel?.name}
//                   <span className="font-inter text-sm"> ({booking.room?.roomType})</span>
//                 </p>
//                 <div className="flex items-center gap-1 text-sm text-gray-500">
//                   <img src={assets.locationIcon} alt="Location icon" />
//                   <span>{booking.hotel?.address}</span>
//                 </div>
//                 <div className="flex items-center gap-1 text-sm text-gray-500">
//                   <img src={assets.guestsIcon} alt="Guests icon" />
//                   <span>Guests: {booking.guests}</span>
//                 </div>
//                 <p className="text-base font-medium">
//                   Total: ₹{booking.totalPrice?.toLocaleString("en-IN")}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
//               <div>
//                 <p>Check-In:</p>
//                 <p className="text-gray-500 text-sm">
//                   {new Date(booking.checkInDate).toDateString()}
//                 </p>
//               </div>
//               <div>
//                 <p>Check-Out:</p>
//                 <p className="text-gray-500 text-sm">
//                   {new Date(booking.checkOutDate).toDateString()}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col items-start justify-center pt-3 gap-2">
//               {booking.status === "Cancelled by Admin" ? (
//                 <p className="text-red-600 font-semibold">Booking cancelled by admin.</p>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`h-3 w-3 rounded-full ${
//                         booking.isPaid ? "bg-green-500" : "bg-red-500"
//                       }`}
//                     ></div>
//                     <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
//                       {booking.isPaid ? "Paid" : "Unpaid"}
//                     </p>
//                   </div>

//                   {!booking.isPaid && (
//                     <button
//                       className="px-4 py-1.5 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all"
//                       onClick={() => handlePayNow(booking)}
//                     >
//                       Pay Now
//                     </button>
//                   )}

//                   <button
//                     className="px-4 py-1.5 text-xs text-red-600 border border-red-400 rounded-full hover:bg-red-50 transition-all"
//                     onClick={() => handleRemove(booking._id)}
//                   >
//                     Cancel Booking
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}

//         {bookings.length === 0 && (
//           <p className="text-center text-gray-500 mt-8">No bookings yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyBookings;

import React, { useEffect, useState } from "react";
import axiosInstance from "axios";
import { useNavigate } from "react-router-dom";
import { 
  BsCalendarCheckFill, 
  BsGeoAltFill, 
  BsArrowCounterclockwise, 
  BsCheckCircleFill, 
  BsXCircleFill,
  BsClockHistory,
  BsCreditCard,
  BsShieldCheck
} from "react-icons/bs";
import Title from "../components/Title";
import { usePreferences } from "../context/DarkModeContext";

const API_BASE_URL = "http://localhost:3000";

const MyBookings = () => {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" | "past" | "cancelled"
  const [cancelBookingId, setCancelBookingId] = useState(null); // ID of booking pending cancellation
  const [toast, setToast] = useState(null);

  const fetchBookings = async () => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userJson);
      const userId = user._id || user.id;
      const res = await axios.get(`http://localhost:3000/bookings/user/${userId}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      const msg = err.response?.data?.message || "Failed to connect to reservations server.";
      setErrorMsg(msg);
      setToast({ message: `❌ Error: ${msg}`, type: "error" });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmCancelBooking = async (bookingId) => {
    try {
      const res = await axios.put(`http://localhost:3000/bookings/${bookingId}`, {
        status: "Cancelled by User",
      });

      const updatedBooking = res.data;

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updatedBooking : b))
      );

      setToast({ message: "🎉 Reservation cancelled successfully. Refund processing.", type: "success" });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      const errorMsg = err.response?.data?.error || "Failed to cancel booking. Try again.";
      setToast({ message: `❌ Error: ${errorMsg}`, type: "error" });
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handlePayNow = (booking) => {
    window.scrollTo(0, 0);
    navigate("/payment", {
      state: { booking },
    });
  };

  const handleRebook = (booking) => {
    const city = booking.room?.city || booking.hotel?.address?.split(",")?.pop()?.trim() || "";
    navigate(`/rooms?city=${encodeURIComponent(city)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getBookingDetails = (booking) => {
    const todayStr = new Date().toISOString().split("T")[0];
    
    // 1. Determine base status classification
    let status = "unpaid";
    if (booking.bookingStatus === "cancelled" || booking.status?.startsWith("Cancelled")) {
      status = "cancelled";
    } else if (booking.checkOutDate < todayStr) {
      status = "completed";
    } else if (booking.paymentStatus === "paid" || booking.isPaid) {
      status = "paid";
    } else {
      status = "unpaid";
    }

    // 2. Map styling classes and tab destinations
    switch (status) {
      case "paid":
        return {
          label: "Paid",
          badgeClass: "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-900/30",
          tab: "upcoming",
          canCancel: booking.checkInDate > todayStr
        };
      case "unpaid":
        return {
          label: "Unpaid",
          badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 animate-pulse",
          tab: "upcoming",
          showPayButton: true,
          canCancel: booking.checkInDate > todayStr
        };
      case "completed":
        return {
          label: "Completed",
          badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30",
          tab: "past"
        };
      case "cancelled":
        return {
          label: "Cancelled",
          badgeClass: "bg-red-50 text-red-700 dark:bg-red-955/20 dark:text-red-400 border border-red-200 dark:border-red-900/30",
          tab: "cancelled",
          strikethrough: true
        };
      default:
        return {
          label: "Unpaid",
          badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30",
          tab: "upcoming"
        };
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16 flex justify-center items-center min-h-[60vh] bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-600" />
      </div>
    );
  }

  // Filter bookings to active tabs dynamically
  const filteredBookings = bookings.filter((b) => {
    const details = getBookingDetails(b);
    return details.tab === activeTab;
  });

  return (
    <div className="pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <Title
          title="My Reservations"
          subTitle="Easily manage your past, current, and upcoming hotel bookings in one place."
          align="left"
        />

        {/* Tab grouping switches */}
        <div className="flex gap-4 border-b border-gray-150 dark:border-gray-800 pb-3 mt-8">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold pb-2 border-b-2 px-1 transition-all border-none bg-transparent cursor-pointer uppercase tracking-wider ${
                activeTab === tab
                  ? "border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              {tab === "upcoming" && "Upcoming Stays"}
              {tab === "past" && "Past Stays"}
              {tab === "cancelled" && "Cancelled Stays"}
            </button>
          ))}
        </div>

        {/* Bookings cards stack */}
        <div className="flex flex-col gap-6 mt-8">
          {filteredBookings.map((booking) => {
            const details = getBookingDetails(booking);
            return (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col lg:flex-row justify-between gap-6"
              >
                {/* Thumbnail image and room features info */}
                <div className="flex flex-col md:flex-row gap-5 flex-1">
                  <img
                    src={booking.room?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500";
                    }}
                    alt="hotel-img"
                    className="w-full md:w-48 h-32 rounded-2xl object-cover shadow-sm bg-gray-100 dark:bg-gray-700"
                  />
                  <div className="flex flex-col gap-1.5 justify-center">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-playfair text-xl md:text-2xl font-semibold text-gray-850 dark:text-white">
                        {booking.hotel?.name || booking.room?.name}
                      </h3>
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${details.badgeClass}`}>
                        {details.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-450 font-light">
                      Room Type: {booking.room?.roomType}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <BsGeoAltFill className="text-teal-650 dark:text-teal-400 shrink-0" size={12} />
                      <span>{booking.hotel?.address || booking.room?.address}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mt-2">
                      Total: <span className="text-teal-650 dark:text-teal-400 font-bold">{formatPrice(booking.totalPrice)}</span>
                    </p>
                  </div>
                </div>

                {/* Dates display with strikethrough check */}
                <div className={`flex flex-row md:items-center justify-between lg:justify-center gap-8 border-t border-b lg:border-t-0 lg:border-b-0 border-gray-100 dark:border-gray-700/50 py-4 lg:py-0 px-2 ${details.strikethrough ? "line-through text-gray-400 opacity-60" : ""}`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Check-In</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">
                      {new Date(booking.checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Check-Out</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">
                      {new Date(booking.checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Actions column */}
                <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                  {details.showPayButton && (
                    <button
                      onClick={() => handlePayNow(booking)}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer text-center border-none flex items-center justify-center gap-1"
                    >
                      <BsCreditCard size={12} /> Complete Payment
                    </button>
                  )}

                  {details.canCancel && (
                    <button
                      onClick={() => setCancelBookingId(booking._id)}
                      className="border border-red-200 dark:border-red-900 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer text-center bg-transparent"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {details.tab === "past" && (
                    <button
                      onClick={() => handleRebook(booking)}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer border-none"
                    >
                      <BsArrowCounterclockwise size={12} /> Rebook Stay
                    </button>
                  )}

                  {details.tab === "cancelled" && (
                    <span className="text-xs text-gray-400 italic">No actions available</span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredBookings.length === 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700/60 p-12 rounded-3xl text-center shadow-sm">
              <p className="text-gray-450 dark:text-gray-400 text-sm">
                {activeTab === "upcoming" && "You have no upcoming bookings."}
                {activeTab === "past" && "You have no past completed bookings."}
                {activeTab === "cancelled" && "You have no cancelled stays."}
              </p>
              <button
                onClick={() => navigate("/rooms")}
                className="mt-6 inline-flex bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition shadow border-none cursor-pointer"
              >
                Explore Rooms & Book Stays
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Light-themed Cancellation Policy Modal */}
      {cancelBookingId && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-xl p-6 rounded-3xl w-full max-w-md animate-fade-in text-gray-850 dark:text-gray-200">
            <h3 className="font-playfair text-xl font-bold text-gray-850 dark:text-white mb-2">Cancel Reservation</h3>
            <p className="text-sm mb-4 leading-normal text-gray-600 dark:text-gray-300">
              Are you sure you want to cancel this booking? This action cannot be undone and will release your room dates.
            </p>
            
            <div className="bg-teal-50/50 dark:bg-teal-950/20 border border-teal-150 dark:border-teal-900/50 p-4 rounded-2xl text-xs space-y-2 mb-6">
              <p className="font-semibold text-teal-800 dark:text-teal-400 flex items-center gap-1">
                <BsShieldCheck size={13} /> HomyStay cancellation & Refund Policy
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-normal font-light">
                Stays cancelled 24 hours or more before check-in qualify for a full refund. Cancellations made inside 24 hours will incur a charge equal to the first night's stay. Paid bookings will be automatically refunded back to your original payment card.
              </p>
            </div>

            <div className="flex gap-3 justify-end border-t dark:border-gray-700 pt-4">
              <button
                onClick={() => setCancelBookingId(null)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-250 text-xs font-semibold px-4 py-2.5 rounded-xl border-none cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-650 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  confirmCancelBooking(cancelBookingId);
                  setCancelBookingId(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border-none cursor-pointer transition shadow-sm"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 text-xs font-bold text-white transition-all duration-300 animate-slide-up ${
          toast.type === "success" ? "bg-teal-600" : "bg-red-650"
        }`}>
          {toast.type === "success" ? <BsCheckCircleFill size={16} /> : <BsXCircleFill size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
