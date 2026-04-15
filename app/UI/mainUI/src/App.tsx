import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { RecipesPage } from './pages/RecipesPage';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfiePage';
import { AppContext } from './state/AppContext';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { User } from './types/user';

type MeResponse = {
  user: { name: string; email: string; role: 'user' | 'admin' };
};

export function App(): React.JSX.Element {
  const [userState, setUserState] = React.useState<User | null>(null);

  React.useEffect(() => {
    fetch('/me', {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then((res) => {
        if (res.status !== 200) {
          setUserState(null);
          return null;
        }
        return res.json();
      })
      .then((data: MeResponse | null) => {
        if (!data) {
          return;
        }
        setUserState({
          accountName: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
      })
      .catch(() => {
        setUserState(null);
      });
  }, []);

  return (
    <div className="container">
      <AppContext
        value={{
          user: userState,
          setUser: setUserState,
        }}
      >
        <BrowserRouter>
          <Header />
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Routes>
        </BrowserRouter>
      </AppContext>
    </div>
  );
}
