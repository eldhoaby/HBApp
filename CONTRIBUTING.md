# Contributing to HOMYSTAY

First off, thank you for considering contributing to HOMYSTAY! 🎉 Every contribution matters and helps make this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/HBApp.git
   cd HBApp
   ```
3. **Set up** both frontend and backend (see [README.md](./README.md#-getting-started))
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Backend Development
```bash
cd backend
npm install
npm run test    # Starts with nodemon (auto-reload)
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev     # Starts Vite dev server
```

### Before Submitting
- [ ] Test your changes thoroughly
- [ ] Ensure no existing functionality is broken
- [ ] Run `npm run build` in `frontend/` to verify production build
- [ ] Update documentation if your changes affect the API or user flows

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat:` | New feature | `feat: add room review system` |
| `fix:` | Bug fix | `fix: resolve booking date overlap` |
| `docs:` | Documentation | `docs: update API reference` |
| `style:` | Formatting only | `style: fix indentation in Navbar` |
| `refactor:` | Code restructure | `refactor: extract auth middleware` |
| `test:` | Adding tests | `test: add booking validation tests` |
| `chore:` | Maintenance | `chore: update dependencies` |
| `perf:` | Performance | `perf: optimize room query with indexing` |

**Examples:**
```
feat: add Google OAuth authentication
fix: resolve CORS error on production deployment
docs: add deployment troubleshooting guide
style: improve login modal spacing
```

## Pull Request Process

1. **Push** your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Open a Pull Request** against the `master` branch
3. **Fill in** the PR template completely
4. **Wait for review** — maintainers will review your PR
5. **Address feedback** if any changes are requested
6. **Merge!** 🎉 Once approved, your PR will be merged

## Reporting Bugs

Use the [Bug Report Template](https://github.com/eldhoaby/HBApp/issues/new) to report issues. Include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS details

## Suggesting Features

Open a GitHub issue with the title prefix `[FEATURE]` and describe:
- The problem your feature solves
- Your proposed solution
- Any alternatives you've considered

---

**Thank you for contributing!** ⭐ Every star, issue, and PR helps this project grow.
