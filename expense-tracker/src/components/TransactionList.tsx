import React, { useEffect } from "react";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "../model/types";
import { dataProvider } from "../providers/dataProvider";

export function TransactionList() {
      const [transactions, setTransactions] = React.useState<Array<Transaction>>([]);

      useEffect(() => {
            dataProvider.readAll().then(transactionArray => {
                  setTransactions(transactionArray);
            });
      }, []);

      return (
            <ul id="transaction-list">
                  {transactions.map((t) => {
                        return (
                              <TransactionItem
                                    key={t.id}
                                    transaction={t}
                                    editTransaction={() => { }}
                                    onRemove={() => { }}
                              />
                        );
                  })}
            </ul>
      );
}
