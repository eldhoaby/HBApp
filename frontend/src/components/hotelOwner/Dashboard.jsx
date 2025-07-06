// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Dashboard = () => {
//   const [metrics, setMetrics] = useState({
//     totalBookings: 0,
//     totalRevenue: 0,
//     pendingBookings: 0,
//     bookings: []
//   });

//   useEffect(() => {
//     fetchMetrics();
//   }, []);

//   const fetchMetrics = async () => {
//     try {
//       const res = await axios.get('http://localhost:3000/admin/metrics');
//       setMetrics(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching metrics:", err);
//     }
//   };

//   const handleCancelBooking = async (bookingId) => {
//   const confirm = window.confirm("Are you sure you want to cancel this booking?");
//   if (!confirm) return;

//   try {
//     await axios.put(`http://localhost:3000/bookings/${bookingId}`, { status: "Cancelled by Admin" });
//     alert("✅ Booking cancelled successfully!");
//     fetchMetrics(); // Refresh after update
//   } catch (error) {
//     console.error("❌ Error cancelling booking:", error);
//     alert("Failed to cancel booking.");
//   }
// };


//   return (
//     <div className="space-y-6 px-4 py-6">
//       {/* Top metrics */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-blue-500 text-white rounded p-6 shadow">
//           <h3 className="text-lg font-medium">Total Bookings</h3>
//           <p className="text-2xl font-bold mt-2">{metrics.totalBookings}</p>
//         </div>
//         <div className="bg-green-500 text-white rounded p-6 shadow">
//           <h3 className="text-lg font-medium">Total Revenue</h3>
//           <p className="text-2xl font-bold mt-2">₹{metrics.totalRevenue}</p>
//         </div>
//         <div className="bg-yellow-500 text-white rounded p-6 shadow">
//           <h3 className="text-lg font-medium">Pending Bookings</h3>
//           <p className="text-2xl font-bold mt-2">{metrics.pendingBookings}</p>
//         </div>
//       </div>

//       {/* All Bookings Table */}
//       <div className="bg-white rounded shadow p-4 mt-6 overflow-x-auto">
//         <h2 className="text-lg font-semibold mb-3">All Bookings</h2>
//         <table className="w-full text-left">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-2 px-4 font-medium">User</th>
//               <th className="py-2 px-4 font-medium">Phone</th>
//               <th className="py-2 px-4 font-medium">Room</th>
//               <th className="py-2 px-4 font-medium">Amount</th>
//               <th className="py-2 px-4 font-medium">Status</th>
//               <th className="py-2 px-4 font-medium">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {metrics.bookings && metrics.bookings.length > 0 ? (
//               metrics.bookings.map((b, idx) => (
//                 <tr key={idx} className="border-t">
//                   <td className="py-2 px-4">{b.userName}</td>
//                   <td className="py-2 px-4">{b.phone}</td>
//                   <td className="py-2 px-4">{b.roomName}</td>
//                   <td className="py-2 px-4">₹{b.amount}</td>
//                   <td className="py-2 px-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         b.status === 'Completed'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-yellow-100 text-yellow-700'
//                       }`}
//                     >
//                       {b.status}
//                     </span>
//                   </td>
//                   <td className="py-2 px-4">
//                     <button
//   onClick={() => handleCancelBooking(b._id)}
//   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
// >
//   Cancel
// </button>

//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr className="border-t">
//                 <td className="py-3 px-4 text-gray-500" colSpan={6}>
//                   No bookings found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    bookings: []
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error("❌ Error fetching metrics:", err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:3000/bookings/${bookingId}`, { status: "Cancelled by Admin" });
      alert("✅ Booking cancelled successfully!");
      fetchMetrics(); // Refresh dashboard data
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to delete this booking permanently?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/bookings/${bookingId}`);
      alert("🗑️ Booking deleted successfully!");
      fetchMetrics(); // Refresh dashboard data
    } catch (error) {
      console.error("❌ Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white rounded p-6 shadow">
          <h3 className="text-lg font-medium">Total Bookings</h3>
          <p className="text-2xl font-bold mt-2">{metrics.totalBookings}</p>
        </div>
        <div className="bg-green-500 text-white rounded p-6 shadow">
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">₹{metrics.totalRevenue}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded p-6 shadow">
          <h3 className="text-lg font-medium">Pending Bookings</h3>
          <p className="text-2xl font-bold mt-2">{metrics.pendingBookings}</p>
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="bg-white rounded shadow p-4 mt-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">All Bookings</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 font-medium">User</th>
              <th className="py-2 px-4 font-medium">Phone</th>
              <th className="py-2 px-4 font-medium">Room</th>
              <th className="py-2 px-4 font-medium">Amount</th>
              <th className="py-2 px-4 font-medium">Status</th>
              <th className="py-2 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {metrics.bookings && metrics.bookings.length > 0 ? (
              metrics.bookings.map((b, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">{b.userName}</td>
                  <td className="py-2 px-4">{b.phone}</td>
                  <td className="py-2 px-4">{b.roomName}</td>
                  <td className="py-2 px-4">₹{b.amount}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        b.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'Cancelled by Admin'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    {b.status === "Cancelled by Admin" ? (
                      <span className="text-red-600 font-semibold text-xs">Cancelled</span>
                    ) : (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBooking(b._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="py-3 px-4 text-gray-500" colSpan={6}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
