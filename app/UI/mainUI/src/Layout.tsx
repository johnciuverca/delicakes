import React from "react";
import { NavBar } from "./components/NavBar";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecipesPage } from "./pages/RecipesPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { AboutPage } from "./pages/AboutPage";

type Props = {
  children?: React.ReactNode;
};

export function Layout({ children }: Props): React.JSX.Element {
  
  return (
    
  );
}
