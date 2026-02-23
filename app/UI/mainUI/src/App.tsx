import React from "react";
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

export let setAuthenticatedState: React.Dispatch<React.SetStateAction<boolean>> | null = null;

export function setAuthenticatedSetter(setter: React.Dispatch<React.SetStateAction<boolean>>): void {
    setAuthenticatedState = setter;
}

export function App(): React.JSX.Element {
  return (  
    <div className="container">
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
            </Routes>
        </BrowserRouter>
    </div>
  );
}
