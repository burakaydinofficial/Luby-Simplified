import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useDispatch } from 'react-redux';
import { api, TOKEN_KEY, useGetMeQuery } from '../store/api';
import type { User } from '../lib/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  /** Store the token after a successful login/register; runs any pending gated action. */
  login: (token: string) => void;
  logout: () => void;
  /** Run `action` if signed in; otherwise open the auth modal and run it after login. */
  requireAuth: (action?: () => void) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

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
    setAuthModalOpen(false);
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    dispatch(api.util.resetApiState());
  }, [dispatch]);

  const requireAuth = useCallback((action?: () => void) => {
    if (localStorage.getItem(TOKEN_KEY)) {
      action?.();
    } else {
      pendingAction.current = action ?? null;
      setAuthModalOpen(true);
    }
  }, []);

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);

  const closeAuthModal = useCallback(() => {
    pendingAction.current = null;
    setAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading: !!token && isLoading,
        authModalOpen,
        login,
        logout,
        requireAuth,
        openAuthModal,
        closeAuthModal,
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
