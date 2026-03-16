import React from "react";

type User = {
    accountName: string;
    email: string;
};

type AppContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const userCookieName = "user";
function setUserCookie(user: User | null) {
    if (user) {
        // Set cookie (expires in 7 days, adjust as needed)
        const cookieValue = JSON.stringify(user);
        document.cookie = `${userCookieName}=${encodeURIComponent(cookieValue)}; path=/; max-age=${60 * 60 * 24 * 1}`;
    } else {
        // Remove cookie
        document.cookie = `${userCookieName}=; path=/; max-age=0`;
    }
}

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
        setUserCookie(user);
        context.setUser(user);
    };
    return [user, setUser];
}
