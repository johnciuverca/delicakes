import React from "react";
import { NavBar } from "./components/NavBar";
import { Header } from "./components/Header";

type Props = {
  children: React.ReactNode;
};

export function Layout({ children }: Props): React.JSX.Element {

  return (
    <div className="container">
      <Header/>
      <NavBar/>
      <div className="main">{children}</div>
    </div>
  );
}
