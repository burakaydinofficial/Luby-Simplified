import { useModal } from '../context/ModalContext';
import { AuthModal } from './AuthModal';
import { AddToPlaylistModal } from './AddToPlaylistModal';

// Renders whichever modal is active — once, at the app root (outside the
// transformed cards), so its fixed overlay is positioned against the viewport.
export function ModalHost() {
  const { active, close } = useModal();

  if (!active) {
    return null;
  }
  if (active.type === 'auth') {
    return <AuthModal onSuccess={active.onSuccess} onClose={close} />;
  }
  if (active.type === 'addToPlaylist') {
    return <AddToPlaylistModal lullaby={active.lullaby} onClose={close} />;
  }
  return null;
}
