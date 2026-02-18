import { useLocation } from 'react-router-dom';
import { NavAnchor } from './NavAnchor';
import { NavLinkItem } from './shared';
import { LoginPage } from '../pages/LoginPage';

type NavBarProps = {
  setContent?: (content: React.JSX.Element) => void;
};

const leftLinks: NavLinkItem[] = [
  { label: "Recipes", href: "/pages/recipes.html" },
  { label: "About", href: "/pages/about.html" },
];

const rightLinks: NavLinkItem[] = [
  { label: "Contact", href: "/pages/contact.html" },
  { label: "Login", href: "/login"},
];

export function NavBar(props: NavBarProps): React.JSX.Element {
      const { pathname: currentPath } = useLocation();
      return (
		  <nav className="navbar">
        <div className="left-links">
          {leftLinks.map((item) => (
            <NavAnchor key={item.href} item={item} currentPath={currentPath} />
          ))}
        </div>
        <div className="right-links">
          <button>Contact</button>
          <button onClick={() => props.setContent ? props.setContent(<LoginPage/>) : null} >Login</button>
          {/* {rightLinks.map((item) => (
            <NavAnchor key={item.href} item={item} currentPath={currentPath} />
          ))} */}
        </div>
      </nav>
      );
}
