import { Play, Pause } from 'lucide-react';
import type { Lullaby } from '../lib/types';
import { usePlayer } from '../context/PlayerContext';
import { CoverArt } from './CoverArt';
import { LikeButton } from './LikeButton';
import { AddToPlaylistButton } from './AddToPlaylistButton';
import './LullabyCard.css';

interface LullabyCardProps {
  lullaby: Lullaby;
  queue: Lullaby[];
}

export function LullabyCard({ lullaby, queue }: LullabyCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const isCurrent = currentTrack?.id === lullaby.id;

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(lullaby, queue);
    }
  };

  return (
    <div className="lullaby-card">
      <div className="lullaby-card-cover">
        <CoverArt seed={lullaby.slug} categorySlug={lullaby.category?.slug} />
        <button
          className="lullaby-card-play"
          onClick={handlePlay}
          aria-label={isCurrent && isPlaying ? 'Pause' : 'Play'}
        >
          {isCurrent && isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>
      </div>
      <div className="lullaby-card-body">
        <span className="lullaby-card-title">{lullaby.title}</span>
        <span className="lullaby-card-sub muted">{lullaby.category?.name ?? lullaby.style}</span>
        <div className="lullaby-card-actions">
          <LikeButton lullabyId={lullaby.id} />
          <AddToPlaylistButton lullaby={lullaby} />
        </div>
      </div>
    </div>
  );
}
