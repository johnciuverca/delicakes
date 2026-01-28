import React, { useCallback, useEffect, useState } from "react";
import NavBar from "./NavBar";
import BalanceContainer from "./BalanceContainer";
import type { Transaction } from "../model/types";
import { dataProvider } from "../providers/dataProvider";
import MainContent from "./MainContent";

const MainContainer = () => {
      const [count, setCount] = useState(0);
      const [transactions, setTransactions] = useState<Transaction[]>([]);

      const refreshList = useCallback(() => {
            dataProvider.readAll().then((records: Transaction[]) => {
                  setTransactions(records);
            });
      }, []);

      const onRemove = useCallback((id: string) => {
            dataProvider.remove(id).then(() => {
                  refreshList();
            });
      }, [refreshList]);

      useEffect(() => {
            const timer = setInterval(() => {
                  setCount((prevCount) => prevCount + 1);
            }, 1000);

            return () => clearInterval(timer);
      }, []);

      useEffect(() => {
            console.log("Component mounted!");
            refreshList();
      }, []);

      return (
            <div className="container">
                  <NavBar />
                  <BalanceContainer transactions={transactions} />
                  <MainContent transactions={transactions} refreshList={refreshList} onRemove={onRemove} />
            </div>
      );
}

export default MainContainer;