import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Lullaby } from '../lib/types';

interface PlayerContextValue {
  queue: Lullaby[];
  currentIndex: number;
  currentTrack: Lullaby | null;
  isPlaying: boolean;
  /** Play a track. Optionally pass the surrounding list so next/prev work. */
  playTrack: (track: Lullaby, queue?: Lullaby[]) => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  next: () => void;
  previous: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Lullaby[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = useCallback((track: Lullaby, nextQueue?: Lullaby[]) => {
    const list = nextQueue && nextQueue.length > 0 ? nextQueue : [track];
    const index = list.findIndex((item) => item.id === track.id);
    setQueue(list);
    setCurrentIndex(index >= 0 ? index : 0);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    // Loop back to the start at the end of the queue, so playback continues
    // indefinitely (a lullaby left running should not stop on its own).
    const nextIndex = currentIndex < queue.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  }, [currentIndex, queue.length]);

  const previous = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const currentTrack = currentIndex >= 0 ? (queue[currentIndex] ?? null) : null;

  const value = useMemo<PlayerContextValue>(
    () => ({
      queue,
      currentIndex,
      currentTrack,
      isPlaying,
      playTrack,
      togglePlay,
      setIsPlaying,
      next,
      previous,
    }),
    [queue, currentIndex, currentTrack, isPlaying, playTrack, togglePlay, next, previous],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return ctx;
}
