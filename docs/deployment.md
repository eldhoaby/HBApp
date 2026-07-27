# Deployment Guide

This guide provides step-by-step instructions for deploying the HOMYSTAY application to production.

## 1. Database (MongoDB Atlas)

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster (the free tier is sufficient for testing).
3. Under **Database Access**, create a new database user with a secure password.
4. Under **Network Access**, add the IP address `0.0.0.0/0` to allow connections from your deployed backend (or restrict it to your backend's static IP if available).
5. Click **Connect** on your cluster, choose "Connect your application", and copy the connection string. Replace `<username>` and `<password>` with your database user credentials.

## 2. Backend (Render / Railway)

### Using Render
1. Create an account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following details:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Expand **Advanced** and click **Add Environment Variable**. Add all variables from your `.env.example` file (e.g., `MONGO_URI`, `JWT_SECRET`, Payment keys).
6. Click **Create Web Service**. Once deployed, copy the Render URL provided.

## 3. Frontend (Vercel)

### Using Vercel
1. Create an account on [Vercel](https://vercel.com/) and connect your GitHub.
2. Click **Add New** -> **Project**.
3. Import your HOMYSTAY repository.
4. Set the **Framework Preset** to `Vite`.
5. Set the **Root Directory** to `frontend`.
6. Expand **Environment Variables** and add your frontend keys (e.g., `VITE_API_BASE_URL` pointing to your deployed Render backend URL, `VITE_STRIPE_PUBLIC_KEY`).
7. Click **Deploy**.

## 4. Post-Deployment Verification

1. Visit your Vercel URL.
2. Attempt to register a new user to verify Database connectivity.
3. Attempt to add a room and initiate a mock checkout to verify Payment Gateway integrations.
