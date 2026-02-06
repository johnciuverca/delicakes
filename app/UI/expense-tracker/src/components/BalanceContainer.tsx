import React, { useMemo } from "react";
import type { Transaction } from "../model/types";

type BalanceContainerProps = {
      transactions: Array<Transaction>;
};

const BalanceContainer = ({ transactions }: BalanceContainerProps) => {
      const income = useMemo(() => {
            return transactions
                  .filter(t => t.amount > 0)
                  .reduce((acc, t) => acc + Math.abs(t.amount), 0);
      }, [transactions]);

      const expense = useMemo(() => {
            return transactions
                  .filter(t => t.amount < 0)
                  .reduce((acc, t) => acc + Math.abs(t.amount), 0);
      }, [transactions]);

      const balance = income - expense;



      return (
            <div className="balance-container">
                  <h2>Your Balance</h2>
                  {/* <h3 id="balance">$0.00</h3> */}
                  <h3 id="balance">{balance.toFixed(2)}RON</h3>
                  <div className="summary">
                        <div className="income">
                              <h3>Income</h3>
                              <p id="income-amount">{income.toFixed(2)}RON</p>
                        </div>
                        <div className="expenses">
                              <h3>Expenses</h3>
                              <p id="expense-amount">{expense.toFixed(2)}RON</p>
                        </div>
                  </div>
            </div>
      );
};

export default BalanceContainer;