import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "./Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { RecipesPage } from "./pages/RecipesPage";
import { LoginPage } from "./pages/LoginPage";

export function App(): React.JSX.Element {
  return (
    <Layout>
      {/* <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pages/login.html" element={<LoginPage />} />
        <Route path="/pages/about.html" element={<AboutPage />} />
        <Route path="/pages/contact.html" element={<ContactPage />} />
        <Route path="/pages/recipes.html" element={<RecipesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes> */}
    </Layout>
  );
}
