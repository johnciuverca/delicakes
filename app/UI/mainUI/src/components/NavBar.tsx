import { useLocation } from 'react-router-dom';
import { NavAnchor } from './NavAnchor';
import { NavLinkItem } from './shared';

const leftLinks: NavLinkItem[] = [
  { label: "Recipes", href: "/pages/recipes" },
  { label: "About", href: "/pages/about" },
];

const rightLinks: NavLinkItem[] = [
  { label: "Contact", href: "/pages/contact" },
  { label: "Login", href: "/login"},
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
