import React, { useMemo } from "react";
import TransactionItem from "./TransactionItem";
import { sortTransactions } from "../utils/sorting";
import { filterByContains } from "../utils/filter";
import { useTransactions } from "../state/AppContext";

interface TransactionListProps {
      filterBy: string;
      sortBy: string;
}

export function TransactionList(props: TransactionListProps) {
      const transactions = useTransactions();

      const displayableTransactions = useMemo(() => {
            const filteredTransactions = filterByContains(transactions, props.filterBy);
            const sortedTransactions = sortTransactions(filteredTransactions, props.sortBy);
            return sortedTransactions;
      }, [props.sortBy, props.filterBy]);
      
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



