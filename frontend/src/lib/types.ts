// Shapes returned by the Luby API (mirrors the Prisma models, serialized).

export interface Category {
  id: string;
  slug: string;
  name: string;
  _count?: { lullabies: number };
}

export interface Lullaby {
  id: string;
  slug: string;
  title: string;
  style: string;
  tempo: string;
  durationSec: number;
  lyrics: string;
  audioUrl: string;
  tags: string[];
  categoryId: string;
  category?: Category;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  _count?: { items: number };
}

export interface PlaylistItem {
  id: string;
  playlistId: string;
  lullabyId: string;
  position: number;
  addedAt: string;
  lullaby: Lullaby;
}

export interface PlaylistDetail extends Playlist {
  items: PlaylistItem[];
}
