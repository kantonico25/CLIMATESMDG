import path from "path";
import express, { Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import { saveSubmission } from "./db";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const shouldServeStatic = process.env.SERVE_STATIC === "true";

const corsOrigins = process.env.CORS_ORIGIN?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(compression());
app.use(
  cors({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : "*",
  })
);
app.use(express.json({ limit: "1mb" }));

if (shouldServeStatic) {
  const distPath = path.resolve("dist");
  app.use(
    express.static(distPath, {
      index: false,
      maxAge: "1h",
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    })
  );
}

const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_TO"] as const;

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
});

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  company?: string;
};

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const isValidPhone = (value: string) => {
  const cleaned = value.replace(/[\s()-]/g, "");
  return /^\+?\d{7,15}$/.test(cleaned);
};

app.post("/api/contact", apiLimiter, async (req: Request, res: Response) => {
  try {
    const missingEnv = requiredEnv.filter((key) => !process.env[key]);
    if (missingEnv.length > 0) {
      return res.status(500).json({ message: `Missing server config: ${missingEnv.join(", ")}` });
    }

    const { name, email, phone, reason } = (req.body ?? {}) as Partial<ContactPayload>;

    const honeyPotField = process.env.HONEY_POT_FIELD || "company";
    const honeyPotValue = (req.body ?? {})[honeyPotField];

    if (honeyPotValue) {
      return res.status(400).json({ message: "Spam detected." });
    }

    if (!name || !email || !phone || !reason) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone format." });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = process.env.MAIL_SUBJECT || "Inscription volontariat";
    const from = process.env.MAIL_FROM || process.env.MAIL_TO;

    const text = `Nouvelle inscription volontariat\n\nNom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nRaison: ${reason}`;
    const html = `
      <h2>Nouvelle inscription volontariat</h2>
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Téléphone:</strong> ${phone}</p>
      <p><strong>Raison:</strong><br/>${reason.replace(/\n/g, "<br/>")}</p>
    `;

    await transporter.sendMail({
      from,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject,
      text,
      html,
    });

    saveSubmission({
      name,
      email,
      phone,
      reason,
      ip: req.ip,
      userAgent: req.get("user-agent") || undefined,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send email." });
  }
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

if (shouldServeStatic) {
  const distPath = path.resolve("dist");
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Contact API listening on port ${port}`);
});

