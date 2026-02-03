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
            return [...transactions].sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
      }
      if (sortBy === "reverseRecordDate") {
            return [...transactions].sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());
      }
      if (sortBy === "alphabetic") {
            return [...transactions].sort((a, b) => a.description.localeCompare(b.description));
      }
      if (sortBy === "reverseAlphabetic") {
            return [...transactions].sort((a, b) => b.description.localeCompare(a.description));
      }
      if (sortBy === "amount-desc") {
            return [...transactions].sort((a, b) => b.amount - a.amount);
      }
      if (sortBy === "amount-asc") {
            return [...transactions].sort((a, b) => a.amount - b.amount);
      }
      return transactions;
}