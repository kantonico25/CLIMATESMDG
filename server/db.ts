import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

type SubmissionRecord = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  ip?: string;
  userAgent?: string;
};

const dbPath = process.env.DB_PATH || "server/data/submissions.sqlite";
const resolvedPath = path.resolve(dbPath);

fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new Database(resolvedPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    reason TEXT NOT NULL,
    ip TEXT,
    user_agent TEXT
  );
`);

const insertStmt = db.prepare(`
  INSERT INTO submissions (name, email, phone, reason, ip, user_agent)
  VALUES (@name, @email, @phone, @reason, @ip, @userAgent);
`);

export const saveSubmission = (record: SubmissionRecord) => {
  insertStmt.run(record);
};

