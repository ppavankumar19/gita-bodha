import React from 'react';
import { Link } from 'react-router-dom';

export default function ThemeTag({ theme, clickable = true }) {
  // Only show English tags in the UI
  const isTeluguScript = /[\u0C00-\u0C7F]/.test(theme);
  if (isTeluguScript) return null;

  const cls = 'inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-primary hover:bg-orange-200 transition-colors';

  if (clickable) {
    return (
      <Link to={`/theme/${encodeURIComponent(theme)}`} className={cls}>
        {theme}
      </Link>
    );
  }
  return <span className={cls}>{theme}</span>;
}
