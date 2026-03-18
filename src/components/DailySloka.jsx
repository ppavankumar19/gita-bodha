import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDailySloka } from '../data/slokas';

export default function DailySloka() {
  const sloka = getDailySloka();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={() => navigate(`/sloka/${sloka.id}`)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-secondary" />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative p-6 sm:p-8">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-ui text-white/90 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">
              🌞 Daily Sloka
            </span>
            <span className="font-ui text-white/70 text-xs">{today}</span>
          </div>
          <span className="font-ui text-white/80 text-xs bg-white/15 px-2.5 py-1 rounded-full">
            {sloka.chapter_name_english}
          </span>
        </div>

        {/* Sloka text — embedded, instant */}
        <p className="sloka-text text-white whitespace-pre-line mb-4 drop-shadow-sm">
          {sloka.sloka_sanskrit?.split('\n').slice(0, 2).join('\n')}
        </p>

        {/* Chapter & verse badge */}
        <p className="font-ui text-white/60 text-xs mb-3">
          Adhyayam {sloka.chapter} · Slokam {sloka.verse}
        </p>

        {/* Child summary */}
        <p className="font-telugu text-white text-base font-bold mb-5 leading-relaxed">
          {sloka.child_summary_telugu}
        </p>

        {/* Virtue tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sloka.moral_themes
            .filter(t => !/[\u0C00-\u0C7F]/.test(t))
            .map(t => (
              <span key={t} className="font-ui text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                {t}
              </span>
            ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-white/70 text-xs font-ui group-hover:text-white transition-colors">
          <span>Read full meaning</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}
