# 🏗️ Architecture Documentation — HOMYSTAY

## Overview

HOMYSTAY is built on the **MERN** stack (MongoDB, Express.js, React, Node.js) following a client-server architecture where the frontend and backend are independently deployed and communicate over REST APIs.

---

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["🌐 Browser"]
        React["⚛️ React 19 (Vite)"]
        Router["React Router v7"]
        Axios["Axios HTTP Client"]
    end
    
    subgraph "API Layer"
        Express["🚀 Express.js v5"]
        CORS["CORS Middleware"]
        JSON["JSON Parser"]
        Multer["Multer (File Uploads)"]
    end
    
    subgraph "Business Logic"
        AuthRoutes["🔐 Auth Routes"]
        RoomRoutes["🏨 Room Routes"]
        BookingRoutes["📋 Booking Routes"]
        PaymentRoutes["💳 Payment Routes"]
        AdminRoutes["👑 Admin Routes"]
    end
    
    subgraph "Data Layer"
        Mongoose["Mongoose ODM"]
        UserModel["👤 User Model"]
        RoomModel["🛏️ Room Model"]
        BookingModel["📝 Booking Model"]
    end
    
    subgraph "External Services"
        MongoDB["🍃 MongoDB Atlas"]
        Razorpay["💳 Razorpay API"]
    end
    
    Browser --> React
    React --> Router
    React --> Axios
    Axios --> Express
    Express --> CORS
    Express --> JSON
    Express --> Multer
    Express --> AuthRoutes
    Express --> RoomRoutes
    Express --> BookingRoutes
    Express --> PaymentRoutes
    Express --> AdminRoutes
    AuthRoutes --> Mongoose
    RoomRoutes --> Mongoose
    BookingRoutes --> Mongoose
    PaymentRoutes --> Razorpay
    AdminRoutes --> Mongoose
    Mongoose --> UserModel
    Mongoose --> RoomModel
    Mongoose --> BookingModel
    UserModel --> MongoDB
    RoomModel --> MongoDB
    BookingModel --> MongoDB
```

---

## Database Schema

### User Collection
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name |
| `age` | Number | User age |
| `country` | String | Country |
| `phoneNumber` | String | 10-digit phone |
| `email` | String | Unique, required |
| `password` | String | Hashed password |
| `role` | String | `user` (default) |

### Room Collection
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Room/hotel name |
| `city` | String | City location |
| `address` | String | Full address |
| `price` | Number | Price per night (₹) |
| `roomType` | String | Bed type category |
| `maxCount` | Number | Max occupancy |
| `amenities` | [String] | WiFi, Pool, etc. |
| `images` | [String] | Image URLs |
| `phoneNumber` | String | Contact number |
| `rating` | Number | Average rating |
| `reviewsCount` | Number | Review count |

### Booking Collection
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to User |
| `hotel` | Object | `{ name, address }` |
| `room` | Object | Room details snapshot |
| `checkInDate` | Date | Check-in date |
| `checkOutDate` | Date | Check-out date |
| `guests` | Number | Number of guests |
| `totalPrice` | Number | Calculated total |
| `isPaid` | Boolean | Payment status |
| `status` | String | Booking status |
| `name` | String | Guest name |
| `email` | String | Guest email |

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as MongoDB Atlas

    U->>F: Enter credentials
    F->>B: POST /users/login
    B->>DB: Find user by email
    DB-->>B: User document
    B->>B: Validate password
    B-->>F: User object + role
    F->>F: Store in localStorage
    F->>F: Redirect based on role
    
    Note over F: role=user → /rooms
    Note over F: role=admin → /admin/dashboard
```

---

## Booking & Payment Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant R as Razorpay
    participant DB as MongoDB

    U->>F: Select dates & guests
    F->>B: POST /rooms/check-availability
    B->>DB: Check for date conflicts
    DB-->>B: Availability result
    B-->>F: { available: true/false }
    
    U->>F: Click "Book Now"
    F->>B: POST /bookings
    B->>DB: Create booking (isPaid: false)
    DB-->>B: Booking created
    B-->>F: Booking object
    F->>F: Navigate to /payment
    
    F->>B: POST /razorpay/create-order
    B->>R: Create order
    R-->>B: Order ID
    B-->>F: Order details
    F->>R: Open Razorpay checkout
    R-->>F: Payment success
    F->>B: PUT /bookings/:id (isPaid: true)
    B->>DB: Update booking status
```

---

## Deployment Architecture

```mermaid
graph LR
    subgraph "CDN & Frontend"
        Vercel["▲ Vercel<br/>React + Vite<br/>hb-app-eldho.vercel.app"]
    end
    
    subgraph "Backend Services"
        Render["🔧 Render<br/>Express.js<br/>homystay-backend.onrender.com"]
    end
    
    subgraph "Data & Payments"
        Atlas["🍃 MongoDB Atlas<br/>Shared Cluster"]
        RP["💳 Razorpay<br/>Payment API"]
    end
    
    User((👤 User)) <-->|HTTPS| Vercel
    Vercel <-->|REST API<br/>CORS Protected| Render
    Render <-->|Mongoose<br/>TLS/SSL| Atlas
    Render <-->|Server-side| RP
```
