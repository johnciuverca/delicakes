import React, { useEffect } from "react";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "../model/types";
import { dataProvider } from "../providers/dataProvider";

interface TransactionListProps {
      transactions: Array<Transaction>;
      onRemove: (id: string) => void;
      editTransaction: (id: string, description: string, amount: number, recordDate: string) => void;

}

export function TransactionList(props: TransactionListProps) {
      // const [transactions, setTransactions] = React.useState<Array<Transaction>>([]);

      // useEffect(() => {
      //       dataProvider.readAll().then(transactionArray => {
      //             setTransactions(transactionArray);
      //       });
      // }, []);

      return (
            <ul id="transaction-list">
                  {props.transactions.map((t) => {
                        return (
                              <TransactionItem
                                    key={t.id}
                                    transaction={t}
                                    onRemove={props.onRemove}
                                    editTransaction={props.editTransaction}
                              />
                        );
                  })}
            </ul>
      );
}