# HOMYSTAY Production Deployment Guide

This document outlines how to securely deploy the HOMYSTAY platform to Vercel (Frontend) and Render (Backend) using the configuration files provided.

## 1. Environment Variables Setup

Before deploying, you must configure your production secrets.

### Backend (Render)
When deploying your backend web service on Render, add the following Environment Variables in the Render dashboard:
- `NODE_ENV` = `production`
- `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.3ntfysi.mongodb.net` (Your MongoDB Atlas connection string — **without** the database name, that is appended in code)
- `ADMIN_EMAIL` = `(Your admin email)`
- `ADMIN_PASSWORD` = `(Your admin password)`
- `RAZORPAY_KEY_ID` = `rzp_test_...` or `rzp_live_...`
- `RAZORPAY_KEY_SECRET` = `(Your Razorpay Secret)`
- `FRONTEND_URL` = *(Fill this in once Vercel gives you your frontend URL, e.g., `https://homystay-app.vercel.app`)*

### Frontend (Vercel)
When deploying the frontend on Vercel, add the following Environment Variables in the Vercel dashboard:
- `VITE_API_BASE_URL` = *(Fill this in once Render gives you your backend URL, e.g., `https://homystay-backend.onrender.com`)*
- `VITE_RAZORPAY_KEY_ID` = `rzp_test_...` or `rzp_live_...`

---

## 2. Deployment Execution

### Step 1: Remove tracked .env files from Git (CRITICAL)
Your `backend/.env` and `frontend/.env` files containing real secrets are currently tracked by Git. Run these commands **before pushing**:
```bash
git rm --cached backend/.env frontend/.env
git commit -m "chore: remove tracked .env files from version control"
```
This removes them from Git tracking without deleting them locally.

### Step 2: Deploy Backend to Render
1. Push your repository to GitHub.
2. Log into [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
6. Add your Environment Variables as listed above.
7. Click **Deploy**.
8. **Copy your Live Backend URL** and save it.

### Step 3: Deploy Frontend to Vercel
1. Log into [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your HOMYSTAY GitHub repository.
3. Ensure the framework preset is set to **Vite** and the Root Directory is set to `frontend`.
4. Add your Environment Variables, ensuring `VITE_API_BASE_URL` is set to the Live Backend URL you copied from Render.
5. Click **Deploy**. Vercel will use the `vercel.json` file to configure React Router correctly.
6. **Copy your Live Frontend URL**.

### Step 4: Finalize Backend CORS
1. Go back to your Render Dashboard.
2. Update the `FRONTEND_URL` environment variable to match your new Vercel Live Frontend URL.
3. Render will automatically redeploy the backend with the updated CORS policy.

---

## 3. MongoDB Atlas Network Whitelist

1. Go to your MongoDB Atlas dashboard → **Network Access**.
2. Click **Add IP Address**.
3. Add `0.0.0.0/0` to allow connections from any IP (required for Render, which uses dynamic IPs).
4. For tighter security, whitelist Render's specific static outbound IPs if available on your Render plan.

---

## 4. Production Deployment Verification Checklist

Once both services are live, verify the following to ensure a successful deployment:

### Core Functionality
- [ ] **Frontend Loading**: The Vercel URL loads the homepage without errors.
- [ ] **API Health**: Visiting your Render backend URL root shows "✅ API is working fine".
- [ ] **API Communication**: The "Rooms" list populates data from the Render backend.
- [ ] **Routing**: Refreshing a page (e.g., `/rooms`) does not result in a 404 error.

### Authentication
- [ ] **User Registration**: A new user can register successfully.
- [ ] **User Login/Logout**: Login stores the session, logout clears it.
- [ ] **Admin Login**: Admin can log in via `/admin` with configured credentials.

### Booking Flow
- [ ] **Room Details**: Clicking a room loads its details and images.
- [ ] **Availability Check**: Selecting dates and checking availability works.
- [ ] **Booking Creation**: "Book Now" creates a booking and navigates to payment.
- [ ] **Payment Integration**: Razorpay checkout modal opens correctly.
- [ ] **Booking History**: "My Bookings" page shows the user's bookings.

### Admin Dashboard
- [ ] **Dashboard Metrics**: Admin dashboard loads analytics correctly.
- [ ] **Room Management**: Admin can add, edit, and delete rooms.
- [ ] **Booking Management**: Admin can view and manage all bookings.

### Visual & Responsiveness
- [ ] **Image Loading**: Room images load correctly (not broken).
- [ ] **Mobile Responsiveness**: The app renders correctly on mobile screen sizes.
- [ ] **Navigation**: All nav links and the mobile menu work correctly.

---

## 5. Common Deployment Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Frontend shows blank page | `VITE_API_BASE_URL` not set | Add the env var in Vercel dashboard |
| CORS errors in browser console | `FRONTEND_URL` not set on Render | Set `FRONTEND_URL` to your Vercel URL |
| "Database connection error" in Render logs | Wrong `MONGODB_URI` or IP not whitelisted | Verify Atlas connection string and whitelist `0.0.0.0/0` |
| 404 on page refresh (Vercel) | Missing `vercel.json` rewrites | Ensure `frontend/vercel.json` is present with rewrites config |
| "Invalid email or password" on admin login | `ADMIN_EMAIL`/`ADMIN_PASSWORD` not set in Render | Add these env vars in the Render dashboard |
| Razorpay not loading | `VITE_RAZORPAY_KEY_ID` not set | Add it in Vercel env vars |
| Backend crashes on start | Missing dependencies | Run `npm install` locally to regenerate `package-lock.json` |

---

## Live Application Links

*(Update these links once deployed)*

- **Live Frontend URL**: `https://[your-project-name].vercel.app`
- **Live Backend URL**: `https://[your-backend-name].onrender.com`
