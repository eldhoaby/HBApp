# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | ✅ Actively supported |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in HOMYSTAY, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities.
2. Email your findings to the maintainer directly.
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment** within 48 hours of your report.
- **Assessment** of the vulnerability within 1 week.
- **Fix & Disclosure** — We will work on a fix and coordinate disclosure.

### Security Best Practices in This Project

- All credentials are stored in environment variables, never hardcoded
- `.env` files are excluded from version control via `.gitignore`
- CORS is restricted to the production frontend domain
- Admin authentication uses server-side credential validation
- Payment processing is handled server-side through Razorpay's secure API
- MongoDB Atlas connections use TLS/SSL encryption

## Scope

The following are **in scope** for security reports:
- Authentication bypass
- Data exposure or leakage
- Injection attacks (SQL, NoSQL, XSS, CSRF)
- Insecure API endpoints
- Payment flow vulnerabilities

The following are **out of scope**:
- Denial of service attacks
- Social engineering
- Issues in third-party dependencies (report those upstream)
