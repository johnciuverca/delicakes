import { Pool } from "pg";

export type Transaction = {
  id: number;
  description: string;
  amount: number;
  recordDate: string;
};

type DbState = {
  transactions: Transaction[];
  nextId: number;
};

function getDatabaseUrl(): string {
  const rawDatabaseUrl = process.env.DATABASE_URL;
  if (!rawDatabaseUrl || typeof rawDatabaseUrl !== "string") {
    throw new Error("DATABASE_URL is required and must be a string");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawDatabaseUrl);
  } catch {
    throw new Error("DATABASE_URL is not a valid URL");
  }

  if (!parsedUrl.password) {
    throw new Error("DATABASE_URL must include a database password for SCRAM authentication");
  }

  return rawDatabaseUrl;
}

const pool = new Pool({ connectionString: getDatabaseUrl() });

let ensureTablePromise: Promise<void> | null = null;

async function ensureStorageReady(): Promise<void> {
  if (!ensureTablePromise) {
    ensureTablePromise = pool.query(`
      CREATE TABLE IF NOT EXISTS public.transactions (
        id INTEGER PRIMARY KEY,
        description TEXT NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        record_date DATE NOT NULL
      )
    `).then(() => undefined);
  }

  await ensureTablePromise;
}

export async function getAllTransactions(): Promise<Transaction[]> {
  await ensureStorageReady();
  const result = await pool.query<{
    id: number;
    description: string;
    amount: string | number;
    recordDate: string;
  }>(`
    SELECT
      id,
      description,
      amount,
      to_char(record_date, 'DD-MM-YYYY') AS "recordDate"
    FROM public.transactions
    ORDER BY id ASC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    recordDate: row.recordDate,
  }));
}

export async function addTransaction(
  description: string,
  amount: number,
  recordDate: string,
): Promise<Transaction> {
  await ensureStorageReady();

  const result = await pool.query<{ id: number }>(`
    WITH next_id AS (
      SELECT COALESCE(MAX(id), 0) + 1 AS id
      FROM public.transactions
    )
    INSERT INTO public.transactions (id, description, amount, record_date)
    SELECT id, $1, $2, to_date($3, 'DD-MM-YYYY')
    FROM next_id
    RETURNING id
  `, [description, amount, recordDate]);

  return {
    id: result.rows[0].id,
    description,
    amount,
    recordDate,
  };
}

export async function updateTransaction(
  id: number | string,
  description: string,
  amount: number,
  recordDate: string,
): Promise<void> {
  await ensureStorageReady();
  const idNumber = typeof id === "string" ? Number(id) : id;

  await pool.query(
    `UPDATE public.transactions
     SET description = $2,
         amount = $3,
         record_date = to_date($4, 'DD-MM-YYYY')
     WHERE id = $1`,
    [idNumber, description, amount, recordDate],
  );
}

export async function deleteTransaction(id: number | string): Promise<void> {
  await ensureStorageReady();
  const idNumber = typeof id === "string" ? Number(id) : id;

  await pool.query("DELETE FROM public.transactions WHERE id = $1", [idNumber]);
}
