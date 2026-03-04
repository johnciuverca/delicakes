import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccountName, useEmail } from "../state/AppContext";
import { useStylesheet } from "../hooks/StyleHooks";

export function ProfilePage(): React.JSX.Element {

    useStylesheet("/style/profile.css");

    const navigate = useNavigate();
    const [accountName, setAccountName] = useAccountName();
    const [email, setEmail] = useEmail();
    
    
    return (
        <div className="form-wrapper profile page">
            <div className="profile-card">
                <div className="profile-divider"/>

                <section className="profile-content">
                    <div className="profile-image-box">
                        <img 
                            className="profile-image"
                            src="/profile-image-placehoder.png"
                            alt="Profile"
                        />
                    </div>

                    <div className="profile-info">
                        <p><strong>Name:</strong> {accountName ?? "-"}</p>
                        <p><strong>Email:</strong> {email ?? "-"}</p>

                        <button 
                            className="profile-btn"
                            onClick={() => navigate("/change-password")}
                        >
                            Change Password
                        </button>

                        <button 
                            className="profile-btn logout-btn"
                                onClick={() => {
                                    fetch("/logout", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    }).then((res) => {
                                        if (res.status === 200) {
                                            setAccountName(null);
                                            setEmail(null);
                                            navigate("/login"); 
                                            return;
                                        }
                                    });
                                }}
                            >
                            Logout
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );    
}