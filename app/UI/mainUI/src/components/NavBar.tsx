import { useLocation } from 'react-router-dom';
import NavAnchor from './NavAnchor';
import { NavLinkItem } from './shared';
import { useEffect, useMemo, useState } from 'react';
import { AppContext, useAccountName } from '../state/AppContext';
import React from 'react';

const leftLinks: NavLinkItem[] = [
    { label: "Recipes", href: "/pages/recipes", position: "left" },
    { label: "About", href: "/pages/about", position: "left" },
];

const rightLinks: NavLinkItem[] = [
    { label: "Contact", href: "/pages/contact", position: "right" },
];

const loginLink: NavLinkItem = { label: "Login", href: "/login", position: "right" };
const profileLink: NavLinkItem = { label: `Hi, USER!`, href: "/profile", position: "right" };

const links : Array<NavLinkItem> = [
    ...leftLinks,
    ...rightLinks
];

export function NavBar(): React.JSX.Element {

    const accountName = useAccountName();
    const { pathname: currentPath } = useLocation();
    const [authenticated, setAuthenticated] = useState(false);
    
    const customizedProfileLink = useMemo(() => {
        const name = accountName || "USER";
        return { ...profileLink, label: `Hi, ${name}!` };
    }, [profileLink, accountName]);
    
    const authLink = useMemo(() => authenticated ? customizedProfileLink : loginLink, [authenticated]);
    const displayLinks = useMemo(() => [...links, authLink], [links, authLink]);
    
    const displayLeftLinks = useMemo(() => displayLinks.filter(link => link.position === 'left'), [displayLinks]);
    const displayRightLinks = useMemo(() => displayLinks.filter(link => link.position === 'right'), [displayLinks]);
    
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
