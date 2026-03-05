import { createServer, loadEnv } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const env = loadEnv(process.env.NODE_ENV || "production", root, "");
const rawSiteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || env.SITE_URL || env.VITE_SITE_URL || "";
const siteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, "") : "http://localhost:5173";

if (!rawSiteUrl) {
  console.warn("SITE_URL is not set. Falling back to http://localhost:5173 for sitemap generation.");
}

const vite = await createServer({
  root,
  logLevel: "error",
  server: { middlewareMode: true },
  appType: "custom",
  mode: process.env.NODE_ENV || "production",
});

const { articles } = await vite.ssrLoadModule("/src/data/articles.ts");

const routes = ["/", "/contact", ...articles.map((article: { slug: string }) => `/articles/${article.slug}`)];
const lastmod = new Date().toISOString();

const urls = routes
  .map((route) => {
    const loc = `${siteUrl}${route === "/" ? "" : route}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf-8");
fs.writeFileSync(
  path.join(publicDir, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
  "utf-8"
);

await vite.close();
