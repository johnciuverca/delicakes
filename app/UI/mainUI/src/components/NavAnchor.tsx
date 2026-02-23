import { Link } from "react-router-dom";
import { NavLinkItem } from "./shared";

export default function NavAnchor({ item, currentPath }: { item: NavLinkItem; currentPath: string }): React.JSX.Element {
    const isActive = currentPath.replace(/\/+$/, "") === item.href.replace(/\/+$/, "");
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

