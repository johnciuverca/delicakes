import React, { useMemo } from "react";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "../model/types";

interface TransactionListProps {
      transactions: Array<Transaction>;
      filterBy: string;
      sortBy: string;
}

export function TransactionList(props: TransactionListProps) {
      const displayableTransactions = useMemo(() => {
            const filteredTransactions = filterByContains(props.transactions, props.filterBy);
            const sortedTransactions = sortTransactions(filteredTransactions, props.sortBy);
            return sortedTransactions;
      }, [props.transactions, props.sortBy, props.filterBy]);

      return (
            <ul id="transaction-list">
                  {displayableTransactions.map((t) => {
                        return (
                              <TransactionItem key={t.id} transaction={t} />
                        );
                  })}
            </ul>
      );
}

function filterByContains(transactions: Array<Transaction>, filterCriteria: string) {
      const matchingResults: typeof transactions = [];
      transactions.forEach((transaction) => {
            if (transaction.description.toLowerCase().includes(filterCriteria.toLowerCase())) {
                  matchingResults.push(transaction);
            }
      });
      return matchingResults;
}

const sortingStrategies = new Map<string, (a: Transaction, b: Transaction) => number>([
      ["creationDate", (_a, _b) => -1],
      ["recordDate", (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()],
      ["reverseRecordDate", (a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()],
      ["alphabetic", (a, b) => a.description.localeCompare(b.description)],
      ["reverseAlphabetic", (a, b) => b.description.localeCompare(a.description)],
      ["amount-desc", (a, b) => a.amount - b.amount],
      ["amount-asc", (a, b) => b.amount - a.amount],
]);

function sortTransactions(transactions: Transaction[], sortBy: string): Transaction[] {
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