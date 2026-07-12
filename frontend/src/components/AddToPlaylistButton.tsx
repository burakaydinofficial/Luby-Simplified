import { Plus } from 'lucide-react';
import { useRequireAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import type { Lullaby } from '../lib/types';

// Just a trigger — the actual modal is rendered once at the app root (ModalHost).
export function AddToPlaylistButton({ lullaby }: { lullaby: Lullaby }) {
  const requireAuth = useRequireAuth();
  const { open } = useModal();

  return (
    <button
      className="icon-button"
      onClick={() => requireAuth(() => open({ type: 'addToPlaylist', lullaby }))}
      aria-label="Add to playlist"
    >
      <Plus size={18} />
    </button>
  );
}
