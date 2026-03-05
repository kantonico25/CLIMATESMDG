import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { withCache } from "./cache.js";
import { env } from "./env.js";
import { HttpError } from "./http.js";
import {
  fetchProjectBySlug,
  fetchProjectList,
  fetchBlogList,
  fetchBlogPost,
  fetchGlobal,
  fetchPageBySlug
} from "./services/content.js";
import {
  normalizePredictionPayload,
  predictCarbon
} from "./services/prediction.js";

const app = express();

const normalizeOrigin = (value: string): string => value.trim().replace(/\/+$/, "");
const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow non-browser/server-to-server requests (no Origin header).
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }

      const isAllowed = allowedOrigins.includes(normalizeOrigin(requestOrigin));
      callback(null, isAllowed);
    },
    credentials: false
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);
app.use(morgan("tiny"));

const asyncHandler =
  (fn: express.RequestHandler): express.RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const normalizeSlug = (raw: string): string => {
  if (raw === "home") return "/";
  if (raw.startsWith("/")) return raw;
  return `/${raw}`;
};

app.get(
  "/health",
  asyncHandler(async (_req, res) => {
    res.json({ status: "ok" });
  })
);

app.get(
  "/global",
  asyncHandler(async (_req, res) => {
    const data = await withCache("global", env.CACHE_TTL_SECONDS, fetchGlobal);
    res.json(data);
  })
);

app.get(
  "/pages/:slug",
  asyncHandler(async (req, res) => {
    const slug = normalizeSlug(String(req.params.slug));
    const cacheKey = `page:${slug}`;
    const data = await withCache(cacheKey, env.CACHE_TTL_SECONDS, () =>
      fetchPageBySlug(slug)
    );
    if (!data) {
      res.status(404).json({ message: "Page not found" });
      return;
    }
    res.json(data);
  })
);

app.get(
  "/blog",
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? "1"), 10));
    const pageSize = Math.min(
      50,
      Math.max(1, Number.parseInt(String(req.query.limit ?? "10"), 10))
    );
    const category = req.query.category ? String(req.query.category) : undefined;
    const tag = req.query.tag ? String(req.query.tag) : undefined;
    const cacheKey = `blog:${page}:${pageSize}:${category ?? ""}:${tag ?? ""}`;

    const data = await withCache(cacheKey, env.CACHE_TTL_SECONDS, () =>
      fetchBlogList({ page, pageSize, category, tag })
    );
    res.json(data);
  })
);

app.get(
  "/blog/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const cacheKey = `blog:${slug}`;
    const data = await withCache(cacheKey, env.CACHE_TTL_SECONDS, () =>
      fetchBlogPost(slug)
    );
    if (!data) {
      res.status(404).json({ message: "Blog post not found" });
      return;
    }
    res.json(data);
  })
);

app.get(
  "/projects",
  asyncHandler(async (req, res) => {
    const parsedLimit = req.query.limit
      ? Number.parseInt(String(req.query.limit), 10)
      : Number.NaN;
    const limit = Number.isFinite(parsedLimit)
      ? Math.max(1, Math.min(100, parsedLimit))
      : undefined;
    const cacheKey = `projects:list:${limit ?? "all"}`;
    const data = await withCache(cacheKey, env.CACHE_TTL_SECONDS, () => fetchProjectList(limit));
    res.json(data);
  })
);

app.get(
  "/projects/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const data = await withCache(`project:${slug}`, env.CACHE_TTL_SECONDS, () =>
      fetchProjectBySlug(slug)
    );
    if (!data) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(data);
  })
);

app.post(
  "/predict-carbon",
  asyncHandler(async (req, res) => {
    const payload = normalizePredictionPayload(req.body ?? {});
    const result = await predictCarbon(payload);
    res.json(result);
  })
);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ message: err.message });
      return;
    }

    console.error("[bff] Unhandled error", err);
    res.status(500).json({ message: "Internal server error" });
  }
);

app.listen(env.PORT, () => {
  console.log(`[bff] listening on port ${env.PORT}`);
});
