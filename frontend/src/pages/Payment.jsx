import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};
  const { room, hotel, checkInDate, checkOutDate, guests, totalPrice, _id: bookingId } = booking || {};

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!booking) {
    return <p className="pt-32 text-center text-red-600">Invalid booking. Please try again.</p>;
  }

  const nights = Math.ceil(
    (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
  );

  const handlePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) {
        alert("Please log in to continue.");
        navigate("/login");
        return;
      }

      const res = await fetch('http://localhost:3000/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const data = await res.json();
      const order = data.order; // ✅ Correct: use `data.order`, not `data`

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: hotel?.name || 'Hotel Booking',
        description: `Booking for ${room?.roomType}`,
        order_id: order.id,
        handler: async function (response) {
          alert('Payment Successful! ✅');

          try {
            const updateRes = await axios.put(`http://localhost:3000/bookings/${bookingId}`, {
              isPaid: true,
            });

            navigate('/confirmation', {
              state: { booking: updateRes.data },
            });
          } catch (err) {
            console.error('Booking update failed:', err);
            alert('Payment succeeded, but failed to update booking.');
          }
        },
        prefill: {
          name: user.name || 'Guest',
          email: user.email || 'guest@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Something went wrong during payment.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg p-10 rounded-lg w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Proceed to Payment</h2>
        <p className="mb-2"><strong>Room:</strong> {room?.name}</p>
        <p className="mb-2"><strong>Check-in:</strong> {new Date(checkInDate).toDateString()}</p>
        <p className="mb-2"><strong>Check-out:</strong> {new Date(checkOutDate).toDateString()}</p>
        <p className="mb-2"><strong>Guests:</strong> {guests}</p>
        <p className="text-lg font-medium mt-4 mb-6">
          Total: ₹{room?.price} x {nights} nights = ₹{totalPrice}
        </p>
        <button
          onClick={handlePayment}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          Pay Now with Razorpay
        </button>
      </div>
    </div>
  );
};

export default Payment;
