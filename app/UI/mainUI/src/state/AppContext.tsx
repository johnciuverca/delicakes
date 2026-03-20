import React from "react";
import { User } from "../types/user";

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
    return [context.user, context.setUser];
}
