export interface TransactionInput {
      description: string;
      amount: number;
      recordDate?: string;
}

export function fetchAllTransactions(): Promise<TransactionInput[]>;
export function insertTransaction(transactionInput: TransactionInput): Promise<any>;
export function updateTransaction(inputId: string | number, properties: Partial<TransactionInput>): Promise<any>;
