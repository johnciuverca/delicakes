import React from "react";

type AppContextType = {
	accountName: string | null;
    setAccountName: (name: string | null) => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);

export function useAccountName(): [(string | null), ((name: string | null) => void)] {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useAccountName must be used within an AppContext.Provider");
    }
    return [context.accountName, context.setAccountName];
}
