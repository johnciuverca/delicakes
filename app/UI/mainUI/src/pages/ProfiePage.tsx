import React from "react";
import { setAuthenticatedState } from "../App";
import { useNavigate } from "react-router-dom";

export function ProfilePage(): React.JSX.Element {

    const navigate = useNavigate();
    
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
                Logout
            </button>
        </>
    );
}1