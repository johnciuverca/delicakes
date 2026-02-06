import type { Transaction, TransactionUI } from "../../model/types";

const remoteApiBaseUrl = "http://192.168.0.118:3001";
const localApiBaseUrl = "http://localhost:3100";
const apiBaseUrl = localApiBaseUrl;

async function assertOk(response: Response): Promise<void> {
      if (!response.ok) {
            throw new Error("Network response was not ok");
      }
}

export async function fetchAllTransactions(): Promise<Transaction[]> {
      const response = await fetch(`${apiBaseUrl}/api/transactions`);
      await assertOk(response);
      return (await response.json()) as Transaction[];
}

export async function insertTransaction(transactionInput: TransactionUI): Promise<Transaction> {
      const response = await fetch(`${apiBaseUrl}/api/transactions`, {
            method: "POST",
            headers: {
                  "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionInput),
      });

      await assertOk(response);
      return (await response.json()) as Transaction;
}

export async function updateTransaction(
      inputId: string | number,
      properties: Partial<TransactionUI>,
): Promise<unknown> {
      const response = await fetch(`${apiBaseUrl}/api/transactions/${inputId}`, {
            method: "PUT",
            headers: {
                  "Content-Type": "application/json",
            },
            body: JSON.stringify(properties),
      });

      await assertOk(response);
      return (await response.json()) as unknown;
}

export async function deleteTransaction(inputId: string | number): Promise<boolean> {
      const response = await fetch(`${apiBaseUrl}/api/transactions`, {
            method: "DELETE",
            headers: {
                  "Content-Type": "application/json",
            },
            body: JSON.stringify({
                  id: inputId,
            }),
      });

      if (!response.ok) {
            return false;
      }
      return true;
}

// Exported for potential future switching between base URLs.
export const __apiBaseUrl = {
      remoteApiBaseUrl,
      localApiBaseUrl,
      apiBaseUrl,
};
