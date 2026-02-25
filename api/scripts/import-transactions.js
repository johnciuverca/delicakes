import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pg;

dotenv.config({ path: path.join(__dirname, "../.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function toISODate(value) {
  if (typeof value !== "string") return value;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  return value;
}

(async () => {
  const db = await pool.query(
    "SELECT current_database() AS db, current_user AS usr, current_schema() AS schema"
  );
  console.log("Connected to:", db.rows[0]);

  const filePath = path.join(__dirname, "../.storage/transactions.json");
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) {
    console.log("transactions.json is empty. Nothing to import.");
    process.exit(0);
  }

  const parsed = JSON.parse(raw);
  const rows = Array.isArray(parsed) ? parsed : (parsed.transactions || []);
  console.log("Rows found in JSON:", rows.length);

  if (!rows.length) process.exit(0);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.transactions (
      id INTEGER PRIMARY KEY,
      description TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      record_date DATE NOT NULL
    )
  `);

  await pool.query("BEGIN");
  let affected = 0;

  for (const t of rows) {
    const result = await pool.query(
      `INSERT INTO public.transactions (id, description, amount, record_date)
       VALUES ($1, $2, $3, $4::date)
       ON CONFLICT (id) DO UPDATE
       SET description = EXCLUDED.description,
           amount = EXCLUDED.amount,
           record_date = EXCLUDED.record_date`,
      [Number(t.id), t.description, Number(t.amount), toISODate(t.recordDate)]
    );
    affected += result.rowCount || 0;
  }

  await pool.query("COMMIT");

  const count = await pool.query("SELECT COUNT(*)::int AS c FROM public.transactions");
  console.log("Statements affected:", affected);
  console.log("Rows now in public.transactions:", count.rows[0].c);

  await pool.end();
})().catch(async (err) => {
  console.error("Import failed:", err);
  try { await pool.query("ROLLBACK"); } catch {}
  await pool.end();
  process.exit(1);
});