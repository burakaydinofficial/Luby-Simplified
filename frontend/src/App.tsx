import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { PlayerBar } from './components/PlayerBar';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { LikedPage } from './pages/LikedPage';
import { PlaylistPage } from './pages/PlaylistPage';
import './App.css';

export function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/liked" element={<LikedPage />} />
            <Route path="/playlists/:id" element={<PlaylistPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <PlayerBar />
      <AuthModal />
    </div>
  );
}
