import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGetLikesQuery, useLikeMutation, useUnlikeMutation } from '../store/api';
import './LikeButton.css';

export function LikeButton({ lullabyId }: { lullabyId: string }) {
  const { isAuthenticated, requireAuth } = useAuth();
  const { data: likes } = useGetLikesQuery(undefined, { skip: !isAuthenticated });
  const [like] = useLikeMutation();
  const [unlike] = useUnlikeMutation();

  const liked = !!likes?.some((lullaby) => lullaby.id === lullabyId);

  const handleClick = () => {
    requireAuth(() => {
      if (liked) {
        unlike(lullabyId);
      } else {
        like(lullabyId);
      }
    });
  };

  return (
    <button
      className={`icon-button like-button${liked ? ' is-liked' : ''}`}
      onClick={handleClick}
      aria-label={liked ? 'Remove from Liked' : 'Add to Liked'}
      aria-pressed={liked}
    >
      <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
    </button>
  );
}
