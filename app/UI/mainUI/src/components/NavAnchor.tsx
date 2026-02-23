import { Link, useNavigate } from "react-router-dom";
import { NavLinkItem } from "./shared";
import { useMemo } from "react";
import { setAuthenticatedState } from "../App";

export function NavAnchor({ item, currentPath }: { item: NavLinkItem; currentPath: string }): React.JSX.Element {
    const isActive = currentPath.replace(/\/+$/, "") === item.href.replace(/\/+$/, "");

    const navigate = useNavigate();

    const uiElement = useMemo(() => {
        if (item.label === "Logout") {
            return (
                <Link
                    to={currentPath}
                    aria-current={isActive ? "page" : undefined}
                    className={isActive ? "active" : undefined}
                    onClick={()=> {
                        fetch("/logout", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }).then((res) => {
                            if (res.status === 200) {
                                if(setAuthenticatedState === null) {
                                    alert("Logout failed. Please try again.");
                                    return;
                                }
                                setAuthenticatedState(false);
                                navigate("/login");
                                return;
                            }
                        });
                    }}
                >
                    {item.label}
                </Link>
            );
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
    }, [item, isActive]);
    
    return uiElement;;
}

