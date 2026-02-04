import type { Transaction } from "../model/types";

export function filterByContains(transactions: Array<Transaction>, filterCriteria: string) {
      const matchingResults: typeof transactions = [];
      transactions.forEach((transaction) => {
            if (transaction.description.toLowerCase().includes(filterCriteria.toLowerCase())) {
                  matchingResults.push(transaction);
            }
      });
      return matchingResults;
}