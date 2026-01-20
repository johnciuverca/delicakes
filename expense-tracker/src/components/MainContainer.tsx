import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import BalanceContainer from "./BalanceContainer";
import type { Transaction } from "../model/types";
import { dataProvider } from "../providers/dataProvider";
import MainContent from "./MainContent";
import SandBox from "./SandBox";

const MainContainer = () => {
      const [count, setCount] = useState(0);
      const [transactions, setTransactions] = useState<Transaction[]>([]);

      useEffect(() => {
            const timer = setInterval(() => {
                  setCount((prevCount) => prevCount + 1);
            }, 1000);

            return () => clearInterval(timer);
      }, []);

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
                  <MainContent transactions={transactions} />
            </div>
      );
}

export default MainContainer;