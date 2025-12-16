import type { TransactionUI } from "../../model/types.js";

export function fetchAllTransactions(): Promise<TransactionUI[]>;
export function insertTransaction(transactionInput: TransactionUI): Promise<any>;
export function updateTransaction(inputId: string | number, properties: Partial<TransactionUI>): Promise<any>;
export function deleteTransaction(inputId: string | number): Promise<void>;