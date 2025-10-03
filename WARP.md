# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an **Acquisitions API** built with Express.js and Node.js, featuring a modern security-first architecture with Neon PostgreSQL database integration. The project uses ES modules throughout and follows a clean, layered architecture pattern.

## Development Commands

### Core Development

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run all tests
npm test

# Run specific test file (use Jest patterns)
NODE_OPTIONS=--experimental-vm-modules jest tests/app.test.js
```

### Code Quality

```bash
# Lint code
npm run lint

# Lint and fix automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Database Operations (Drizzle ORM)

```bash
# Generate database migrations
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio for database management
npm run db:studio
```

### Docker Environments

```bash
# Development with Neon Local (ephemeral branches)
npm run dev:docker
# OR manually: sh ./scripts/dev.sh

# Production mode with Neon Cloud
npm run prod:docker
# OR manually: sh ./scripts/prod.sh

# Direct Docker commands
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.prod.yml up --build
```

## Architecture

### High-Level Structure

The application follows a **layered architecture** with clear separation of concerns:

- **Entry Point**: `src/index.js` → loads environment and starts server
- **Application Setup**: `src/app.js` → Express app configuration, middleware, routes
- **Server**: `src/server.js` → HTTP server startup
- **Database**: Uses **Neon PostgreSQL** with **Drizzle ORM** for schema management

### Key Architectural Components

**Path Aliases**: The project uses import maps for clean imports:

- `#src/*` → `./src/*`
- `#config/*` → `./src/config/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

**Security Layer**: The application implements multiple security measures:

- **Arcjet Integration**: Advanced security with bot detection, rate limiting, and shield protection
- **Role-based Rate Limiting**: Different limits for admin (20/min), user (10/min), guest (5/min)
- **Standard Security**: Helmet, CORS, cookie parsing, request logging with Winston

**Database Architecture**:

- **Neon Database**: Serverless PostgreSQL with branch-based development
- **Drizzle ORM**: Type-safe SQL toolkit with schema-first approach
- **Development**: Uses Neon Local proxy for ephemeral database branches
- **Production**: Direct connection to Neon Cloud database

### Directory Structure

```
src/
├── config/          # Database, logger, security configs
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, security)
├── models/          # Database schemas (Drizzle)
├── routes/          # Express route definitions
├── services/        # Business logic layer
├── utils/           # Helper functions (JWT, cookies, formatting)
└── validations/     # Input validation schemas (Zod)
```

## Environment Configuration

The project uses **dual-environment setup**:

**Development** (`.env.development`):

- Uses Neon Local proxy at `neon-local:5432`
- Requires `NEON_API_KEY`, `NEON_PROJECT_ID`, `NEON_PARENT_BRANCH_ID`
- Database URL: `postgres://neon:npg@neon-local:5432/${NEON_DATABASE}`

**Production** (`.env.production`):

- Direct Neon Cloud connection
- Requires production `DATABASE_URL` with full Neon connection string

**Key Environment Variables**:

- `DATABASE_URL` - Database connection string
- `ARCJET_KEY` - Security middleware API key
- `JWT_SECRET` - JSON Web Token signing secret
- `NODE_ENV` - Environment identifier (development/production)

## Database Development

The project uses **Drizzle ORM** with PostgreSQL:

**Schema Location**: `src/models/` (e.g., `user.model.js`)
**Migration Workflow**:

1. Modify schema files in `src/models/`
2. Generate migrations: `npm run db:generate`
3. Apply migrations: `npm run db:migrate`
4. Use Drizzle Studio for inspection: `npm run db:studio`

**Development Database**: Neon Local creates ephemeral branches automatically on container startup and cleanup on shutdown.

## Security Implementation

The application integrates **Arcjet** for comprehensive security:

- **Bot Detection**: Blocks automated requests (allows search engines and previews)
- **Rate Limiting**: Sliding window approach with role-based limits
- **Shield Protection**: Advanced request filtering
- **Logging**: Security events logged via Winston

Rate limiting is dynamically applied based on user role from JWT tokens, with fallback to guest limits for unauthenticated requests.

## Testing Strategy

**Framework**: Jest with ES module support
**Configuration**: `jest.config.mjs` with Node environment
**Test Location**: `tests/` directory
**Coverage**: Enabled by default, output to `coverage/`

**Running Tests**:

```bash
# All tests
npm test

# Specific test file
NODE_OPTIONS=--experimental-vm-modules jest tests/app.test.js

# With coverage
npm test -- --coverage
```

## Docker Architecture

**Multi-stage Dockerfile**:

- `development` target: includes dev dependencies, runs `npm run dev`
- `production` target: production dependencies only, runs `npm start`

**Development Environment** (`docker-compose.dev.yml`):

- Neon Local proxy service with ephemeral branches
- Application with hot reload (source mounted as volumes)
- Health checks for both services

**Production Environment** (`docker-compose.prod.yml`):

- Single application container
- Resource limits and restart policies
- Direct Neon Cloud connection

## Code Standards

**Linting**: ESLint with recommended rules plus custom standards:

- 2-space indentation
- Single quotes
- Semicolons required
- Unix line endings
- No unused variables (except `_` prefix)

**Formatting**: Prettier integration via ESLint plugin

**Module System**: ES modules throughout (`"type": "module"` in package.json)
