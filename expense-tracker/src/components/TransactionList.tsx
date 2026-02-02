import React from "react";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "../model/types";

interface TransactionListProps {
      transactions: Array<Transaction>;
}

export function TransactionList(props: TransactionListProps) {
      return (
            <ul id="transaction-list">
                  {props.transactions.map((t) => {
                        return (
                              <TransactionItem key={t.id} transaction={t} />
                        );
                  })}
            </ul>
      );
}