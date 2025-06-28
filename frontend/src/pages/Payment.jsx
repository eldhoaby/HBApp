import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, checkIn, checkOut, guests } = location.state;

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // ✅ Properly extract userId from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  const nights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  );
  const total = room.price * nights;

  const handlePayment = async () => {
    try {
      const res = await fetch('http://localhost:3000/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });

      const data = await res.json();
      const order = data.order;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: room.name,
        description: `Booking for ${room.roomType}`,
        order_id: order.id,
        handler: async function (response) {
          alert('Payment Successful!');
          console.log('Razorpay Payment ID:', response.razorpay_payment_id);

          // Save booking to backend
          const bookingData = {
            userId,
            room,
            hotel: {
              name: room.name,
              address: room.address,
            },
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guests,
            totalPrice: total,
            isPaid: true,
          };

          try {
            await fetch('http://localhost:3000/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bookingData),
            });

            navigate('/confirmation', {
              state: { booking: bookingData },
            });
          } catch (err) {
            console.error('Booking save failed:', err);
            alert('Payment succeeded, but failed to save booking.');
          }
        },
        prefill: {
          name: user?.name || 'Guest',
          email: user?.email || 'guest@example.com',
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
        <p className="mb-2"><strong>Room:</strong> {room.name}</p>
        <p className="mb-2"><strong>Check-in:</strong> {checkIn}</p>
        <p className="mb-2"><strong>Check-out:</strong> {checkOut}</p>
        <p className="mb-2"><strong>Guests:</strong> {guests}</p>
        <p className="text-lg font-medium mt-4 mb-6">
          Total: ₹{room.price} x {nights} nights = ₹{total}
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
