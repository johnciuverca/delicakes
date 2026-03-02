import React, { useCallback, useEffect, useState } from "react";
import NavBar from "./NavBar";
import BalanceContainer from "./BalanceContainer";
import type { Transaction } from "../model/types";
import { dataProvider } from "../providers/dataProvider";
import MainContent from "./MainContent";
import { AppContext } from "../state/AppContext";

const MainContainer = () => {
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

      const editTransaction = useCallback((id: string, description: string, amount: number, recordDate: string) => {
            dataProvider.update(id, { description, amount, recordDate }).then(() => {
                  refreshList();
            });
      }, [refreshList]);

      useEffect(() => {
            refreshList();
      }, [refreshList]);

      return (
            <AppContext value={{
                  transactions,
                  refreshList,
                  onRemove,
                  editTransaction
            }}>
                  <div className="container">
                        <NavBar />
                        <BalanceContainer/>
                        <MainContent/>
                  </div>
            </AppContext>
      );
}

export default MainContainer;