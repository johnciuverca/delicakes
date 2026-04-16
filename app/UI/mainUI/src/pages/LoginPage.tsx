import React, { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStylesheet } from '../hooks/StyleHooks';
import { useUserState } from '../state/AppContext';

type LoginResponse = {
  user: { name: string; email: string; role: 'user' | 'admin' };
};

export function LoginPage(): React.JSX.Element {
  useStylesheet('/style/login.css');

  const navigate = useNavigate();
  const [email, setEmail] = useState('john');
  const [password, setPassword] = useState('0000');

  const canSubmit = useMemo(() => email.length > 0, [email]);

  const [, setLoggedInUser] = useUserState();

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit) return;

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email,
          psw: password,
        }),
      })
        .then(async (res) => {
          if (!res.redirected && res.status === 200) {
            const data = (await res.json()) as LoginResponse;

            console.log('Login successful:', data);

            setLoggedInUser({
              accountName: data.user.name,
              email: data.user.email,
              role: data.user.role, // Assuming role is returned in this response
            });

            navigate('/', { replace: true });
            return;
          }

          if (res.status === 401) {
            alert('Unauthorized: Incorrect password.');
            return;
          }

          alert('Login failed. Please try again.');
        })
        .catch(() => {
          alert('Login failed. Please try again.');
        });
    },
    [email, password, canSubmit],
  );

  return (
    <div className="form-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
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
            {'Not registered?  '}
            <Link to="/register">Create an account</Link>
          </span>
        </div>
      </form>
    </div>
  );
}
