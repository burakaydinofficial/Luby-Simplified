import { useState, type FormEvent } from 'react';
import { Plus, ListMusic } from 'lucide-react';
import { Modal } from './Modal';
import { useAuth } from '../context/AuthContext';
import {
  useAddPlaylistItemMutation,
  useCreatePlaylistMutation,
  useGetPlaylistsQuery,
} from '../store/api';
import type { Lullaby } from '../lib/types';
import './AddToPlaylistButton.css';

export function AddToPlaylistButton({ lullaby }: { lullaby: Lullaby }) {
  const { requireAuth } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    requireAuth(() => setOpen(true));
  };

  return (
    <>
      <button className="icon-button" onClick={handleClick} aria-label="Add to playlist">
        <Plus size={18} />
      </button>
      {open && <AddToPlaylistDialog lullaby={lullaby} onClose={() => setOpen(false)} />}
    </>
  );
}

function AddToPlaylistDialog({ lullaby, onClose }: { lullaby: Lullaby; onClose: () => void }) {
  const { data: playlists, isLoading } = useGetPlaylistsQuery();
  const [createPlaylist, createState] = useCreatePlaylistMutation();
  const [addItem] = useAddPlaylistItemMutation();
  const [newName, setNewName] = useState('');

  const addToExisting = async (playlistId: string) => {
    await addItem({ playlistId, lullabyId: lullaby.id });
    onClose();
  };

  const createAndAdd = async (event: FormEvent) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const playlist = await createPlaylist({ name }).unwrap();
    await addItem({ playlistId: playlist.id, lullabyId: lullaby.id });
    onClose();
  };

  return (
    <Modal title={`Add "${lullaby.title}"`} onClose={onClose}>
      <form className="create-playlist-form" onSubmit={createAndAdd}>
        <input
          placeholder="New playlist name"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          maxLength={80}
        />
        <button className="button" type="submit" disabled={createState.isLoading || !newName.trim()}>
          Create
        </button>
      </form>

      <div className="playlist-pick-list">
        {isLoading ? (
          <p className="muted">Loading…</p>
        ) : playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <button
              key={playlist.id}
              className="playlist-pick"
              onClick={() => addToExisting(playlist.id)}
            >
              <ListMusic size={18} />
              <span className="playlist-pick-name">{playlist.name}</span>
              <span className="muted">{playlist._count?.items ?? 0}</span>
            </button>
          ))
        ) : (
          <p className="muted">No playlists yet — create one above.</p>
        )}
      </div>
    </Modal>
  );
}
