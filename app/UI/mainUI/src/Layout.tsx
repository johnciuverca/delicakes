import React from "react";
import { NavBar } from "./components/NavBar";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";

type Props = {
  children?: React.ReactNode;
};

export function Layout({ children }: Props): React.JSX.Element {
  const [content, setContent] = React.useState<React.ReactNode>(<HomePage/>);
  
  return (
    <div className="container">
      <Header/>
      <NavBar setContent={setContent} />
      <div>{content}</div>
    </div>
  );
}
