import { createContext } from "react";
import type { Transaction } from "../model/types";
import React from "react";

type AppContextType = {
	transactions: Transaction[];
	refreshList: () => void;
	onRemove: (id: string) => void;
	editTransaction: (id: string, description: string, amount: number, recordDate: string) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

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

export const useTransactions = () => {
    const context = React.useContext(AppContext); 
    if (!context) {
        throw new Error("useTransactions must be used within an AppContext.Provider");
    }
    return context.transactions;
};