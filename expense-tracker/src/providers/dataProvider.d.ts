export interface TransactionInput {
      description: string;
      amount: number;
      recordDate?: string;
}

export interface Transaction extends TransactionInput {
      id: string | number;
}

export interface DataProvider {
      readAll(): Promise<Transaction[]>;
      insert(transactionInput: TransactionInput): Promise<void>;
      update(id: string | number, inputData: Partial<TransactionInput>): Promise<any>;
      remove(id: string | number): Promise<void>;
}

export const dataProvider: DataProvider;
