import { useLocation } from 'react-router-dom';
import { NavAnchor } from './NavAnchor';
import { NavLinkItem } from './shared';
import { useMemo, useState } from 'react';

const leftLinks: NavLinkItem[] = [
  { label: "Recipes", href: "/pages/recipes", position: "left" },
  { label: "About", href: "/pages/about", position: "left" },
];

const rightLinks: NavLinkItem[] = [
  { label: "Contact", href: "/pages/contact", position: "right" },
];

const loginLink: NavLinkItem = { label: "Login", href: "/login", position: "right" };
const logoutLink: NavLinkItem = { label: "Logout", href: "/logout", position: "right" };

const links : Array<NavLinkItem> = [
    ...leftLinks,
    ...rightLinks
];

export function NavBar(): React.JSX.Element {
    const { pathname: currentPath } = useLocation();
    
    const [profileLink, setProfileLink] = useState<NavLinkItem>(loginLink);
    const displayLinks = useMemo(() => [...links, profileLink], [links, profileLink]);

    const displayLeftLinks = useMemo(() => displayLinks.filter(link => link.position === 'left'), [links]);
    const displayRightLinks = useMemo(() => displayLinks.filter(link => link.position === 'right'), [links]);
    
    return (
        <nav className="navbar">
            <div className="left-links">
                {displayLeftLinks.map((item) => (
                    <NavAnchor key={item.href} item={item} currentPath={currentPath} />
                ))}
            </div>
            <div className="right-links">
                {displayRightLinks.map((item) => (
                    <NavAnchor key={item.href} item={item} currentPath={currentPath} />
                ))}
            </div>
        </nav>
    );
}
