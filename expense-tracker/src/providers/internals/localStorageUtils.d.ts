export interface TransactionInput {
      description: string;
      amount: number;
      recordDate?: string;
}

export function insert(transactionInput: TransactionInput): void;
export function readAll(): TransactionInput[];
export function removeTransaction(id: string | number): void;
