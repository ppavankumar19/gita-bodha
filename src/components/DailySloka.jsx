import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDailySloka } from '../data/slokas';
import { useVoice } from '../hooks/useVoice';

export default function DailySloka() {
  const sloka = getDailySloka();
  const navigate = useNavigate();
  const { status, playText, handlePause, playingId } = useVoice();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  // Only consider this specific sloka as active if its ID matches the global playingId
  const isThisSlokaActive = playingId === sloka.id;
  const isPlaying = isThisSlokaActive && status === 'playing';
  const isPaused = isThisSlokaActive && status === 'paused';
  const isLoading = isThisSlokaActive && status === 'loading';
  const isActive = isPlaying || isPaused;

  const handleSpeech = (e) => {
    e.stopPropagation(); // Don't navigate when clicking play
    if (isThisSlokaActive) {
      handlePause();
    } else {
      playText(`${sloka.sloka_sanskrit} ... ${sloka.bhavam_telugu}`, sloka.id);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
      onClick={() => navigate(`/sloka/${sloka.id}`)}
    >
      {/* Background with subtle glow when playing */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-secondary transition-opacity duration-500 ${isPlaying ? 'opacity-90 animate-pulse' : 'opacity-100'}`} />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative p-6 sm:p-8">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-ui text-white/90 text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
              🌞 Daily Sloka
            </span>
            <span className="font-ui text-white/70 text-[10px]">{today}</span>
          </div>
          
          {/* Play/Pause Button */}
          <button 
            onClick={handleSpeech}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isActive ? 'bg-white text-primary scale-110 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : isPaused ? (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            )}
          </button>
        </div>

        {/* Sloka text */}
        <p className="sloka-text text-white text-lg whitespace-pre-line mb-3 drop-shadow-sm leading-relaxed">
          {sloka.sloka_sanskrit?.split('\n').slice(0, 2).join('\n')}
        </p>

        {/* Chapter & verse badge */}
        <p className="font-ui text-white/80 text-xs mb-4 font-medium">
          Adhyayam {sloka.chapter} · Slokam {sloka.verse}
        </p>

        {/* Child summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-5 border border-white/10">
          <p className="font-telugu text-white text-base font-bold leading-relaxed">
            {sloka.child_summary_telugu}
          </p>
        </div>

        {/* Virtue tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sloka.moral_themes
            .filter(t => !/[\u0C00-\u0C7F]/.test(t))
            .map(t => (
              <span key={t} className="font-ui text-[10px] bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm font-semibold uppercase tracking-wider">
                {t}
              </span>
            ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold font-ui group-hover:gap-2 transition-all">
          <span>Read full meaning</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}
