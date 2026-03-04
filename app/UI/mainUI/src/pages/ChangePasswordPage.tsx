import React, { useCallback } from "react";
import { FormInput } from "../components/FormInput";
import { useStylesheet } from "../hooks/StyleHooks";

export function ChangePasswordPage() {

    useStylesheet("/style/login.css");

    const onSubmit = useCallback( (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }, []);

    return (
        <div className="form-wrapper">
            <form className="changePassword-form" onSubmit={onSubmit}>
                <div className="form-container">
                    <h2>Change Password</h2>
                    <FormInput 
                        id="currentPassword" 
                        inputType="password" 
                        placeholder="Current Password" 
                    />
                    <FormInput 
                        id="newPassword"
                        inputType="password"
                        placeholder="New Password"
                    />
                    <FormInput
                        id="confirmPassword"
                        inputType="password"
                        placeholder="Confirm Password"
                    />
                    <button type="submit">Change Password</button>
                </div>
            </form>
        </div>
    );
}