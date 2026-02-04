import React, { useMemo } from "react";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "../model/types";
import { sortTransactions } from "../utils/sorting";
import { filterByContains } from "../utils/filter";

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



