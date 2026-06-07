import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListMusic, Pencil, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  useDeletePlaylistMutation,
  useGetPlaylistQuery,
  useRemovePlaylistItemMutation,
  useRenamePlaylistMutation,
} from '../store/api';
import { LullabyRow } from '../components/LullabyRow';
import { SignInPrompt } from '../components/SignInPrompt';
import './PlaylistPage.css';

export function PlaylistPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: playlist, isLoading, isError } = useGetPlaylistQuery(id, {
    skip: !isAuthenticated,
  });
  const [renamePlaylist] = useRenamePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [removeItem] = useRemovePlaylistItemMutation();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  if (!isAuthenticated) {
    return <SignInPrompt message="Sign in to view this playlist." />;
  }
  if (isLoading) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }
  if (isError || !playlist) {
    return (
      <div className="page">
        <p className="muted">Playlist not found.</p>
      </div>
    );
  }

  const tracks = playlist.items.map((item) => item.lullaby);

  const startEdit = () => {
    setName(playlist.name);
    setEditing(true);
  };

  const saveEdit = async () => {
    const trimmed = name.trim();
    if (trimmed) {
      await renamePlaylist({ id: playlist.id, name: trimmed });
    }
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete the playlist "${playlist.name}"?`)) return;
    await deletePlaylist(playlist.id).unwrap();
    navigate('/library');
  };

  return (
    <div className="page">
      <div className="collection-hero">
        <div className="collection-cover">
          <ListMusic size={40} />
        </div>
        <div className="stack collection-hero-info">
          <span className="muted">Playlist</span>
          {editing ? (
            <div className="playlist-rename">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                autoFocus
              />
              <button className="icon-button" onClick={saveEdit} aria-label="Save name">
                <Check size={18} />
              </button>
              <button className="icon-button" onClick={() => setEditing(false)} aria-label="Cancel">
                <X size={18} />
              </button>
            </div>
          ) : (
            <h1 className="page-title">{playlist.name}</h1>
          )}
          <span className="muted">{tracks.length} lullabies</span>
        </div>
        {!editing && (
          <div className="collection-actions">
            <button className="icon-button" onClick={startEdit} aria-label="Rename playlist">
              <Pencil size={18} />
            </button>
            <button className="icon-button" onClick={handleDelete} aria-label="Delete playlist">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {tracks.length > 0 ? (
        <div className="track-list">
          {playlist.items.map((item) => (
            <LullabyRow
              key={item.id}
              lullaby={item.lullaby}
              queue={tracks}
              onRemove={() =>
                removeItem({ playlistId: playlist.id, lullabyId: item.lullabyId })
              }
            />
          ))}
        </div>
      ) : (
        <p className="muted">This playlist is empty. Add lullabies from the browse page.</p>
      )}
    </div>
  );
}
