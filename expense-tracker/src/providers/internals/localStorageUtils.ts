import type { Transaction, TransactionUI } from "../../model/types";

function readRaw(): unknown {
      const raw = localStorage.getItem("transactions");
      return raw ? (JSON.parse(raw) as unknown) : [];
}

export function insert(transactionInput: TransactionUI): void {
      const transactions = readAll();

      transactions.push({
            id: String(Date.now()),
            description: transactionInput.description,
            amount: transactionInput.amount,
            recordDate: transactionInput.recordDate,
      });

      localStorage.setItem("transactions", JSON.stringify(transactions));
}

export function readAll(): Transaction[] {
      const parsed = readRaw();
      if (!Array.isArray(parsed)) {
            return [];
      }

      return parsed
            .filter((t): t is Record<string, unknown> => typeof t === "object" && t !== null)
            .map((t) => {
                  const id = "id" in t ? String(t.id) : String(Date.now());
                  const description = typeof t.description === "string" ? t.description : "";
                  const amount = typeof t.amount === "number" ? t.amount : Number(t.amount ?? 0);
                  const recordDate = typeof t.recordDate === "string" ? t.recordDate : "";

                  return { id, description, amount, recordDate } satisfies Transaction;
            });
}

export function removeTransaction(id: string | number): void {
      const transactions = readAll().filter((transaction) => transaction.id !== String(id));
      localStorage.setItem("transactions", JSON.stringify(transactions));
}
