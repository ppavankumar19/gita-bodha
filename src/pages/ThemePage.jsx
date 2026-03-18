import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { slokas } from '../data/slokas';
import SlokaCard from '../components/SlokaCard';

export default function ThemePage() {
  const { themeName } = useParams();
  const decoded = decodeURIComponent(themeName || '');
  const filtered = slokas.filter(s => s.moral_themes.includes(decoded));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 fade-up">
      <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-6 font-ui">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-orange-300">/</span>
        <Link to="/themes" className="hover:text-primary transition-colors">Virtues</Link>
        <span className="text-orange-300">/</span>
        <span className="text-text-main font-medium">{decoded}</span>
      </nav>

      <h1 className="section-heading text-2xl text-text-main mb-1">🌺 {decoded}</h1>
      <p className="font-ui text-text-muted text-sm mb-6">{filtered.length} sloka{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-ui text-sm">No slokas found for this theme.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => <SlokaCard key={s.id} sloka={s} />)}
        </div>
      )}
    </div>
  );
}
