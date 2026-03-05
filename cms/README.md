# CliMates CMS (Strapi 5)

This folder contains Strapi schema definitions (components + content types) for the headless CMS.

## Setup (local)

1. Install dependencies:
   ```bash
   cd cms
   npm install
   ```
2. Create a local `.env` from `.env.example` and fill secrets.
3. Run Strapi in dev mode:
   ```bash
   npm run develop
   ```
4. Open the admin panel at `http://localhost:1337/admin` and create the first admin user.

Strapi 5 requires a supported LTS Node version (currently 20/22/24).

## Automatic image optimization

Image uploads are automatically optimized on Strapi startup via `src/index.js`:
- `sizeOptimization: true` (compression)
- `autoOrientation: true` (EXIF rotation)
- `responsiveDimensions: true` (responsive image variants)
- uploaded raster images are converted to `image/webp` automatically

Responsive upload breakpoints are configured in `config/plugins.js`.

## Content types included

- **Single Type: Global**
  - `siteName`, `logo`, `navbarLinks`, `footerText`, `socialLinks`, `defaultSeo`
- **Collection Type: Page**
  - `title`, `slug` (string), `seo`, `sections` (dynamic zone)
- **Collection Type: Blog Post**
  - `title`, `slug`, `excerpt`, `coverImage`, `authorName`, `body`, `categories`, `tags`
  - Uses Strapi built-in Draft & Publish (`publishedAt`) instead of a custom field.
- **Collection Type: Category**
  - `name`, `slug`
- **Collection Type: Tag**
  - `name`, `slug`

## Editorial roles

Create roles in **Settings → Administration Panel → Roles**:
- **Admin**: full access
- **Editor**: create/edit/publish `Page` + `Blog Post`
- **Viewer**: read-only access

## API token

Create a **Read-only API token** in **Settings → API Tokens** and store it in the BFF as `STRAPI_TOKEN`.

## Page slug convention

- Store slugs with leading `/` for pages (e.g. `/`, `/about`, `/pricing`).
- The BFF expects `/pages/home` to fetch the `/` page. For other pages, `/pages/about` maps to `/about`.

If you prefer to store slugs without `/`, update `normalizeSlug` in the BFF.
