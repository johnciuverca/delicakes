import type { Transaction } from "../model/types";

const sortingStrategies = new Map<string, (a: Transaction, b: Transaction) => number>([
      ["creationDate", (_a, _b) => -1],
      ["recordDate", (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()],
      ["reverseRecordDate", (a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()],
      ["alphabetic", (a, b) => a.description.localeCompare(b.description)],
      ["reverseAlphabetic", (a, b) => b.description.localeCompare(a.description)],
      ["amount-desc", (a, b) => a.amount - b.amount],
      ["amount-asc", (a, b) => b.amount - a.amount],
]);

export function sortTransactions(transactions: Transaction[], sortBy: string): Transaction[] {
      const strategy = sortingStrategies.get(sortBy);
      if (strategy) {
            return applySortingStrategy(transactions, strategy);
      }
      return transactions;
}

function applySortingStrategy(
      transactions: Array<Transaction>,
      sortingStrategy: (a: Transaction, b: Transaction) => number
): Array<Transaction> {
      return [...transactions].sort((a, b) => {
            var aFormatted = formatDateToYYYYMMDD(a.recordDate);
            var bFormatted = formatDateToYYYYMMDD(b.recordDate);
            return sortingStrategy(
                  { ...a, recordDate: aFormatted },
                  { ...b, recordDate: bFormatted }
            );
      });
}

function formatDateToYYYYMMDD(date: string): string {
      const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`;
}