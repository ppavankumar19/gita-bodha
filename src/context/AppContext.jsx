import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { speak, stop, pause, resume } from '../services/ttsService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gbv-favorites') || '[]');
    } catch {
      return [];
    }
  });

  // Global voice state
  const [playingId, setPlayingId] = useState(null); // id of the sloka playing
  const [voiceStatus, setVoiceStatus] = useState('idle'); // idle, loading, playing, paused
  const [voiceRate, setVoiceRate] = useState(0.85);

  useEffect(() => {
    localStorage.setItem('gbv-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  // Global voice controls
  const playSloka = useCallback(async (id, text) => {
    if (!text) return;

    // If already playing this one, toggle pause/resume
    if (playingId === id) {
      if (voiceStatus === 'playing') {
        pause();
        setVoiceStatus('paused');
      } else if (voiceStatus === 'paused') {
        resume();
        setVoiceStatus('playing');
      }
      return;
    }

    // New sloka: stop previous and start new
    stop();
    setPlayingId(id);
    setVoiceStatus('loading');

    try {
      await speak(text, {
        lang: 'te-IN',
        rate: voiceRate,
        onStart: () => setVoiceStatus('playing'),
        onEnd: () => {
          setVoiceStatus('idle');
          setPlayingId(null);
        },
        onError: () => {
          setVoiceStatus('error');
          setPlayingId(null);
        },
      });
    } catch (err) {
      console.error('playSloka error:', err);
      setVoiceStatus('error');
      setPlayingId(null);
    }
  }, [playingId, voiceStatus, voiceRate]);

  const stopGlobalVoice = useCallback(() => {
    stop();
    setVoiceStatus('idle');
    setPlayingId(null);
  }, []);

  const pauseGlobalVoice = useCallback(() => {
    pause();
    setVoiceStatus('paused');
  }, []);

  const resumeGlobalVoice = useCallback(() => {
    resume();
    setVoiceStatus('playing');
  }, []);

  return (
    <AppContext.Provider value={{ 
      favorites, toggleFavorite, isFavorite,
      playingId, voiceStatus, voiceRate, setVoiceRate,
      playSloka, stopGlobalVoice, pauseGlobalVoice, resumeGlobalVoice
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
