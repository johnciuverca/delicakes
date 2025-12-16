import type { Transaction, TransactionUI } from "../model/types.js";

export interface DataProvider {
      readAll(): Promise<Transaction[]>;
      insert(transactionInput: TransactionUI): Promise<void>;
      update(id: string | number, inputData: Partial<TransactionUI>): Promise<any>;
      remove(id: string | number): Promise<void>;
}

export const dataProvider: DataProvider;
