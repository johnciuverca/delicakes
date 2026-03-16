import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { RecipesPage } from "./pages/RecipesPage";
import { LoginPage } from "./pages/LoginPage";
import { Header } from "./components/Header";
import { NavBar } from "./components/NavBar";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfiePage";
import { AppContext } from "./state/AppContext";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";

const userCookieName = "user";

function getUserCookie(): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + userCookieName + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export function App(): React.JSX.Element {
    const [userState, setUserState] = React.useState<{ accountName: string, email: string } | null>(null);
    
    useEffect(() => {
        const cookieValue = getUserCookie();
        if (cookieValue) {
            try {
                setUserState(JSON.parse(cookieValue));
            } catch {
                setUserState(null);
            }
        }
    }, []);
    
    return (
    <div className="container">
        <AppContext value={{
            user: userState,
            setUser: setUserState
        }}>
            <BrowserRouter>
                <Header/>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/change-password" element={<ChangePasswordPage/>}/>
                </Routes>
            </BrowserRouter>
        </AppContext>
    </div>
    );
}
