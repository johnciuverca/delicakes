import React from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

type NavLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const leftLinks: NavLinkItem[] = [
  { label: "Recipes", href: "/pages/recipes.html" },
  { label: "About", href: "/pages/about.html" },
];

const rightLinks: NavLinkItem[] = [
  { label: "Contact", href: "/pages/contact.html" },
  { label: "Expense-Tracker", href: "/expense-tracker", external: true },
];

function NavAnchor({ item, currentPath }: { item: NavLinkItem; currentPath: string }): React.JSX.Element {
  const isActive = !item.external && currentPath.replace(/\/+$/, "") === item.href.replace(/\/+$/, "");

  if (item.external) {
    return <a href={item.href}>{item.label}</a>;
  }

  return (
    <Link
      to={item.href}
      aria-current={isActive ? "page" : undefined}
      className={isActive ? "active" : undefined}
    >
      {item.label}
    </Link>
  );
}

export function Layout({ children }: Props): React.JSX.Element {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="container">
      <header className="header-flex">
        <h1>
          <Link to="/" className="home-link" style={{ color: "inherit", textDecoration: "none" }}>
            Delicakes
            <span className="tooltip">Home</span>
          </Link>
        </h1>
        <div className="social-icons">
          <a href="https://instagram.com" target="_blank" aria-label="Instagram" rel="noreferrer">
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
              alt="Instagram"
              width="32"
              height="32"
            />
          </a>
          <a href="https://facebook.com" target="_blank" aria-label="Facebook" rel="noreferrer">
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
              alt="Facebook"
              width="32"
              height="32"
            />
          </a>
          <a href="https://tiktok.com" target="_blank" aria-label="TikTok" rel="noreferrer">
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg"
              alt="TikTok"
              width="32"
              height="32"
            />
          </a>
        </div>
      </header>

      <nav className="navbar">
        <div className="left-links">
          {leftLinks.map((item) => (
            <NavAnchor key={item.href} item={item} currentPath={currentPath} />
          ))}
        </div>
        <div className="right-links">
          {rightLinks.map((item) => (
            <NavAnchor key={item.href} item={item} currentPath={currentPath} />
          ))}
        </div>
      </nav>

      <div className="main">{children}</div>
    </div>
  );
}
