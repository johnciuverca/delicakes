import { Link } from "react-router-dom";
import { NavLinkItem } from "./shared";


export function NavAnchor({ item, currentPath }: { item: NavLinkItem; currentPath: string }): React.JSX.Element {
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

