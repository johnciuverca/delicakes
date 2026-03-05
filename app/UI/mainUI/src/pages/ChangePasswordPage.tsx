import React, { useCallback } from "react";
import { FormInput } from "../components/FormInput";
import { useStylesheet } from "../hooks/StyleHooks";

export function ChangePasswordPage() {

    useStylesheet("/style/login.css");

    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const onSubmit = useCallback( (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        // Add logic to change the password here
        setSuccess("Password changed successfully.");
    }, [currentPassword, newPassword, confirmPassword]);

    return (
        <div className="form-wrapper">
            <form className="changePassword-form" onSubmit={onSubmit}>
                <div className="form-container">
                    <h2>Change Password</h2>
                    <FormInput 
                        id="currentPassword" 
                        inputType="password" 
                        placeholder="Current Password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <FormInput 
                        id="newPassword"
                        inputType="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}    
                    />
                    <FormInput
                        id="confirmPassword"
                        inputType="password"
                        placeholder="Confirm Password"  
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Change Password</button>
                    {error && <div style={{ color: "red" }} >{error}</div>}
                    {success && <div style={{ color: "green" }} >{success}</div>}
                </div>
            </form>
        </div>
    );
}