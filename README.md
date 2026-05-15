<div align="center">
  <img src="./frontend/public/favicon.svg" alt="HOMYSTAY Logo" width="100"/>
  <h1>HOMYSTAY - Modern MERN Hotel Booking Platform</h1>
  <p>A highly scalable, production-ready full-stack hotel reservation system.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
</div>

---

## 📖 Project Overview

**HOMYSTAY** is a comprehensive, full-stack MERN (MongoDB, Express, React, Node.js) hotel booking and management application. It provides a seamless reservation experience for guests, intuitive room management for hotel owners, and powerful oversight capabilities for platform administrators.

Built with modern web standards, it features secure authentication, real-time availability tracking, payment gateway integration, and a highly responsive, polished UI.

## 🚀 Live Demo
> **[View Live Application](#)** | **[View API Documentation](#)**  
*(Replace with actual deployment links)*

---

## ✨ Key Features

- **Advanced Search & Filtering**: Discover rooms by location, dates, and amenities.
- **Real-Time Availability**: Conflict-free booking engine.
- **Secure Payments**: Integrated with Razorpay & Stripe for seamless checkouts.
- **Responsive UI/UX**: Crafted with React, Vite, and Tailwind CSS.
- **PDF Invoices**: Automated invoice generation for confirmed bookings.

## 🛡️ Role-Based Access Control

The platform implements robust RBAC to ensure security and logical separation of concerns:

- **Users (Guests)**: Can browse rooms, make bookings, view booking history, and manage their profiles.
- **Hotel Owners**: Access a dedicated dashboard to add, edit, and delete their own properties/rooms, and view their respective booking analytics.
- **Administrators**: Possess platform-wide oversight, user management capabilities, and global analytics.

---

## 🏗️ System Architecture

### Application Architecture

```mermaid
graph TD
    Client[Web Client (React + Vite)]
    API[Express.js REST API]
    Auth[JWT Authentication]
    DB[(MongoDB Atlas)]
    PaymentGateway[Stripe / Razorpay]
    
    Client -- HTTP Requests --> API
    API -- Token Validation --> Auth
    API -- Read/Write --> DB
    API -- Checkout --> PaymentGateway
```

### Deployment Architecture

```mermaid
graph LR
    User((User))
    Vercel[Vercel (React Frontend)]
    Render[Render/Railway (Node Backend)]
    MongoDB[(MongoDB Atlas)]
    
    User <--> Vercel
    Vercel <--> Render
    Render <--> MongoDB
```

---

## 💻 Tech Stack

**Frontend:**
- React 19 (Vite)
- Tailwind CSS v4
- Material UI & Emotion
- React Router DOM v7
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) Authentication
- Multer (File Handling)
- Stripe / Razorpay (Payments)

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas cluster)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/homystay.git
cd homystay
```

### 2. Environment Variables
Copy the `.env.example` file and configure your credentials.

```bash
cp .env.example .env
```
Ensure you set your `MONGO_URI`, `JWT_SECRET`, and Payment Keys correctly.

### 3. Backend Setup
```bash
cd backend
npm install
npm run start # or npm run test for nodemon
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 📂 Folder Structure

```text
homystay/
├── backend/                  # Express API Server
│   ├── configs/              # DB & Gateway configurations
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── server.js             # Entry point
│   └── package.json
├── frontend/                 # React UI Application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI elements
│   │   ├── pages/            # Page-level components
│   │   ├── App.jsx           # Root layout and routing
│   │   └── main.jsx          # React DOM render
│   ├── index.html
│   └── package.json
├── docs/                     # Detailed architectural & API documentation
├── screenshots/              # Application preview images
└── .github/workflows/        # CI/CD Pipelines
```

---

## 📡 API Overview

| Method | Endpoint              | Description                      | Auth Required |
|--------|-----------------------|----------------------------------|---------------|
| POST   | `/api/auth/register`  | Register a new user              | No            |
| POST   | `/api/auth/login`     | Authenticate & get JWT           | No            |
| GET    | `/api/rooms`          | Fetch all available rooms        | No            |
| POST   | `/api/rooms`          | Create a new room                | Yes (Owner)   |
| POST   | `/api/bookings`       | Create a new reservation         | Yes (User)    |

*For the complete API documentation, refer to [docs/api.md](./docs/api.md).*

---

## 📸 Screenshots

*(Add screenshots of your application here)*

| Home Page | Admin Dashboard |
|-----------|-----------------|
| <img src="./screenshots/placeholder-1.png" width="400" /> | <img src="./screenshots/placeholder-2.png" width="400" /> |

---

## 🗺️ Feature Roadmap

- [ ] Add OAuth (Google/GitHub) Integration.
- [ ] Implement Redis caching for faster room queries.
- [ ] Real-time chat between Guests and Owners using Socket.io.
- [ ] Multi-language (i18n) support.
- [ ] Mapbox integration for geographical hotel searching.

---

## 🚢 Deployment Instructions

Detailed deployment instructions for Vercel, Render, and MongoDB Atlas can be found in our [Deployment Guide](./docs/deployment.md).

---

## 🤝 Contributing

We welcome contributions to HOMYSTAY! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, or request features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
