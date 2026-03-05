import "dotenv/config";
import path from "node:path";

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  STRAPI_URL: process.env.STRAPI_URL ?? "http://localhost:1337",
  STRAPI_TOKEN: process.env.STRAPI_TOKEN ?? "",
  CACHE_TTL_SECONDS: Number(process.env.CACHE_TTL_SECONDS ?? 60),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  PYTHON_BIN: process.env.PYTHON_BIN ?? "python",
  PREDICT_SCRIPT:
    process.env.PREDICT_SCRIPT ??
    path.resolve(process.cwd(), "predictor", "predict.py"),
  MODEL_PATH:
    process.env.MODEL_PATH ??
    path.resolve(process.cwd(), "predictor", "models", "carbon_emission_model1_3.pkl"),
  SCALER_PATH:
    process.env.SCALER_PATH ??
    path.resolve(process.cwd(), "predictor", "models", "scaler.pkl"),
  PREDICT_TIMEOUT_MS: Number(process.env.PREDICT_TIMEOUT_MS ?? 15000)
};

if (!env.STRAPI_TOKEN) {
  console.warn("[bff] STRAPI_TOKEN is empty. Requests may be unauthorized.");
}
