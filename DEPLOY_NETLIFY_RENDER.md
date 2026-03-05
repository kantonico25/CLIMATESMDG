# Netlify + Render + Postgres Deployment (Monorepo)

This setup deploys:
- Frontend (`apps/web`) on Netlify
- BFF API (`apps/bff`) on Render
- Strapi CMS (`cms`) on Render
- Postgres (managed database) on Render

## 1) Render services

Use the blueprint at repo root:
- `render.yaml`

It provisions:
- `climates-postgres` (managed Postgres)
- `climates-cms` (Strapi)
- `climates-bff` (Node/Express API)

### Required env vars after first deploy

For `climates-cms`:
- `PUBLIC_URL` = your CMS public URL (for example `https://climates-cms.onrender.com`)
- `DATABASE_URL` (Supabase or Render Postgres URI)
- `APP_KEYS` (comma-separated)
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`

For `climates-bff`:
- `CORS_ORIGIN` = your Netlify site URL (for example `https://your-site.netlify.app`)
- `STRAPI_URL` = your CMS URL (for example `https://climates-cms.onrender.com`)
- `STRAPI_TOKEN` = Strapi API token with read access

Health checks:
- CMS: `/_health`
- BFF: `/health`

## 2) Netlify

`netlify.toml` is configured for `apps/web`:
- Base: `apps/web`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- SPA fallback redirect to `/index.html`

Set this env var in Netlify:
- `VITE_API_BASE_URL=https://<your-bff-service>.onrender.com`

## 3) Env templates

Use:
- `apps/web/.env.sample`
- `apps/bff/.env.sample`
- `cms/.env.sample`

## 4) DNS / custom domains

- Point frontend domain to Netlify.
- Point API/CMS domains to Render.
- Update `VITE_API_BASE_URL`, `CORS_ORIGIN`, `STRAPI_URL`, and `PUBLIC_URL` to final domains.
