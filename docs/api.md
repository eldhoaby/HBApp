# REST API Reference

This document outlines the standard REST API endpoints available in the HOMYSTAY backend.

> **Note:** All protected routes require a valid JWT token passed in the `Authorization` header as a Bearer token.
> `Authorization: Bearer <your_jwt_token>`

## Authentication Routes (`/api/auth`)

### `POST /api/auth/register`
Registers a new user.
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "securepassword", "role": "user" }`
- **Returns**: JWT Token and user data.

### `POST /api/auth/login`
Authenticates a user.
- **Body**: `{ "email": "john@example.com", "password": "securepassword" }`
- **Returns**: JWT Token and user data.

## Room Management Routes (`/api/rooms`)

### `GET /api/rooms`
Fetches all available rooms.
- **Query Params**: `?location=x&minPrice=y` (Optional)
- **Returns**: Array of room objects.

### `GET /api/rooms/:id`
Fetches details of a specific room.
- **Returns**: Room object.

### `POST /api/rooms`
Creates a new room. (Requires Owner/Admin authentication)
- **Body**: FormData containing room details and images.
- **Returns**: Created room object.

## Booking Routes (`/api/bookings`)

### `POST /api/bookings`
Creates a new reservation. (Requires Authentication)
- **Body**: `{ "roomId": "id", "checkIn": "date", "checkOut": "date", "paymentInfo": {} }`
- **Returns**: Confirmation details and booking ID.

### `GET /api/bookings/my-bookings`
Fetches bookings for the authenticated user.
- **Returns**: Array of booking objects.
