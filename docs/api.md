# 📡 API Reference — HOMYSTAY Backend

> **Base URL (Production):** `https://homystay-backend.onrender.com`  
> **Base URL (Local):** `http://localhost:3000`

---

## 🔐 Authentication

### Register User
```http
POST /users/register
```
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Full name |
| `age` | `number` | ✅ | User age |
| `country` | `string` | ✅ | Country |
| `phoneNumber` | `string` | ✅ | 10-digit phone |
| `email` | `string` | ✅ | Email address |
| `password` | `string` | ✅ | Min 6 characters |

**Response:** `200 OK`
```json
{
  "message": "Registration successful"
}
```

---

### Login User
```http
POST /users/login
```
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | `string` | ✅ | Registered email |
| `password` | `string` | ✅ | Account password |

**Response:** `200 OK`
```json
{
  "_id": "665e4613caddb86fef9c11c0",
  "name": "John Doe",
  "email": "john@gmail.com",
  "role": "user"
}
```

---

### Admin Login
```http
POST /admin/login
```
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | `string` | ✅ | Admin email (from env) |
| `password` | `string` | ✅ | Admin password (from env) |

**Response:** `200 OK` — Returns admin user object

---

## 🏨 Rooms

### Get All Rooms
```http
GET /rooms
```
**Auth:** None  
**Response:** `200 OK` — Array of room objects

---

### Get Room by ID
```http
GET /rooms/:id
```
**Auth:** None  
**Response:** `200 OK` — Single room object with images, amenities, pricing

---

### Create Room
```http
POST /rooms
```
**Auth:** Hotel Owner / Admin  
**Content-Type:** `multipart/form-data`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Room/hotel name |
| `city` | `string` | ✅ | City location |
| `address` | `string` | ✅ | Full address |
| `price` | `number` | ✅ | Price per night (₹) |
| `roomType` | `string` | ✅ | Single Bed / Double Bed / Luxury / Family |
| `maxCount` | `number` | ✅ | Max guest capacity |
| `amenities` | `array` | ✅ | List of amenities |
| `images` | `file[]` | ✅ | Room images (multipart) |

---

### Update Room
```http
PUT /rooms/:id
```
**Auth:** Owner / Admin  
**Body:** Same as Create Room (partial update supported)

---

### Delete Room
```http
DELETE /rooms/:id
```
**Auth:** Owner / Admin  
**Response:** `200 OK`

---

### Check Availability
```http
POST /rooms/check-availability
```
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roomId` | `string` | ✅ | MongoDB Room ID |
| `checkInDate` | `string` | ✅ | ISO date format |
| `checkOutDate` | `string` | ✅ | ISO date format |

**Response:**
```json
{
  "available": true,
  "message": "✅ Room is available for selected dates."
}
```

---

## 📋 Bookings

### Create Booking
```http
POST /bookings
```
**Auth:** Authenticated User

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | `string` | ✅ | User MongoDB ID |
| `hotel` | `object` | ✅ | `{ name, address }` |
| `room` | `object` | ✅ | Room details snapshot |
| `checkInDate` | `string` | ✅ | ISO date |
| `checkOutDate` | `string` | ✅ | ISO date |
| `guests` | `number` | ✅ | Number of guests |
| `totalPrice` | `number` | ✅ | Calculated total |
| `isPaid` | `boolean` | ✅ | Payment status |

---

### Get User Bookings
```http
GET /bookings/user/:userId
```
**Auth:** Authenticated User  
**Response:** `200 OK` — Array of booking objects

---

### Update Booking Status
```http
PUT /bookings/:id
```
**Auth:** Admin  
**Body:** `{ "status": "Cancelled by Admin" }` or `{ "isPaid": true }`

---

### Delete Booking
```http
DELETE /bookings/:id
```
**Auth:** Admin

---

## 💳 Payments

### Create Razorpay Order
```http
POST /razorpay/create-order
```
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | `number` | ✅ | Amount in paise |
| `currency` | `string` | ✅ | `"INR"` |

**Response:**
```json
{
  "id": "order_xxxxx",
  "amount": 220000,
  "currency": "INR"
}
```

---

## 📊 Admin Analytics

### Get Dashboard Metrics
```http
GET /admin/metrics
```
**Auth:** Admin  
**Response:** Platform-wide analytics (total bookings, revenue, occupancy, etc.)

---

## ⚠️ Error Responses

| Status | Description |
|--------|-------------|
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized — Authentication required |
| `404` | Not Found — Resource doesn't exist |
| `500` | Server Error — Internal failure |

```json
{
  "error": "Route not found"
}
```
