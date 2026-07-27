# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-15

### Added
- Professional README with architecture diagrams, badges, and live demo links
- Comprehensive API documentation (`docs/api.md`)
- Architecture documentation with Mermaid sequence diagrams (`docs/architecture.md`)
- Deployment guide with troubleshooting table (`docs/deployment_setup.md`)
- `SECURITY.md` — Responsible vulnerability disclosure policy
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1
- GitHub Issue Template for standardized bug reports
- GitHub Pull Request Template for consistent contributions
- `render.yaml` — Render deployment blueprint
- `frontend/vercel.json` — SPA rewrite rules for React Router
- `.env.example` — Annotated environment variable template
- Live application screenshots in `screenshots/`
- GitHub Actions CI pipeline (`.github/workflows/ci.yml`)

### Changed
- `backend/server.js` — CORS now reads from `FRONTEND_URL` environment variable (backward compatible with localhost fallback)
- API base URLs in frontend components now use `VITE_API_BASE_URL` environment variable (backward compatible with localhost fallback)

### Fixed
- `backend/models/User.js` → `user.js` — Resolved Linux case-sensitivity deployment crash on Render

### Security
- Removed tracked `.env` files from Git history
- Added `.env` and `.env.*` patterns to `.gitignore`

## [1.0.0] - 2026-05-14

### Added
- **Authentication**: User registration and login with role-based access (User, Admin)
- **Room Management**: Full CRUD operations with multi-image uploads via Multer
- **Booking System**: Date-based availability checking with conflict prevention
- **Payment Integration**: Razorpay payment gateway with order creation and verification
- **Admin Dashboard**: Platform analytics, booking management, user oversight
- **Hotel Owner Dashboard**: Room management, booking analytics, revenue tracking
- **Search & Filters**: Filter rooms by city, room type, price range, and sort options
- **PDF Invoices**: Auto-generated booking confirmation downloads via html2pdf.js
- **Responsive UI**: Mobile-first design with Tailwind CSS and Material UI
- **MongoDB Atlas**: Cloud database with Mongoose ODM schemas
