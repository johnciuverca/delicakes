import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useStylesheet } from '../hooks/StyleHooks';
import { useUserState } from '../state/AppContext';

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ChangePasswordPage() {
  useStylesheet('/style/login.css');

  const [loggedInUser] = useUserState();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = useCallback(
    (values: ChangePasswordFormValues) => {
      // reset error and success state before moving forward
      setError('');
      setSuccess('');

      if (!loggedInUser?.email) {
        setError('User email is not available.');
        return;
      }

      // Pass data to server
      fetch('/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loggedInUser.email,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              setError(data.message || 'Failed to change password.');
            });
          } else {
            setSuccess('Password changed successfully.');
            reset();
          }
        })
        .catch(() => {
          setError('Failed to change password.');
        });
    },
    [loggedInUser, reset],
  );

  return (
    <div className="form-wrapper">
      <form className="changePassword-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-container">
          <h2>Change Password</h2>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            placeholder="Current Password"
            {...register('currentPassword', {
              required: 'Current password is required.',
            })}
          />
          {errors.currentPassword?.message && <div>{errors.currentPassword.message}</div>}

          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="New Password"
            {...register('newPassword', {
              required: 'New password is required.',
            })}
          />
          {errors.newPassword?.message && <div>{errors.newPassword.message}</div>}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              required: 'Confirm password is required.',
              validate: (value) => value === newPasswordValue || 'Passwords do not match.',
            })}
          />
          {errors.confirmPassword?.message && <div>{errors.confirmPassword.message}</div>}
          <button type="submit">Change Password</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}
        </div>
      </form>
    </div>
  );
}
