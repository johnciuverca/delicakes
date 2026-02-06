import React, { createContext, useCallback, useEffect, useState } from "react";
import NavBar from "./NavBar";
import BalanceContainer from "./BalanceContainer";
import type { Transaction } from "../model/types";
import { dataProvider } from "../providers/dataProvider";
import MainContent from "./MainContent";

type AppContextType = {
      transactions: Transaction[];
      refreshList: () => void;
      onRemove: (id: string) => void;
      editTransaction: (id: string, description: string, amount: number, recordDate: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const useRefreshList = () => {
      const context = React.useContext(AppContext);
      if (!context) {
            throw new Error("useRefreshList must be used within an AppContext.Provider");
      }
      return context.refreshList;
};
export const useRemoveItem = () => {
      const context = React.useContext(AppContext);
      if (!context) {
            throw new Error("useRemoveItem must be used within an AppContext.Provider");
      }
      return context.onRemove;
};
export const useEditTransaction = () => {
      const context = React.useContext(AppContext);
      if (!context) {
            throw new Error("useEditTransaction must be used within an AppContext.Provider");
      }
      return context.editTransaction;
};

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

      return (
            <AppContext value={{
                  transactions,
                  refreshList,
                  onRemove,
                  editTransaction
            }}>
                  <div className="container">
                        <NavBar />
                        <BalanceContainer transactions={transactions} />
                        <MainContent transactions={transactions} />
                  </div>
            </AppContext>
      );
}

export default MainContainer;