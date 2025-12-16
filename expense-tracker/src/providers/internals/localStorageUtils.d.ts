import type { TransactionUI } from "../../model/types.js";

export function insert(transactionInput: TransactionUI): void;
export function readAll(): Transaction[];
export function removeTransaction(id: string | number): void;
