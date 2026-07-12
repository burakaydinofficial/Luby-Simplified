import { useState, type FormEvent } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../context/AuthContext';
import { useLoginMutation, useRegisterMutation } from '../store/api';
import { getApiErrorMessage } from '../lib/apiError';
import './AuthModal.css';

type Mode = 'login' | 'signup';

interface AuthModalProps {
  /** Ran once after a successful login (e.g. the gated action that opened this). */
  onSuccess?: () => void;
  onClose: () => void;
}

export function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [loginMutation, loginState] = useLoginMutation();
  const [registerMutation, registerState] = useRegisterMutation();
  const submitting = loginState.isLoading || registerState.isLoading;

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const result =
        mode === 'login'
          ? await loginMutation({ email, password }).unwrap()
          : await registerMutation({ email, password, displayName }).unwrap();
      login(result.token);
      // Close first; if the gated action opens another modal, it takes over.
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(getApiErrorMessage(err) ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <Modal title={mode === 'login' ? 'Welcome back' : 'Create your account'} onClose={onClose}>
      <p className="auth-subtitle muted">Sign in to like lullabies and build playlists.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="auth-field">
            <label htmlFor="auth-name">Name</label>
            <input
              id="auth-name"
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
              autoComplete="name"
            />
          </div>
        )}
        <div className="auth-field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="auth-field">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="button auth-submit" type="submit" disabled={submitting}>
          {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Sign up'}
        </button>
      </form>

      <p className="auth-switch muted">
        {mode === 'login' ? (
          <>
            New here?{' '}
            <button type="button" className="auth-link" onClick={() => switchMode('signup')}>
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" className="auth-link" onClick={() => switchMode('login')}>
              Sign in
            </button>
          </>
        )}
      </p>
    </Modal>
  );
}
