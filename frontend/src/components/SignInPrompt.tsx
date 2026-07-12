import { useModal } from '../context/ModalContext';

export function SignInPrompt({ message }: { message: string }) {
  const { open } = useModal();
  return (
    <div className="empty-state">
      <p>{message}</p>
      <button className="button" onClick={() => open({ type: 'auth' })}>
        Sign in
      </button>
    </div>
  );
}
