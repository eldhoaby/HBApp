import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config(); // Make sure to load .env variables

const router = express.Router();

// ✅ Use environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // ✅ Secure
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Create Razorpay Order
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  const options = {
    amount: amount * 100, // ₹ → paise
    currency,
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order); // No need to wrap in { success, order }
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// ✅ Verify Payment Signature
router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ success: true, message: "Payment verified" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

export default router;
