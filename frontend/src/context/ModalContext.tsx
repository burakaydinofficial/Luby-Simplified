import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Lullaby } from '../lib/types';

// Every modal the app can show, as a discriminated union.
// To add a modal: add a variant here and a case in ModalHost.
export type ActiveModal =
  | { type: 'auth'; onSuccess?: () => void }
  | { type: 'addToPlaylist'; lullaby: Lullaby };

interface ModalContextValue {
  active: ActiveModal | null;
  open: (modal: ActiveModal) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveModal | null>(null);
  const open = useCallback((modal: ActiveModal) => setActive(modal), []);
  const close = useCallback(() => setActive(null), []);

  return (
    <ModalContext.Provider value={{ active, open, close }}>{children}</ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return ctx;
}
