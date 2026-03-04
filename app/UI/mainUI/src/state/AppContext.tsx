import React from "react";

type User = {
    accountName: string | null;
    email: string | null;
};

type AppContextType = {
	accountName: string | null;
    setAccountName: (name: string | null) => void;
    email: string | null;
    setEmail: (email: string | null) => void;
    user: User;
    setUser: (user: User) => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);

export function useUserState(): [User, (user: User) => void] {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useUserState must be used within an AppContext.Provider");
    }
    const { accountName, setAccountName, email, setEmail } = context;
    const user: User = { accountName, email };
    const setUser = (user: User) => {
        setAccountName(user.accountName);
        setEmail(user.email);
    };
    return [user, setUser];
}

export function useAccountName(): [(string | null), ((name: string | null) => void)] {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useAccountName must be used within an AppContext.Provider");
    }
    return [context.accountName, context.setAccountName];
}

export function useEmail(): [(string | null), ((email: string | null) => void)] {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useEmail must be used within an AppContext.Provider");
    }
    return [context.email, context.setEmail];
}
