import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { CoverArt } from './CoverArt';
import { formatTime } from '../lib/format';
import './PlayerBar.css';

export function PlayerBar() {
  const { currentTrack, isPlaying, togglePlay, setIsPlaying, next, previous } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const trackId = currentTrack?.id;

  // Load the audio source whenever the track changes. The play/pause effect
  // below then starts playback, so we only load here.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.audioUrl;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  // Play or pause, both on toggle and after a new track loads.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, trackId]);

  const handleSeek = (event: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
  };

  if (!currentTrack) {
    return null;
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="player-bar">
      <audio
        ref={audioRef}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={next}
        preload="metadata"
      />

      <div className="player-track">
        <div className="player-cover">
          <CoverArt seed={currentTrack.slug} categorySlug={currentTrack.category?.slug} />
        </div>
        <div className="player-meta">
          <span className="player-title">{currentTrack.title}</span>
          <span className="player-sub muted">
            {currentTrack.category?.name ?? currentTrack.style}
          </span>
        </div>
      </div>

      <div className="player-center">
        <div className="player-buttons">
          <button className="icon-button" onClick={previous} aria-label="Previous">
            <SkipBack size={20} />
          </button>
          <button
            className="icon-button player-play"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button className="icon-button" onClick={next} aria-label="Next">
            <SkipForward size={20} />
          </button>
        </div>
        <div className="player-progress-row">
          <span className="player-time muted">{formatTime(currentTime)}</span>
          <div
            className="player-progress"
            onClick={handleSeek}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className="player-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="player-time muted">{formatTime(duration)}</span>
        </div>
      </div>
    </footer>
  );
}
