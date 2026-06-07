import { useAuth } from '../context/AuthContext';

export function SignInPrompt({ message }: { message: string }) {
  const { openAuthModal } = useAuth();
  return (
    <div className="empty-state">
      <p>{message}</p>
      <button className="button" onClick={openAuthModal}>
        Sign in
      </button>
    </div>
  );
}
