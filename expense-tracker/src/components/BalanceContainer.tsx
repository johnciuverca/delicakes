import React, { useMemo } from "react";
import type { Transaction } from "../model/types";

type BalanceContainerProps = {
      transactions: Array<Transaction>;
};

const BalanceContainer = ({ transactions }: BalanceContainerProps) => {
      const sumOfAmounts = useMemo(() => {
            return transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
      }, [transactions]);

      return (
            <div className="balance-container">
                  <h2>Your Balance</h2>
                  {/* <h3 id="balance">$0.00</h3> */}
                  <h3 id="balance">${sumOfAmounts}</h3>
                  <div className="summary">
                        <div className="income">
                              <h3>Income</h3>
                              <p id="income-amount">$0.00</p>
                        </div>
                        <div className="expenses">
                              <h3>Expenses</h3>
                              <p id="expense-amount">$0.00</p>
                        </div>
                  </div>
            </div>
      );
};

export default BalanceContainer;