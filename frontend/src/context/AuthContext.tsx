import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useDispatch } from 'react-redux';
import { api, TOKEN_KEY, useGetMeQuery } from '../store/api';
import { useModal } from './ModalContext';
import type { User } from '../lib/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  // The current user is always derived from the server (validates the token).
  const { data: user, isLoading, isError } = useGetMeQuery(undefined, { skip: !token });

  // Drop an invalid/expired token.
  useEffect(() => {
    if (token && isError) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    }
  }, [token, isError]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    dispatch(api.util.resetApiState());
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading: !!token && isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

// Run `action` if signed in; otherwise open the auth modal and run it after a successful login.
export function useRequireAuth() {
  const { open } = useModal();
  return useCallback(
    (action?: () => void) => {
      if (localStorage.getItem(TOKEN_KEY)) {
        action?.();
      } else {
        open({ type: 'auth', onSuccess: action });
      }
    },
    [open],
  );
}
