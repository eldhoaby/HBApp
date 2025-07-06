import React, { useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const Confirmation = () => {
  const location = useLocation();
  const { booking } = location.state || {};
  const pdfRef = useRef();

  if (!booking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-xl text-red-600">No booking found.</p>
      </div>
    );
  }

  const {
    room = {},
    hotel = {},
    checkInDate,
    checkOutDate,
    guests,
    totalPrice,
    isPaid
  } = booking;

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(30, 30, 120);
    doc.text("HomyStay", 20, 20);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Booking Confirmation", 20, 35);

    doc.setFontSize(12);
    doc.text(`Hotel: ${hotel.name || room.name || "N/A"}`, 20, 50);
    doc.text(`Room Type: ${room.roomType || "Standard"}`, 20, 60);
    doc.text(`Check-In: ${new Date(checkInDate).toLocaleDateString("en-IN")}`, 20, 70);
    doc.text(`Check-Out: ${new Date(checkOutDate).toLocaleDateString("en-IN")}`, 20, 80);
    doc.text(`Guests: ${guests}`, 20, 90);
    doc.text(`Total Paid: ₹${totalPrice}`, 20, 100);
    doc.text(`Status: ${isPaid ? 'Paid' : 'Unpaid'}`, 20, 110);

    doc.save("HomyStay-Booking-Confirmation.pdf");
  };

  return (
    <div className="min-h-screen px-6 pt-28 pb-16 bg-gradient-to-br from-blue-50 to-green-100 flex flex-col items-center">
      <div
        ref={pdfRef}
        className="bg-white shadow-2xl border border-gray-200 p-10 rounded-xl w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">HomyStay</h1>
          <p className="text-lg mt-1 text-gray-700">Booking Confirmation</p>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-green-700">
            ✅ Payment Successful!
          </h2>
          <p className="text-md text-gray-600 mt-2">Thank you for booking with us!</p>
        </div>

        <div className="bg-gray-50 rounded-lg px-6 py-4 border border-gray-200">
          <div className="text-base space-y-2 text-gray-800">
            <p><strong>🏨 Hotel:</strong> {hotel.name || room.name}</p>
            <p><strong>🛏️ Room Type:</strong> {room.roomType || "Standard"}</p>
            <p><strong>📍 Address:</strong> {hotel.address || "N/A"}</p>
            <p><strong>📅 Check-in:</strong> {new Date(checkInDate).toLocaleDateString("en-IN")}</p>
            <p><strong>📅 Check-out:</strong> {new Date(checkOutDate).toLocaleDateString("en-IN")}</p>
            <p><strong>👤 Guests:</strong> {guests}</p>
            <p><strong>💰 Total Paid:</strong> ₹{totalPrice}</p>
            <p><strong>🧾 Status:</strong> {isPaid ? '✅ Paid' : '❌ Unpaid'}</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition-all"
          >
            Download Confirmation PDF
          </button>
        </div>
      </div>

      <p className="mt-6 text-gray-700 text-center">
        Go back to <Link to="/rooms" className="text-blue-600 underline hover:text-blue-800">Rooms</Link> page
      </p>
    </div>
  );
};

export default Confirmation;
