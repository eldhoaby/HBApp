<div align="center">

# 🏨 HOMYSTAY

### Modern Full-Stack Hotel Booking Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-00C853?style=for-the-badge)](https://hb-app-eldho.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_API-Live-blue?style=for-the-badge)](https://homystay-backend.onrender.com)

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-3395FF?style=flat-square&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/eldhoaby/HBApp/ci.yml?style=flat-square&label=CI)](https://github.com/eldhoaby/HBApp/actions)
[![Deployment: Ready](https://img.shields.io/badge/Vercel-Deployment_Active-000000?style=flat-square&logo=vercel&logoColor=white)](https://hb-app-eldho.vercel.app)

**A production-grade, full-stack MERN hotel reservation platform with role-based access control, real-time availability tracking, and integrated payment processing.**

[Live Demo](https://hb-app-eldho.vercel.app) · [API Documentation](./docs/api.md) · [Report Bug](https://github.com/eldhoaby/HBApp/issues) · [Request Feature](https://github.com/eldhoaby/HBApp/issues)

</div>

---

## 📸 Application Preview

<div align="center">

### 🏠 Landing Page
<img src="./screenshots/homepage.png" alt="HOMYSTAY Homepage" width="800"/>

### 🛏️ Room Listing & Filters
<img src="./screenshots/rooms-listing.png" alt="Room Listing" width="800"/>

### 🔍 Room Details & Booking
<img src="./screenshots/room-details.png" alt="Room Details" width="800"/>

### 🔐 Authentication
<img src="./screenshots/login-modal.png" alt="Login Modal" width="800"/>

</div>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🏨 For Guests
- 🔍 **Smart Search** — Filter by city, dates, room type, price range
- 📅 **Real-Time Availability** — Conflict-free date-based booking
- 💳 **Secure Payments** — Razorpay integration with order verification
- 📄 **PDF Invoices** — Auto-generated booking confirmations
- 📱 **Responsive UI** — Seamless experience on all devices

</td>
<td width="50%">

### 🏢 For Hotel Owners & Admins
- 📊 **Analytics Dashboard** — Revenue, occupancy, and booking metrics
- 🛏️ **Room Management** — Full CRUD with multi-image uploads
- 👥 **User Management** — View registered users and booking history
- ✅ **Booking Control** — Approve, cancel, and manage reservations
- 🔒 **Role-Based Access** — Secure admin and owner workflows

</td>
</tr>
</table>

---

## 🛡️ Role-Based Access Control

```mermaid
graph LR
    A[👤 Guest] -->|Browse & Book| B[🏨 Rooms]
    C[🏢 Hotel Owner] -->|Manage| B
    C -->|View| D[📊 Dashboard]
    E[👑 Admin] -->|Full Control| B
    E -->|Manage| F[👥 Users]
    E -->|Analytics| D
    
    style A fill:#4CAF50,color:#fff
    style C fill:#FF9800,color:#fff
    style E fill:#F44336,color:#fff
```

| Role | Capabilities |
|------|-------------|
| **Guest** | Browse rooms, search & filter, check availability, book rooms, make payments, view booking history, download invoices |
| **Hotel Owner** | All guest features + add/edit/delete rooms, upload room images, view booking analytics, manage own listings |
| **Administrator** | Full platform control + user management, global analytics, booking management (approve/cancel/delete), system metrics |

---

## 🏗️ System Architecture

### Application Architecture
```mermaid
graph TB
    subgraph Client["🌐 Frontend (Vercel)"]
        React["⚛️ React 19 + Vite"]
        TW["🎨 Tailwind CSS + MUI"]
        Router["🔀 React Router v7"]
    end
    
    subgraph Server["⚙️ Backend (Render)"]
        Express["🚀 Express.js v5"]
        Auth["🔐 JWT Auth"]
        Multer["📁 Multer (Uploads)"]
    end
    
    subgraph Database["💾 Database (MongoDB Atlas)"]
        Users["👥 Users"]
        Rooms["🏨 Rooms"]
        Bookings["📋 Bookings"]
    end
    
    subgraph Payment["💳 Payment Gateway"]
        Razorpay["Razorpay API"]
    end
    
    React --> Express
    Express --> Auth
    Express --> Database
    Express --> Razorpay
    
    style Client fill:#1a1a2e,color:#fff
    style Server fill:#16213e,color:#fff
    style Database fill:#0f3460,color:#fff
    style Payment fill:#533483,color:#fff
```

### Deployment Architecture
```mermaid
graph LR
    User((🧑‍💻 User)) <-->|HTTPS| Vercel["▲ Vercel<br/>React Frontend"]
    Vercel <-->|REST API| Render["🔧 Render<br/>Express Backend"]
    Render <-->|Mongoose| Atlas["🍃 MongoDB Atlas<br/>Cloud Database"]
    Render <-->|Payment API| Razorpay["💳 Razorpay<br/>Payment Gateway"]
    
    style Vercel fill:#000,color:#fff
    style Render fill:#46E3B7,color:#000
    style Atlas fill:#00ED64,color:#000
    style Razorpay fill:#3395FF,color:#fff
```

---

## 💻 Tech Stack

<table>
<tr>
<th align="center">Layer</th>
<th align="center">Technology</th>
<th align="center">Version</th>
<th align="center">Purpose</th>
</tr>
<tr><td><b>Frontend</b></td><td>React</td><td>19.1</td><td>UI Components & SPA</td></tr>
<tr><td></td><td>Vite</td><td>6.3</td><td>Build Tool & Dev Server</td></tr>
<tr><td></td><td>Tailwind CSS</td><td>4.1</td><td>Utility-First Styling</td></tr>
<tr><td></td><td>Material UI</td><td>7.1</td><td>Admin Dashboard Components</td></tr>
<tr><td></td><td>React Router</td><td>7.6</td><td>Client-Side Routing</td></tr>
<tr><td></td><td>Axios</td><td>1.10</td><td>HTTP Client</td></tr>
<tr><td><b>Backend</b></td><td>Node.js</td><td>18+</td><td>Runtime Environment</td></tr>
<tr><td></td><td>Express.js</td><td>5.1</td><td>REST API Framework</td></tr>
<tr><td></td><td>Mongoose</td><td>8.16</td><td>MongoDB ODM</td></tr>
<tr><td></td><td>Multer</td><td>2.0</td><td>File Upload Handling</td></tr>
<tr><td><b>Database</b></td><td>MongoDB Atlas</td><td>—</td><td>Cloud NoSQL Database</td></tr>
<tr><td><b>Payments</b></td><td>Razorpay</td><td>2.9</td><td>Payment Processing</td></tr>
<tr><td><b>DevOps</b></td><td>Vercel</td><td>—</td><td>Frontend Hosting & CDN</td></tr>
<tr><td></td><td>Render</td><td>—</td><td>Backend Hosting</td></tr>
<tr><td></td><td>GitHub Actions</td><td>—</td><td>CI/CD Pipeline</td></tr>
</table>

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local instance or Atlas cluster)
- **Git**
- **Razorpay** test/live API keys

### Installation

```bash
# Clone the repository
git clone https://github.com/eldhoaby/HBApp.git
cd HBApp
```

**Backend Setup:**
```bash
cd backend
npm install

# Create environment file
cp ../.env.example .env
# Edit .env with your credentials (see Environment Variables section)

npm start        # Production
npm run test     # Development with nodemon
```

**Frontend Setup:**
```bash
cd frontend
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:3000" > .env
echo "VITE_RAZORPAY_KEY_ID=your_razorpay_key" >> .env

npm run dev      # Development
npm run build    # Production build
```

### Environment Variables

<details>
<summary><b>📋 Backend Variables</b> (click to expand)</summary>

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | `securepassword` |
| `RAZORPAY_KEY_ID` | Razorpay API Key | `rzp_test_xxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | `your_secret` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

</details>

<details>
<summary><b>📋 Frontend Variables</b> (click to expand)</summary>

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key | `rzp_test_xxxxx` |

</details>

---

## 📂 Project Structure

```
HBApp/
├── 📁 frontend/                # React + Vite Application
│   ├── 📁 public/              # Static assets & favicon
│   ├── 📁 src/
│   │   ├── 📁 assets/          # Images, icons, SVGs
│   │   ├── 📁 components/      # Reusable UI components
│   │   │   ├── 📁 hotelOwner/  # Admin dashboard components
│   │   │   ├── Hero.jsx        # Landing page hero
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Login.jsx       # Auth modal
│   │   │   └── Register.jsx    # Registration modal
│   │   ├── 📁 pages/           # Route-level pages
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── AllRooms.jsx    # Room listing + filters
│   │   │   ├── RoomDetails.jsx # Room detail + booking
│   │   │   ├── Payment.jsx     # Payment processing
│   │   │   └── MyBookings.jsx  # User booking history
│   │   ├── App.jsx             # Root layout & routing
│   │   └── main.jsx            # React DOM entry
│   ├── vercel.json             # Vercel SPA rewrites
│   └── package.json
├── 📁 backend/                 # Express.js API Server
│   ├── 📁 configs/             # Database configuration
│   ├── 📁 models/              # Mongoose schemas
│   │   ├── user.js             # User model
│   │   ├── room.js             # Room model
│   │   └── booking.js          # Booking model
│   ├── 📁 routes/              # API route handlers
│   │   ├── auth.js             # Authentication routes
│   │   ├── rooms.js            # Room CRUD routes
│   │   ├── bookings.js         # Booking routes
│   │   ├── admin.js            # Admin routes
│   │   ├── payment.js          # Stripe payment routes
│   │   └── razorpay.js         # Razorpay payment routes
│   ├── server.js               # Express entry point
│   └── package.json
├── 📁 docs/                    # Technical documentation
├── 📁 screenshots/             # Application screenshots
├── 📁 .github/                 # CI/CD & GitHub templates
│   ├── 📁 workflows/
│   │   └── ci.yml              # GitHub Actions pipeline
│   ├── ISSUE_TEMPLATE.md
│   └── PULL_REQUEST_TEMPLATE.md
├── .env.example                # Environment template
├── .gitignore                  # Git exclusion rules
├── CHANGELOG.md                # Version history
├── CODE_OF_CONDUCT.md          # Community guidelines
├── CONTRIBUTING.md             # Contribution guide
├── LICENSE                     # MIT License
├── README.md                   # ← You are here
├── SECURITY.md                 # Security policy
└── render.yaml                 # Render deployment blueprint
```

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/users/register` | Register a new user | Public |
| `POST` | `/users/login` | Authenticate user | Public |
| `GET` | `/rooms` | Fetch all rooms | Public |
| `GET` | `/rooms/:id` | Fetch room by ID | Public |
| `POST` | `/rooms` | Create a room | Owner |
| `PUT` | `/rooms/:id` | Update a room | Owner |
| `DELETE` | `/rooms/:id` | Delete a room | Owner |
| `POST` | `/rooms/check-availability` | Check room availability | Public |
| `POST` | `/bookings` | Create a booking | User |
| `GET` | `/bookings/user/:id` | Get user bookings | User |
| `PUT` | `/bookings/:id` | Update booking status | Admin |
| `DELETE` | `/bookings/:id` | Delete a booking | Admin |
| `POST` | `/admin/login` | Admin authentication | Admin |
| `GET` | `/admin/metrics` | Platform analytics | Admin |
| `POST` | `/razorpay/create-order` | Create payment order | User |

> 📖 Full API documentation: [docs/api.md](./docs/api.md)

---

## 🚀 Deployment

The application is deployed on a modern cloud infrastructure:

| Component | Platform | URL |
|-----------|----------|-----|
| **Frontend** | Vercel | [hb-app-eldho.vercel.app](https://hb-app-eldho.vercel.app) |
| **Backend** | Render | [homystay-backend.onrender.com](https://homystay-backend.onrender.com) |
| **Database** | MongoDB Atlas | Private cluster |

> 📖 Full deployment guide: [docs/deployment_setup.md](./docs/deployment_setup.md)

---

## 🗺️ Roadmap

- [ ] 🔑 OAuth2 (Google / GitHub) authentication
- [ ] 💬 Real-time chat (Socket.io) between guests & owners
- [ ] 🗺️ Mapbox integration for geographical hotel search
- [ ] 🌍 Multi-language (i18n) support
- [ ] ⚡ Redis caching for faster queries
- [ ] 📧 Email notifications (booking confirmations, reminders)
- [ ] ⭐ Guest review & rating system
- [ ] 📱 Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions make the open-source community thrive! See our [Contributing Guidelines](./CONTRIBUTING.md) for details.

```bash
# Fork → Clone → Branch → Code → Push → PR
git checkout -b feature/amazing-feature
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) — UI Library
- [Express.js](https://expressjs.com/) — Backend Framework
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud Database
- [Razorpay](https://razorpay.com/) — Payment Gateway
- [Vercel](https://vercel.com/) — Frontend Hosting
- [Render](https://render.com/) — Backend Hosting
- [Tailwind CSS](https://tailwindcss.com/) — Styling Framework

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Eldho](https://github.com/eldhoaby)

</div>
