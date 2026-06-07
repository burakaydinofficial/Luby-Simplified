import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ListMusic, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  useCreatePlaylistMutation,
  useGetLikesQuery,
  useGetPlaylistsQuery,
} from '../store/api';
import { SignInPrompt } from '../components/SignInPrompt';
import './LibraryPage.css';

export function LibraryPage() {
  const { isAuthenticated } = useAuth();
  const { data: likes } = useGetLikesQuery(undefined, { skip: !isAuthenticated });
  const { data: playlists } = useGetPlaylistsQuery(undefined, { skip: !isAuthenticated });
  const [createPlaylist, createState] = useCreatePlaylistMutation();
  const [name, setName] = useState('');

  if (!isAuthenticated) {
    return <SignInPrompt message="Sign in to view your library and playlists." />;
  }

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await createPlaylist({ name: trimmed }).unwrap();
    setName('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Your Library</h1>
      </div>

      <form className="library-create" onSubmit={handleCreate}>
        <input
          placeholder="Create a new playlist…"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
        />
        <button className="button" type="submit" disabled={createState.isLoading || !name.trim()}>
          <Plus size={16} />
          Create
        </button>
      </form>

      <div className="library-list">
        <Link to="/liked" className="library-item">
          <div className="library-item-cover liked">
            <Heart size={24} fill="currentColor" />
          </div>
          <div className="stack">
            <span className="library-item-name">Liked Songs</span>
            <span className="muted">{likes?.length ?? 0} lullabies</span>
          </div>
        </Link>

        {playlists?.map((playlist) => (
          <Link key={playlist.id} to={`/playlists/${playlist.id}`} className="library-item">
            <div className="library-item-cover">
              <ListMusic size={24} />
            </div>
            <div className="stack">
              <span className="library-item-name">{playlist.name}</span>
              <span className="muted">{playlist._count?.items ?? 0} lullabies</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
