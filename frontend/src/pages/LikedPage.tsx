import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGetLikesQuery } from '../store/api';
import { LullabyRow } from '../components/LullabyRow';
import { SignInPrompt } from '../components/SignInPrompt';

export function LikedPage() {
  const { isAuthenticated } = useAuth();
  const { data: likes, isLoading } = useGetLikesQuery(undefined, { skip: !isAuthenticated });

  if (!isAuthenticated) {
    return <SignInPrompt message="Sign in to see the lullabies you've liked." />;
  }

  return (
    <div className="page">
      <div className="collection-hero">
        <div className="collection-cover liked">
          <Heart size={40} fill="currentColor" />
        </div>
        <div className="stack collection-hero-info">
          <span className="muted">Playlist</span>
          <h1 className="page-title">Liked Songs</h1>
          <span className="muted">{likes?.length ?? 0} lullabies</span>
        </div>
      </div>

      {isLoading ? (
        <p className="muted">Loading…</p>
      ) : likes && likes.length > 0 ? (
        <div className="track-list">
          {likes.map((lullaby) => (
            <LullabyRow key={lullaby.id} lullaby={lullaby} queue={likes} />
          ))}
        </div>
      ) : (
        <p className="muted">You haven't liked any lullabies yet.</p>
      )}
    </div>
  );
}
