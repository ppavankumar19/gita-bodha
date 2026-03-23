import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ThemeTag from './ThemeTag';
import { useVoice } from '../hooks/useVoice';

export default function SlokaCard({ sloka, compact = false }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useApp();
  const { status, playText, handlePause, playingId } = useVoice();
  const favorite = isFavorite(sloka.id);
  
  const isThisActive = playingId === sloka.id;
  const isPlaying = isThisActive && status === 'playing';
  const isPaused = isThisActive && status === 'paused';
  const isLoading = isThisActive && status === 'loading';
  const isActive = isPlaying || isPaused;

  const handlePlay = async (e) => {
    e.stopPropagation();
    if (isThisActive) {
      handlePause();
    } else {
      await playText(`${sloka.sloka_sanskrit} ... ${sloka.bhavam_telugu || sloka.bhavam_english || ''}`, sloka.id);
    }
  };

  const slokaText = typeof sloka.sloka_sanskrit === 'string' ? sloka.sloka_sanskrit : '';
  const firstTwoLines = slokaText.split('\n').slice(0, 2).join('\n');

  return (
    <div
      className="bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer flex flex-col"
      onClick={() => navigate(`/sloka/${sloka.id}`)}
    >
      {/* Card top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-secondary rounded-t-2xl" />

      <div className="p-5 flex flex-col flex-1">
        {/* Badge row */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-ui text-xs bg-accent/70 text-text-main font-semibold px-2.5 py-1 rounded-full">
            Adh. {sloka.chapter} · Sl. {sloka.verse}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(sloka.id); }}
            className="text-base hover:scale-125 transition-transform duration-150"
            aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
          >
            {favorite ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Chapter name */}
        {sloka.chapter_name_english && (
          <p className="font-ui text-xs text-secondary font-medium mb-2 uppercase tracking-wide">
            {sloka.chapter_name_english}
          </p>
        )}

        {/* Sloka Sanskrit text */}
        {!compact && firstTwoLines && (
          <p className="sloka-text text-text-main whitespace-pre-line mb-3 line-clamp-2">
            {firstTwoLines}
          </p>
        )}

        {/* Child summary (Telugu) or English fallback */}
        {sloka.child_summary_telugu ? (
          <p className="font-telugu text-base font-semibold text-text-main mb-3 leading-relaxed flex-1">
            {sloka.child_summary_telugu}
          </p>
        ) : sloka.bhavam_english ? (
          <p className="font-ui text-sm text-text-muted mb-3 line-clamp-2 flex-1">
            {sloka.bhavam_english}
          </p>
        ) : <div className="flex-1" />}

        {/* English theme tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {sloka.moral_themes?.map(t => <ThemeTag key={t} theme={t} />)}
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-2 pt-3 border-t border-orange-50">
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-ui font-semibold transition-all shadow-sm ${
              isActive 
                ? 'bg-secondary text-white scale-105 shadow-secondary/20' 
                : 'bg-primary text-white hover:bg-orange-600'
            }`}
          >
            {isLoading ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            ) : isPlaying ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : isPaused ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <span className="text-[14px]">🔊</span>
            )}
            <span>{isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Listen'}</span>
          </button>

          {sloka.difficulty && (
            <span className={`font-ui text-xs px-2.5 py-1 rounded-full font-medium ${
              sloka.difficulty === 'beginner'
                ? 'bg-green-100 text-secondary'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {sloka.difficulty === 'beginner' ? 'Beginner' : 'Intermediate'}
            </span>
          )}

          {sloka.age_group && (
            <span className="font-ui text-xs text-text-muted ml-auto">Age {sloka.age_group}</span>
          )}
        </div>
      </div>
    </div>
  );
}
