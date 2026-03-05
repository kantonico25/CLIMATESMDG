import path from "node:path";
import { spawn } from "node:child_process";
import { env } from "../env.js";
import { HttpError } from "../http.js";

export type CarbonPredictionRequest = {
  bodyType: string;
  sex: string;
  diet: string;
  showerFrequency: string;
  heatingEnergySource: string;
  transport: string;
  vehicleType?: string | null;
  socialActivity: string;
  monthlyGroceryBill: number;
  airTravelFrequency: string;
  vehicleMonthlyDistanceKm: number;
  wasteBagSize: string;
  wasteBagWeeklyCount: number;
  tvPcHoursDaily: number;
  newClothesMonthly: number;
  internetHoursDaily: number;
  energyEfficiency: string;
  recycling: string;
  cookingWith: string;
};

export type CarbonPredictionResponse = {
  prediction: number;
};

const normalizeNumber = (value: unknown, field: string): number => {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed)) {
    throw new HttpError(400, `Invalid numeric value for ${field}.`);
  }
  return parsed;
};

const normalizeString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `Missing value for ${field}.`);
  }
  return value;
};

export const normalizePredictionPayload = (payload: Partial<CarbonPredictionRequest>): CarbonPredictionRequest => {
  return {
    bodyType: normalizeString(payload.bodyType, "bodyType"),
    sex: normalizeString(payload.sex, "sex"),
    diet: normalizeString(payload.diet, "diet"),
    showerFrequency: normalizeString(payload.showerFrequency, "showerFrequency"),
    heatingEnergySource: normalizeString(payload.heatingEnergySource, "heatingEnergySource"),
    transport: normalizeString(payload.transport, "transport"),
    vehicleType: typeof payload.vehicleType === "string" ? payload.vehicleType : undefined,
    socialActivity: normalizeString(payload.socialActivity, "socialActivity"),
    monthlyGroceryBill: normalizeNumber(payload.monthlyGroceryBill, "monthlyGroceryBill"),
    airTravelFrequency: normalizeString(payload.airTravelFrequency, "airTravelFrequency"),
    vehicleMonthlyDistanceKm: normalizeNumber(payload.vehicleMonthlyDistanceKm, "vehicleMonthlyDistanceKm"),
    wasteBagSize: normalizeString(payload.wasteBagSize, "wasteBagSize"),
    wasteBagWeeklyCount: normalizeNumber(payload.wasteBagWeeklyCount, "wasteBagWeeklyCount"),
    tvPcHoursDaily: normalizeNumber(payload.tvPcHoursDaily, "tvPcHoursDaily"),
    newClothesMonthly: normalizeNumber(payload.newClothesMonthly, "newClothesMonthly"),
    internetHoursDaily: normalizeNumber(payload.internetHoursDaily, "internetHoursDaily"),
    energyEfficiency: normalizeString(payload.energyEfficiency, "energyEfficiency"),
    recycling: normalizeString(payload.recycling, "recycling"),
    cookingWith: normalizeString(payload.cookingWith, "cookingWith")
  };
};

export const predictCarbon = async (
  payload: CarbonPredictionRequest
): Promise<CarbonPredictionResponse> => {
  const scriptPath = env.PREDICT_SCRIPT || path.resolve(process.cwd(), "predictor", "predict.py");
  const args = [
    scriptPath,
    "--model",
    env.MODEL_PATH,
    "--scaler",
    env.SCALER_PATH
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(env.PYTHON_BIN, args, {
      stdio: ["pipe", "pipe", "pipe"]
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new HttpError(504, "Prediction timed out."));
    }, env.PREDICT_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    child.stderr.on("data", (chunk) => stderrChunks.push(Buffer.from(chunk)));

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(new HttpError(500, "Failed to start predictor process.", error));
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        const stderr = Buffer.concat(stderrChunks).toString("utf8");
        reject(new HttpError(500, stderr || "Prediction process failed."));
        return;
      }

      const stdout = Buffer.concat(stdoutChunks).toString("utf8");
      try {
        const parsed = JSON.parse(stdout) as CarbonPredictionResponse;
        if (!Number.isFinite(parsed.prediction)) {
          reject(new HttpError(500, "Invalid prediction result."));
          return;
        }
        resolve(parsed);
      } catch (error) {
        reject(new HttpError(500, "Failed to parse prediction result.", error));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
};
