import { Pool } from "pg";
import { hashPassword } from "../security/utils";

export type UserRecord = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: "user" | "admin";
};

export type NewUserInput = {
  email: string;
  password: string;
  name: string;
};

export type CreatedUser = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
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

export async function insertUser({ email, password, name }: NewUserInput): Promise<CreatedUser> {
  const passwordHash = hashPassword(password);
  
  const result = await pool.query<CreatedUser>(
    `INSERT INTO public.users (email, password_hash, "name", role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id, email, "name", role`,
    [email.toLowerCase().trim(), passwordHash, name.trim()],
  );

  return result.rows[0];
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await pool.query<{
    id: number;
    email: string;
    password_hash: string;
    name: string;
    role: "user" | "admin";
  }>(
    `SELECT id, email, password_hash, "name", role
     FROM public.users
     WHERE email = $1
     LIMIT 1`,
    [email.toLowerCase().trim()],
  );

  if (result.rowCount === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    role: row.role,
  };
}

export function updateUserPassword(email: string, newPasswordHash: string): Promise<void> {
  return pool.
  query(
    `UPDATE public.users
     SET password_hash = $1
     WHERE email = $2`,
    [newPasswordHash, email.toLowerCase().trim()],
  ).then(() => {});
}

