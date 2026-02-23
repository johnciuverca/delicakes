import { useState } from "react";
import { useLoginStylesheet } from "../hooks/LoginStylesheet";

export function RegisterPage() {
    useLoginStylesheet();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

	const onSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
	}

	return (
        <div className="form-wrapper">
            <form className="login-form" onSubmit={onSubmit}>
                <div className="form-container">
                    <h2>Register</h2>
                        <label htmlFor="name">Name</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" />
                        <label htmlFor="email">Email</label><input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
                        <label htmlFor="password">Password</label><input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                        <label htmlFor="confirmPassword">Confirm Password</label><input id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" />
                        <button type="submit">Register</button>
                </div>
            </form>
        </div>
	);
}