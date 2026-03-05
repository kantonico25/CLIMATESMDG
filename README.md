# CliMates Madagascar Headless CMS Setup

This repo contains a production-ready headless CMS architecture:

- **Strapi 5 (self-hosted)** → `cms`
- **Node.js + TypeScript BFF** → `apps/bff`
- **React + TypeScript frontend (Vite)** → `apps/web`
- **Postgres**
- **Docker Compose** for local + VPS
- **Nginx reverse proxy + Let’s Encrypt** on VPS

## Architecture

- `https://cms.example.com` → Strapi
- `https://api.example.com` → Node BFF (public API)
- `https://example.com` → React app (static)

The React app **never talks directly to Strapi** in production. It calls the BFF instead.

---

## Local development (Docker)

1. Copy envs:
   - `cms/.env.example` → `cms/.env`
   - `apps/bff/.env.example` → `apps/bff/.env`
   - `apps/web/.env.example` → `apps/web/.env`
2. Start the dev stack:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```
3. URLs:
   - Strapi: `http://localhost:1337/admin`
   - BFF: `http://localhost:4000/health`
   - Web: `http://localhost:5173`
   - MailHog: `http://localhost:8025` (SMTP on `localhost:1025`)

Strapi 5 requires a supported LTS Node version (currently 20/22/24) if you run it outside Docker.

## Local development (Docker run, no compose)

1. Create a network and volumes:
   ```bash
   docker network create climates-net
   docker volume create climates_pgdata
   docker volume create climates_strapi_uploads
   ```
2. Run Postgres:
   ```bash
   docker run -d --name climates-postgres --network climates-net \
     -e POSTGRES_DB=climates -e POSTGRES_USER=climates -e POSTGRES_PASSWORD=climates \
     -v climates_pgdata:/var/lib/postgresql/data -p 5432:5432 postgres:16
   ```
3. Run MailHog (local email capture):
   ```bash
   docker run -d --name climates-mailhog --network climates-net \
     -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```
4. Build and run Strapi:
   ```bash
   docker build -t climates-strapi ./cms
   docker run -d --name climates-strapi --network climates-net \
     --env-file cms/.env -p 1337:1337 \
     -v climates_strapi_uploads:/srv/app/public/uploads \
     climates-strapi
   ```
   Make sure `DATABASE_HOST` in `cms/.env` points to `climates-postgres`.
5. Build and run the BFF:
   ```bash
   docker build -t climates-bff ./apps/bff
   docker run -d --name climates-bff --network climates-net \
     --env-file apps/bff/.env -p 4000:4000 \
     -e STRAPI_URL=http://climates-strapi:1337 \
     climates-bff
   ```
6. Run the web app in a container (dev server):
   ```bash
   docker run --rm -it --name climates-web --network climates-net \
     -p 5173:5173 -e VITE_API_BASE_URL=http://localhost:4000 \
     -v ${PWD}/apps/web:/app -w /app node:20-alpine \
     sh -c "npm install && npm run dev -- --host 0.0.0.0 --port 5173"
   ```
7. URLs:
   - Strapi: `http://localhost:1337/admin`
   - BFF: `http://localhost:4000/health`
   - Web: `http://localhost:5173`
   - MailHog: `http://localhost:8025`

---

## VPS deployment (Docker + Nginx + HTTPS)

1. Copy `.env.docker.example` to `.env` and fill secrets.
2. Update domains in `docker/nginx/conf.d/site.conf`.
3. Build and run:
   ```bash
   docker compose up -d --build
   ```
4. Request certificates (first time only):
   ```bash
   docker compose run --rm certbot certonly \
     --webroot -w /var/www/certbot \
     -d example.com -d www.example.com -d api.example.com -d cms.example.com \
     --email you@example.com --agree-tos --no-eff-email
   ```
5. Restart nginx:
   ```bash
   docker compose restart nginx
   ```

### VPS deployment (Docker run, no compose)

1. Create a network and volumes:
   ```bash
   docker network create climates-net
   docker volume create climates_pgdata
   docker volume create climates_strapi_uploads
   docker volume create climates_certbot_etc
   docker volume create climates_certbot_var
   ```
2. Run Postgres:
   ```bash
   docker run -d --name climates-postgres --network climates-net \
     -e POSTGRES_DB=climates -e POSTGRES_USER=climates -e POSTGRES_PASSWORD=change_me \
     -v climates_pgdata:/var/lib/postgresql/data postgres:16
   ```
3. Build and run Strapi:
   ```bash
   docker build -t climates-strapi ./cms
   docker run -d --name climates-strapi --network climates-net \
     --env-file cms/.env \
     -v climates_strapi_uploads:/srv/app/public/uploads \
     climates-strapi
   ```
4. Build and run the BFF:
   ```bash
   docker build -t climates-bff ./apps/bff
   docker run -d --name climates-bff --network climates-net \
     --env-file apps/bff/.env climates-bff
   ```
5. Build and run the web + nginx image:
   ```bash
   docker build -t climates-web -f docker/nginx/Dockerfile \
     --build-arg VITE_API_BASE_URL=https://api.example.com .
   docker run -d --name climates-nginx --network climates-net \
     -p 80:80 -p 443:443 \
     -v climates_certbot_etc:/etc/letsencrypt \
     -v climates_certbot_var:/var/www/certbot \
     climates-web
   ```
6. Request certificates (first time only):
   ```bash
   docker run --rm --network climates-net \
     -v climates_certbot_etc:/etc/letsencrypt \
     -v climates_certbot_var:/var/www/certbot \
     certbot/certbot certonly --webroot -w /var/www/certbot \
     -d example.com -d www.example.com -d api.example.com -d cms.example.com \
     --email you@example.com --agree-tos --no-eff-email
   ```
7. Restart nginx:
   ```bash
   docker restart climates-nginx
   ```

---

## BFF endpoints

- `GET /health`
- `GET /global`
- `GET /pages/:slug` (use `home` for `/`)
- `GET /blog?limit=&page=&category=&tag=`
- `GET /blog/:slug`

The BFF normalizes Strapi responses and strips internal fields.

---

## Strapi models

Schemas are located in `cms/src`. See `cms/README.md` for creation steps and role setup.

---

## Backups

- **Postgres**:
  ```bash
  docker exec -t <postgres_container> pg_dump -U climates climates > backups/db_$(date +%F).sql
  ```
- **Uploads**: archive the `strapi_uploads` volume regularly.

---

## Notes

- Draft & Publish is enabled for `Page` and `Blog Post`.
- The BFF requests only published content (`publicationState=live`).
- Update `normalizeSlug` in `apps/bff/src/index.ts` if you prefer a different slug strategy.

---

## Team Connector Debug Log

Use this section to keep track of connector issues in the Team section map and avoid repeating failed attempts.

### 2026-03-05 00:00
- Context: `apps/web/src/components/sections/TeamSection.tsx` connector lines between location bubbles and Madagascar markers.
- Symptoms:
  - lines appeared disconnected,
  - fewer lines than expected in some datasets.
- Root causes identified:
  - label-to-region mapping was not strict enough (unmapped labels silently skipped),
  - duplicate region labels could overwrite connector anchors.
- Changes applied:
  - strict `label -> region` validation with diagnostics (`UNMAPPED_LABEL`, `DUPLICATE_REGION`),
  - connector geometry computed from DOM positions in one coordinate space,
  - optional debug mode via URL query param `?debugConnectors=1`.
- Outcome:
  - connector routing is deterministic per unique mapped region,
  - invalid data is now surfaced in diagnostics and console (dev mode).
- Follow-up ideas:
  - if heavy overlap remains, add routed paths (orthogonal/hub ring) instead of direct segments.

### 2026-03-05 00:20
- Context: reduce connector overlap for dense layouts in Team section.
- Changes applied:
  - introduced connector route mode `hub` (default) with segmented SVG paths,
  - retained optional fallback mode `direct` via query param `?connectorRoute=direct`,
  - kept debug mode `?debugConnectors=1` to inspect anchors and route labels.
- Implementation details:
  - lines now route through side lanes (`left`/`right`) and a distributed hub Y coordinate to avoid stacking,
  - bubble and marker endpoints remain edge-to-edge.
- Outcome:
  - cleaner line layout with reduced crossing for 6 configured regions.
- Next ideas if still cluttered:
  - add quadratic smoothing on segment corners,
  - implement collision-aware lane spacing (force/iterative solver),
  - provide manual per-region lane override in Strapi.

### 2026-03-05 01:10
- Context: hub/direct routing still failed in real page layout (lines looked disconnected or visibly off-target).
- User-observed symptoms:
  - lines did not reliably attach to bubble edges,
  - some connectors looked like floating segments.
- Changes applied (new approach):
  - removed route/hub logic and all lane-based path generation,
  - switched to deterministic geometry using fixed bubble layout coordinates (`bubbleLayoutByKey`) as the source of truth,
  - for each mapped region, compute one straight line from bubble edge to marker edge using normalized vector math in the same `%` coordinate space,
  - kept strict label-to-region mapping diagnostics (`UNMAPPED_LABEL`, `DUPLICATE_REGION`) and debug overlay.
- Why this should be more stable:
  - no dependency on bubble DOM measurements or side/hub lane distribution,
  - endpoints are derived directly from known fixed bubble positions and marker coordinates every render/resize.
- If this still fails:
  - next attempt should render both bubbles and connectors from one pure SVG scene graph (single coordinate system) to eliminate any HTML/SVG alignment drift.

### 2026-03-05 01:45
- Context: single-scene straight connectors were still rejected visually after testing in the Team section.
- User-observed symptoms:
  - connectors looked disorganized,
  - some lines did not read as intentional links between bubble and marker.
- Changes applied (new attempt):
  - kept one SVG scene graph and strict `label -> region` mapping,
  - replaced straight `M ... L ...` segments with deterministic cubic Bezier paths,
  - added "magnetic" routing controls: curve direction is computed from bubble position relative to map center,
  - rendered each connector with a subtle two-stroke style (soft outer glow + crisp inner line) for readability.
- Why this is different:
  - still deterministic (no DOM measurement),
  - avoids harsh or awkward segment angles while preserving explicit marker-to-bubble linkage.
- Validation:
  - `TeamSection.tsx` bundles successfully with `esbuild` (existing `import.meta` format warning only).

### Known Local Tooling Error (environment-specific)
- `npx tsc --noEmit` can fail locally if toolchain mismatch is present:
  - missing `vite/client` type definition,
  - unsupported TypeScript option `erasableSyntaxOnly`.
