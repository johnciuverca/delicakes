import React, { useMemo } from "react";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "../model/types";

interface TransactionListProps {
      transactions: Array<Transaction>;
      sortBy: string;
}

export function TransactionList(props: TransactionListProps) {
      const sortedTransactions = useMemo(() => {
            return sortTransactions(props.transactions, props.sortBy);
      }, [props.transactions, props.sortBy]);

      return (
            <ul id="transaction-list">
                  {sortedTransactions.map((t) => {
                        return (
                              <TransactionItem key={t.id} transaction={t} />
                        );
                  })}
            </ul>
      );
}

function sortTransactions(transactions: Transaction[], sortBy: string): Transaction[] {
      if (sortBy === "creationDate") return [...transactions].reverse();
      if (sortBy === "recordDate") {
            return sortByCriteria(transactions, (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
      }
      if (sortBy === "reverseRecordDate") {
            return sortByCriteria(transactions, (a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());
      }
      if (sortBy === "alphabetic") {
            return sortByCriteria(transactions, (a, b) => a.description.localeCompare(b.description));
      }
      if (sortBy === "reverseAlphabetic") {
            return sortByCriteria(transactions, (a, b) => b.description.localeCompare(a.description));
      }
      if (sortBy === "amount-desc") {
            return sortByCriteria(transactions, (a, b) => b.amount - a.amount);
      }
      if (sortBy === "amount-asc") {
            return sortByCriteria(transactions, (a, b) => a.amount - b.amount);
      }
      return transactions;
}

function sortByCriteria(
      transactions: Array<Transaction>,
      compareFn: (a: Transaction, b: Transaction) => number
): Array<Transaction> {
      return [...transactions]
            .map(t => {
                  const [day, month, year] = t.recordDate.split("-");
                  const formattedDate = `${year}-${month}-${day}`;
                  return {
                        ...t,
                        recordDate: formattedDate.toString(),
                  };
            })
            .sort(compareFn)
            .map(t => {
                  const [year, month, day] = t.recordDate.split("-")
                  const formattedDate = `${day}-${month}-${year}`
                  return {
                        ...t,
                        recordDate: formattedDate.toString(),
                  }
            });
}