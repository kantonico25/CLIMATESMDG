import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { createServer } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.resolve(root, "dist");
const templatePath = path.join(distDir, "index.html");

if (!fs.existsSync(templatePath)) {
  throw new Error("dist/index.html not found. Run the build first.");
}

const template = fs.readFileSync(templatePath, "utf-8");

const vite = await createServer({
  root,
  logLevel: "error",
  server: { middlewareMode: true },
  appType: "custom",
  mode: process.env.NODE_ENV || "production",
});

const { default: AppRoutes } = await vite.ssrLoadModule("/src/Components/AppRoutes.tsx");
const { articles } = await vite.ssrLoadModule("/src/data/articles.ts");

const routes = ["/", "/contact", ...articles.map((article: { slug: string }) => `/articles/${article.slug}`)];

const stripTitle = (html: string) => html.replace(/<title>.*?<\\/title>/s, "");

const injectHead = (html: string, head: string) => html.replace("</head>", `${head}</head>`);

const injectApp = (html: string, appHtml: string) =>
  html.replace(/<div id="app"><\\/div>/, `<div id="app">${appHtml}</div>`);

for (const url of routes) {
  const helmetContext: { helmet?: { title?: { toString: () => string }; meta?: { toString: () => string }; link?: { toString: () => string }; script?: { toString: () => string } } } = {};

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </HelmetProvider>
  );

  const helmet = helmetContext.helmet;
  const headTags = [helmet?.title?.toString(), helmet?.meta?.toString(), helmet?.link?.toString(), helmet?.script?.toString()]
    .filter(Boolean)
    .join("");

  const html = injectApp(injectHead(stripTitle(template), headTags), appHtml);
  const routePath = url.replace(/^\\/+/, "");
  const outputDir = routePath ? path.join(distDir, routePath) : distDir;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), html, "utf-8");
}

await vite.close();
