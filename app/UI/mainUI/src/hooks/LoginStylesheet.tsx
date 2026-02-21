import { useEffect } from "react";


export function useLoginStylesheet(): void {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/style/login.css";
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);
}