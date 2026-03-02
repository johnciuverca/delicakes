import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccountName } from "../state/AppContext";

export function ProfilePage(): React.JSX.Element {
    const navigate = useNavigate();
    const [_accountName, setAccountName] = useAccountName();
    
    return (
        <>
            <button
                onClick={() => {
                    fetch("/logout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then((res) => {
                        if (res.status === 200) {
                            setAccountName(null);
                            navigate("/login"); 
                            return;
                        }
                    });
                }}
            >
                Logout
            </button>
        </>
    );
}1