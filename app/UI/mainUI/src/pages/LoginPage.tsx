import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccountName, useEmail } from "../state/AppContext";
import { useStylesheet } from "../hooks/StyleHooks";

type LoginResponse = {
    user: { name: string, email: string };
    authCookie: string;
};

export function LoginPage(): React.JSX.Element {
    useStylesheet("/style/login.css");

    const navigate = useNavigate();
    const [email, setEmail] = useState("admin");
    const [password, setPassword] = useState("0000");

    const canSubmit = useMemo(() => email.length > 0, [email]);

    const [_accountName, setAccountName] = useAccountName();
    const [_accountEmail, setAccountEmail] = useEmail();
    

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) return;

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                psw: password,
            }),
        }).then(async (res) => {
            if (!res.redirected && res.status === 200) {
                const data = (await res.json()) as LoginResponse;
                
                console.log("Login successful:", data);
                
                //  document.cookie = `auth=${data.authCookie}; path=/`;
                setAccountName(data.user.name);
                setAccountEmail(data.user.email);

                navigate("/", { replace: true }); 
                return;
            }

            if (res.status === 401) {
                alert("Unauthorized: Incorrect password.");
                return;
            }

            alert("Login failed. Please try again.");
        }).catch(() => {
            alert("Login failed. Please try again.");
        });
    }, [email, password, canSubmit]);


    return (
        <div className="form-wrapper">
            <form
                className="login-form"
                onSubmit={handleSubmit}
            >
                <div className="form-container">
                    <label htmlFor="email">
                        <b>Email</b>
                    </label>
                    <input
                        id="email"
                        type="text"
                        placeholder="Enter Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="psw">
                        <b>Password</b>
                    </label>
                    <input
                        id="psw"
                        type="password"
                        placeholder="Enter Password"
                        name="psw"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" disabled={!canSubmit}>
                        Login
                    </button>
                    <span>
                        {"Not registered?  "}
                        <Link to="/register">Create an account</Link>
                    </span>
                </div>
            </form>
        </div>
    );
}
