import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    recentBookings: []
  });

  // useEffect(() => {
  //   console.log("🔁 useEffect running - attempting to fetch metrics");

  //   const fetchMetrics = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:3000/admin/metrics');
  //       console.log("✅ Metrics fetched:", res.data);
  //       setMetrics(res.data);
  //     } catch (err) {
  //       console.error("❌ Error loading metrics:", err);
  //     }
  //   };

  //   fetchMetrics();
  // }, []);
  useEffect(() => {
  const fetchMetrics = async () => {
    try {
      console.log("📡 Fetching metrics...");
      const res = await axios.get('http://localhost:3000/admin/metrics');
      console.log("✅ Metrics response:", res.data);
      setMetrics(res.data);
    } catch (err) {
      console.error("❌ Error fetching metrics:", err);
    }
  };

  fetchMetrics();
}, []);


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

      {/* Recent Bookings Table */}
      <div className="bg-white rounded shadow p-4 mt-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Recent Bookings</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 font-medium">User</th>
              <th className="py-2 px-4 font-medium">Room</th>
              <th className="py-2 px-4 font-medium">Amount</th>
              <th className="py-2 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {metrics.recentBookings.length > 0 ? (
              metrics.recentBookings.map((b, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">{b.userName}</td>
                  <td className="py-2 px-4">{b.roomName}</td>
                  <td className="py-2 px-4">₹{b.amount}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        b.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="py-3 px-4 text-gray-500" colSpan={4}>
                  No bookings yet
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
