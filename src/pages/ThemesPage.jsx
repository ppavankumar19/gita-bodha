import React from 'react';
import { Link } from 'react-router-dom';
import { getAllThemes, slokas } from '../data/slokas';

// English themes only for UI
const themes = getAllThemes().filter(t => !/[\u0C00-\u0C7F]/.test(t));

export default function ThemesPage() {
  const countForTheme = (t) => slokas.filter(s => s.moral_themes.includes(t)).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-up">
      <h1 className="section-heading text-2xl text-text-main mb-1">🌺 Virtues</h1>
      <p className="font-ui text-text-muted text-sm mb-6">Browse slokas by divine virtue</p>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {themes.map(t => (
          <Link
            key={t}
            to={`/theme/${encodeURIComponent(t)}`}
            className="p-4 rounded-2xl border bg-white border-orange-100 hover:border-primary hover:shadow-md hover:bg-orange-50 transition-all group"
          >
            <p className="font-ui font-semibold text-text-main text-sm group-hover:text-primary transition-colors">{t}</p>
            <p className="font-ui text-xs text-text-muted mt-1">{countForTheme(t)} sloka{countForTheme(t) !== 1 ? 's' : ''}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
