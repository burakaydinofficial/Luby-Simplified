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
    <div className={`lullaby-card${isCurrent ? ' is-current' : ''}`}>
      {/* The whole cover is the play/pause control (works on touch, no hover needed). */}
      <button
        className="lullaby-card-cover"
        onClick={handlePlay}
        aria-label={`${isCurrent && isPlaying ? 'Pause' : 'Play'} ${lullaby.title}`}
      >
        <CoverArt seed={lullaby.slug} categorySlug={lullaby.category?.slug} />
        <span className="lullaby-card-play-badge" aria-hidden>
          {isCurrent && isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </span>
      </button>
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
