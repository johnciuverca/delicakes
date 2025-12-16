export interface Transaction {
      id: string;
      description: string;
      amount: number;
      recordDate: string;
}

export type TransactionUI = Omit<Transaction, "id">;