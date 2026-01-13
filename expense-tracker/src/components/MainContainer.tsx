import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import BalanceContainer from "./BalanceContainer";
import type { Transaction } from "../model/types";
import { dataProvider } from "../providers/dataProvider";
import NewComponent from "./NewComponent";

const MainContainer = () => {
      const [count, setCount] = useState(0);
      const [transactions, setTransactions] = useState<Transaction[]>([]);

      useEffect(() => {
            console.log("Component mounted!");
            dataProvider.readAll().then((records: Transaction[]) => {
                  setTransactions(records);
            });
      }, []);

      return (
            <div className="container">
                  <NavBar />
                  <BalanceContainer transactions={transactions} />
                  <button onClick={(e: any) => {
                        e.preventDefault();
                        setCount(count + 1);
                  }}>
                        Click me!
                  </button>
                  <div>Count is: {count}</div>
                  <NewComponent />
            </div>
      );
}

export default MainContainer;