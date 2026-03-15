import React, { useCallback } from "react";
import { FormInput } from "../components/FormInput";
import { useStylesheet } from "../hooks/StyleHooks";
import { useUserState } from "../state/AppContext";

export function ChangePasswordPage() {

    useStylesheet("/style/login.css");

    const [loggedInUser, _setLoggedInUser] = useUserState();
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    
    const validateRequired = useCallback((value: string, fieldName: string): string | null => {
        return value || `${fieldName} is required.`;
    }, []);
    
    const validatePasswordMatch = useCallback((newPassword: string , confirmPassword: string): string | null => {
        return confirmPassword !== newPassword ? "Passwords do not match." : null;
    }, []);

    const onSubmit = useCallback( (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // reset error and success state before moving forward
        setError("");
        setSuccess("");

        // Vaidate email, current and new passwords

        if (!loggedInUser?.email) {
            setError("User email is not available.");
            return;
        }
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }
        
        // Pass data to server 
        fetch("/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: loggedInUser.email,
                currentPassword: currentPassword,
                newPassword: newPassword,
            })
        }).then(res => {
            if (!res.ok) {
                return res.json().then(data => {
                    setError(data.message || "Failed to change password.");
                });
            } else {
                setSuccess("Password changed successfully."); 
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        }).catch(() => { 
            setError("Failed to change password.");
        });
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
                        onBlurValidation={value => validateRequired(value, "Current password")}
                    />
                    <FormInput 
                        id="newPassword"
                        inputType="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onBlurValidation={value => validateRequired(value, "New password")}
                    />
                    <FormInput
                        id="confirmPassword"
                        inputType="password"
                        placeholder="Confirm Password"  
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlurValidation={[
                            value => validateRequired(value, "Confirm password"),
                            value => validatePasswordMatch(newPassword, value)
                        ]}
                    />
                    <button type="submit">Change Password</button>
                    {error && <div style={{ color: "red" }} >{error}</div>}
                    {success && <div style={{ color: "green" }} >{success}</div>}
                </div>
            </form>
        </div>
    );
}