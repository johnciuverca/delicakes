import { useLocation } from 'react-router-dom';
import { NavAnchor } from './NavAnchor';

interface NavLinkItem {
  label: string;
  href: string;
  external?: boolean;
}


const leftLinks: NavLinkItem[] = [
  { label: "Recipes", href: "/pages/recipes.html" },
  { label: "About", href: "/pages/about.html" },
];

const rightLinks: NavLinkItem[] = [
  { label: "Contact", href: "/pages/contact.html" },
  { label: "Expense-Tracker", href: "/expense-tracker", external: true },
];

export function NavBar(): React.JSX.Element {
      const { pathname: currentPath } = useLocation();
      return (
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
      );
}
