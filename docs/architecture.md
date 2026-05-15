# Application Architecture

HOMYSTAY is built using the MERN stack. This document details the high-level architecture and data flows.

## Component Architecture

1. **Frontend Layer (React/Vite)**
   - Responsible for presentation, routing (React Router), and user interactions.
   - Communicates with the backend exclusively via RESTful HTTP requests using Axios.
   - Manages state locally and passes data down via props.

2. **Backend Layer (Express.js)**
   - Exposes RESTful API endpoints.
   - Handles business logic, payment verification, and data validation.
   - Manages Authentication using JWT (JSON Web Tokens).

3. **Database Layer (MongoDB)**
   - Stores application data persistently.
   - Uses Mongoose ODM for schema validation and relationships.

## Database Schema Overview

- **User Collection**: Stores user credentials, roles (admin, owner, user), and profile details.
- **Room Collection**: Stores room details, pricing, amenities, owner references, and availability statuses.
- **Booking Collection**: Stores reservation dates, user references, room references, and payment statuses.

## Authentication Flow

1. User submits credentials to `/api/auth/login`.
2. Backend validates against MongoDB.
3. Backend signs and returns a JWT.
4. Frontend stores the JWT and includes it in the `Authorization` header for subsequent protected requests.
5. Backend middleware verifies the JWT before granting access to protected routes.
