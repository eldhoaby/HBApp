# Contributing to HOMYSTAY

First off, thank you for considering contributing to Homystay! It's people like you that make the open-source community such a fantastic place to learn, inspire, and create.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   `git clone https://github.com/your-username/homystay.git`
3. **Create a new branch** for your feature or bugfix:
   `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-bug-fix`

## Development Workflow

1. Ensure you have the proper environment variables configured (see `.env.example`).
2. Start the backend: `cd backend && npm install && npm start`
3. Start the frontend: `cd frontend && npm install && npm run dev`
4. Make your changes in your isolated branch.
5. **Test your changes** thoroughly. Ensure existing workflows are not broken.

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries

**Example:** `feat: add Google OAuth authentication`

## Pull Request Process

1. Push your changes to your fork: `git push origin feature/your-feature-name`
2. Open a Pull Request against the `main` branch of the upstream repository.
3. Provide a detailed description of the changes you've made.
4. Request a review from the maintainers.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.
