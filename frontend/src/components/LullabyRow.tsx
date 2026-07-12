import { Play, Pause, Trash2 } from 'lucide-react';
import type { Lullaby } from '../lib/types';
import { usePlayer } from '../context/PlayerContext';
import { CoverArt } from './CoverArt';
import { LikeButton } from './LikeButton';
import { AddToPlaylistButton } from './AddToPlaylistButton';
import { formatTime } from '../lib/format';
import './LullabyRow.css';

interface LullabyRowProps {
  lullaby: Lullaby;
  queue: Lullaby[];
  onRemove?: () => void;
}

export function LullabyRow({ lullaby, queue, onRemove }: LullabyRowProps) {
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
    <div className={`lullaby-row${isCurrent ? ' is-current' : ''}`}>
      <button
        className="lullaby-row-play"
        onClick={handlePlay}
        aria-label={isCurrent && isPlaying ? 'Pause' : 'Play'}
      >
        <div className="lullaby-row-cover">
          <CoverArt seed={lullaby.slug} categorySlug={lullaby.category?.slug} />
        </div>
        <span className="lullaby-row-play-icon">
          {isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </span>
      </button>

      <div className="lullaby-row-info">
        <span className="lullaby-row-title">{lullaby.title}</span>
        <span className="lullaby-row-sub muted">
          {lullaby.category?.name ?? lullaby.style}
        </span>
      </div>

      <div className="lullaby-row-controls">
        <span className="lullaby-row-duration muted">{formatTime(lullaby.durationSec)}</span>

        <div className="lullaby-row-actions">
          <LikeButton lullabyId={lullaby.id} />
          <AddToPlaylistButton lullaby={lullaby} />
          {onRemove && (
            <button className="icon-button" onClick={onRemove} aria-label="Remove from playlist">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
