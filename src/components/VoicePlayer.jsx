import React, { useState } from 'react';
import { useVoice } from '../hooks/useVoice';

const RATES = [0.5, 0.75, 1.0];

function WaveAnimation() {
  return (
    <div className="flex items-center gap-0.5 h-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="wave-bar w-1 bg-primary rounded-full" style={{ height: '100%' }} />
      ))}
    </div>
  );
}

export default function VoicePlayer({ id, slokaText, bhavamText }) {
  const { status, rate, setRate, playText, handlePause, handleStop, playingId } = useVoice();
  const [mode, setMode] = useState('sloka');

  const isThisActive = playingId === id;
  const isPlaying = isThisActive && status === 'playing';
  const isPaused = isThisActive && status === 'paused';
  const isLoading = isThisActive && status === 'loading';
  const isActive = isPlaying || isPaused;

  const handlePlay = async () => {
    if (isThisActive) {
      handlePause();
      return;
    }
    
    let textToSpeak = '';
    if (mode === 'sloka') textToSpeak = slokaText;
    else if (mode === 'bhavam') textToSpeak = bhavamText;
    else textToSpeak = `${slokaText} ... ${bhavamText}`;
    
    await playText(textToSpeak, id);
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
      {/* Mode selector */}
      <div className="flex gap-2 mb-3">
        {[
          { key: 'sloka', label: 'Sloka' },
          { key: 'bhavam', label: 'Bhavam' },
          { key: 'both', label: 'Both' },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`font-ui px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              mode === m.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-text-muted border border-orange-200 hover:border-primary hover:text-primary'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={isActive ? handlePause : handlePlay}
          disabled={isLoading}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-orange-600 disabled:opacity-50 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {isActive && (
          <button
            onClick={handleStop}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-text-muted flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors"
            aria-label="Stop"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          </button>
        )}

        <div className="flex-1">
          {isPlaying ? (
            <WaveAnimation />
          ) : (
            <span className="font-ui text-xs text-text-muted">
              {isPaused ? 'Paused' : status === 'error' ? 'Error — try again' : 'Press play to listen'}
            </span>
          )}
        </div>

        <div className="flex gap-1">
          {RATES.map(r => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`font-ui text-xs px-2 py-1 rounded-full transition-colors font-semibold ${
                rate === r
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-text-muted border border-orange-200 hover:border-primary hover:text-primary'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
