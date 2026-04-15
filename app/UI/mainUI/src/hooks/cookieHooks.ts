import React from 'react';
import { User } from '../types/user';

const userCookieName = 'user';

function getUserCookie(): User | null {
  const match = document.cookie.match(new RegExp('(^| )' + userCookieName + '=([^;]+)'));
  const cookieValue = match ? decodeURIComponent(match[2]) : null;
  if (cookieValue) {
    try {
      return JSON.parse(cookieValue) as User;
    } catch (e) {
      console.error('Failed to parse user cookie:', e);
      return null;
    }
  }
  return null;
}

function setUserCookie(user: User | null): void {
  if (user) {
    const cookieValue = JSON.stringify(user);
    const encodedValue = encodeURIComponent(cookieValue);
    document.cookie = `${userCookieName}=${encodedValue}; path=/; max-age=${60 * 60 * 24 * 1}`;
  } else {
    document.cookie = `${userCookieName}=; path=/; max-age=0`;
  }
}

export function useUserCookie(): [User | null, (user: User | null) => void] {
  const [user, setUserInternal] = React.useState<User | null>(getUserCookie);
  const setUser = React.useCallback((user: User | null) => {
    setUserCookie(user);
    const cookieUser = getUserCookie();
    setUserInternal(cookieUser);
  }, []);
  return [user, setUser];
}
