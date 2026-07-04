import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  dob: { type: String, default: "" },
  gender: { type: String, default: "" },
  addresses: [
    {
      id: { type: String },
      label: { type: String }, // Home, Work, Other
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String }
    }
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    priceDrop: { type: Boolean, default: true },
    bookingReminder: { type: Boolean, default: true },
    promo: { type: Boolean, default: true }
  },
  paymentMethods: [
    {
      id: { type: String },
      cardName: { type: String },
      cardNumber: { type: String }, // masked
      expiry: { type: String },
      type: { type: String }
    }
  ],
  twoFactorEnabled: { type: Boolean, default: false },
  theme: { type: String, default: "light" },
  currency: { type: String, default: "₹" },
  language: { type: String, default: "English" }
});

const User = mongoose.model("User", userSchema);

export default User;
