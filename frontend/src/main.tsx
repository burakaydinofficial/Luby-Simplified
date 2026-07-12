import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { ModalProvider } from './context/ModalContext';
import { App } from './App';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <PlayerProvider>
              <ModalProvider>
                <App />
              </ModalProvider>
            </PlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
