import React, { useCallback, useEffect, useMemo, useState } from "react";

type LoginResponse = {
  authCookie: string;
};

function useLoginStylesheet(): void {
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

export function LoginPage(): React.JSX.Element {
  useLoginStylesheet();
  
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");
  
  const canSubmit = useMemo(() => role.length > 0, [role]);
  
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit) return;

        fetch("/expense-tracker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            psw: password,
          }),
        })
          .then(async (res) => {
            if (!res.redirected && res.status === 200) {
              const data = (await res.json()) as LoginResponse;
            //  document.cookie = `auth=${data.authCookie}; path=/`;
              window.location.href = "/expense-tracker";
              return;
            }

            if (res.status === 401) {
              alert("Unauthorized: Incorrect password.");
              return;
            }

            alert("Login failed. Please try again.");
          })
          .catch(() => {
            alert("Login failed. Please try again.");
          });
  }, [role, password, canSubmit]);


  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      <div className="form-container">
        <label htmlFor="role">
          <b>Role</b>
        </label>
        <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="audit">Audit</option>
        </select>

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
        <div>Not registered? 
            {/* <link href="/">Create an account</link> */}
        </div>
      </div>
    </form>
  );
}
