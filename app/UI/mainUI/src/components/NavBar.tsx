import { useLocation } from 'react-router-dom';
import NavAnchor from './NavAnchor';
import { NavLinkItem } from './shared';
import { useMemo } from 'react';
import React from 'react';
import { useUserState } from '../state/AppContext';

const leftLinks: NavLinkItem[] = [
  { label: 'Recipes', href: '/recipes', position: 'left' },
  { label: 'About', href: '/about', position: 'left' },
];

const rightLinks: NavLinkItem[] = [{ label: 'Contact', href: '/contact', position: 'right' }];

const loginLink: NavLinkItem = { label: 'Login', href: '/login', position: 'right' };
const profileLink: NavLinkItem = { label: `Hi, USER!`, href: '/profile', position: 'right' };

const links: Array<NavLinkItem> = [...leftLinks, ...rightLinks];

export function NavBar(): React.JSX.Element {
  const { pathname: currentPath } = useLocation();
  const [loggedInUser] = useUserState();

  const customizedProfileLink = useMemo(() => {
    const name = loggedInUser?.accountName || 'USER';
    return { ...profileLink, label: `Hi, ${name}!` };
  }, [profileLink, loggedInUser?.accountName]);

  const authLink = useMemo(
    () => (loggedInUser?.accountName ? customizedProfileLink : loginLink),
    [loggedInUser?.accountName, customizedProfileLink],
  );

  const displayLinks = useMemo(() => [...links, authLink], [links, authLink]);

  const displayLeftLinks = useMemo(
    () => displayLinks.filter((link) => link.position === 'left'),
    [displayLinks],
  );
  const displayRightLinks = useMemo(
    () => displayLinks.filter((link) => link.position === 'right'),
    [displayLinks],
  );

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
