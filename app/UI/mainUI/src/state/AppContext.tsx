import React from "react";

type User = {
    accountName: string;
    email: string;
};

type AppContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);

export function useUserState(): [User | null, (user: User | null) => void] {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useUserState must be used within an AppContext.Provider");
    }
    const user = context.user 
        ? { accountName: context.user.accountName, email: context.user.email }
        : null;
        
    const setUser = (user: User | null) => {
        context.setUser(user);
    };
    return [user, setUser];
}
