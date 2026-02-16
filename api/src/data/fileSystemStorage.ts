import fs from "node:fs/promises";
import path from "node:path";

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

const serverRoot = process.cwd();
const storageDir = path.join(serverRoot, ".storage");
const storageFile = path.join(storageDir, "transactions.json");

async function ensureStorageReady(): Promise<void> {
  await fs.mkdir(storageDir, { recursive: true });
  try {
    await fs.access(storageFile);
  } catch {
    const initial: DbState = { transactions: [], nextId: 1 };
    await fs.writeFile(storageFile, JSON.stringify(initial, null, 2));
  }
}

async function readState(): Promise<DbState> {
  await ensureStorageReady();
  const raw = await fs.readFile(storageFile, "utf8");
  return JSON.parse(raw) as DbState;
}

async function writeState(state: DbState): Promise<void> {
  await ensureStorageReady();
  await fs.writeFile(storageFile, JSON.stringify(state));
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const state = await readState();
  return state.transactions;
}

export async function addTransaction(
  description: string,
  amount: number,
  recordDate: string,
): Promise<Transaction> {
  const state = await readState();

  const newTransaction: Transaction = {
    id: state.nextId++,
    description,
    amount,
    recordDate,
  };

  state.transactions.push(newTransaction);
  await writeState(state);
  return newTransaction;
}

export async function updateTransaction(
  id: number | string,
  description: string,
  amount: number,
  recordDate: string,
): Promise<void> {
  const state = await readState();
  const idNumber = typeof id === "string" ? Number(id) : id;

  const target = state.transactions.find((t) => t.id === idNumber);
  if (target) {
    target.description = description;
    target.amount = amount;
    target.recordDate = recordDate;
  }

  await writeState(state);
}

export async function deleteTransaction(id: number | string): Promise<void> {
  const state = await readState();
  const idNumber = typeof id === "string" ? Number(id) : id;

  const targetIndex = state.transactions.findIndex((t) => t.id === idNumber);
  if (targetIndex !== -1) {
    state.transactions.splice(targetIndex, 1);
  }

  await writeState(state);
}
