export interface Transaction {
      id: string;
      description: string;
      amount: number;
      recordDate: string;
}

export type SortingCriteria =
      | "creationDate"
      | "recordDate"
      | "reverseRecordDate"
      | "alphabetic"
      | "reverseAlphabetic"
      | "amount-desc"
      | "amount-asc";

export type SortingAlgorithm = (transactions: Transaction[]) => Transaction[];

