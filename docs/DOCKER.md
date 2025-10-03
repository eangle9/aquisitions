# Docker & Compose setup for Aquisitions API with Neon

This repository includes a complete Docker setup for running the Express API with Neon in two modes:

- Development: Runs the app alongside the Neon Local proxy (ephemeral branches).
- Production: Runs the app connecting to your Neon Cloud database (no Neon Local proxy).

## Files added

- Dockerfile (multi-stage: `dev` and `prod`)
- docker-compose.dev.yml (app + Neon Local)
- docker-compose.prod.yml (app only)
- .env.development and .env.production templates
- .dockerignore

## Prerequisites

- Docker and Docker Compose installed
- A Neon project, API key, and a parent branch ID (for ephemeral branches)

## Development

Neon Local creates an ephemeral branch when the container starts and deletes it when the container stops. Your app connects to the local Postgres interface at `neon-local:5432` inside the compose network.

1) Fill out `.env.development` with your Neon credentials:

- NEON_API_KEY
- NEON_PROJECT_ID
- NEON_PARENT_BRANCH_ID (the parent branch to clone)
- Optionally set `NEON_DATABASE` (defaults to `neondb` in the compose fallback)

2) Start the stack:

```bash
# build app image and start Neon Local + app
docker compose -f docker-compose.dev.yml up --build
```

3) The API is available at http://localhost:3000 and the Neon Local proxy at localhost:5432 (optional host exposure).

### Important for @neondatabase/serverless in dev

This project currently uses the Neon serverless HTTP driver. When using Neon Local, configure the driver to use HTTP to the local proxy and disable websockets. Add this snippet to `src/config/database.js` (development-only):

```js path=null start=null
import { neon, neonConfig } from '@neondatabase/serverless';

if (process.env.NODE_ENV === 'development') {
  // Route the serverless driver over HTTP to the Neon Local proxy
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}
```

Then keep `DATABASE_URL` pointing to the local proxy (already configured in `.env.development`):

```bash
DATABASE_URL=postgres://neon:npg@neon-local:5432/${NEON_DATABASE}?sslmode=require
```

Alternatively, you can switch to the standard Postgres driver in development. Neon Local supports both drivers simultaneously.

### Ephemeral branches

Using `PARENT_BRANCH_ID` in the `neon-local` service config instructs Neon Local to create an ephemeral branch from that parent on startup and delete it on shutdown.

If you want to persist branches per Git branch, set `DELETE_BRANCH=false` and mount the recommended volumes, per Neon docs:

```yaml path=null start=null
services:
  neon-local:
    volumes:
      - ./.neon_local/:/tmp/.neon_local
      - ./.git/HEAD:/tmp/.git/HEAD:ro,consistent
    environment:
      DELETE_BRANCH: "false"
```

Be sure to add `.neon_local/` to `.gitignore`.

## Production

No Neon Local proxy is used. Provide your Neon Cloud `DATABASE_URL` via environment variables or secrets. The production compose runs only the app container.

1) Put placeholders in `.env.production` (or configure via your platform’s secret manager):

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require
JWT_SECRET=<your_jwt_secret>
```

2) Start locally for testing:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Your app will be available at http://localhost:3000 and connect to Neon Cloud.

## Switching environments

- Development: `docker compose -f docker-compose.dev.yml up --build`
- Production: `docker compose -f docker-compose.prod.yml up --build`

Each compose file injects a different `env_file` so `DATABASE_URL` switches automatically.

## Notes

- Do not commit real secrets. The `.env.*` files here contain placeholders.
- The app imports `dotenv/config` which reads a `.env` file if present inside the container. We do not COPY any `.env` into the image, and Compose injects env vars at runtime via `env_file`, which take precedence.
- If you expose port 5432 on the host in dev, you can connect local tools (psql, GUI) to `localhost:5432`.
- Health checks: the app has `/health`; you can enhance Compose with a healthcheck for the app if desired.