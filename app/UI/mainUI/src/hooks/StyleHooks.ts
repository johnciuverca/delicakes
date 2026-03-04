import { useEffect } from "react";

export function useStylesheet(href: string): void {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);
}