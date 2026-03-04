import { useState } from "react";
import { useStylesheet } from "../hooks/StyleHooks";

export function RegisterPage() {

    useStylesheet("/style/login.css");
    
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

	const onSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
        if(!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }
        if(password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        }).then((res) => {
            if (res.status === 201) {
                alert("Registration successful! Please log in.");
                return;
            }
            if (res.status === 400) {
                alert("Registration failed. Please check your input and try again.");
                return;
            }
            alert("Registration failed. Please try again.");
        }).catch(() => {
            alert("Registration failed. Please try again.");
        });
    };



	return (
        <div className="form-wrapper">
            <form className="login-form" onSubmit={onSubmit}>
                <div className="form-container">
                    <h2>Register</h2>
                        <label htmlFor="name">Name</label>
                        <input 
                            id="name"
                            value={name}
                            type="text"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email"
                            value={email}
                            type="text"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password"
                            value={password}
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            id="confirmPassword" 
                            value={confirmPassword} 
                            type="password" 
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                        <button type="submit">Register</button>
                </div>
            </form>
        </div>
	);
}