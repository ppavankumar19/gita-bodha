import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

const fuseOptions = {
  keys: [
    { name: 'sloka_sanskrit', weight: 0.3 },
    { name: 'bhavam_telugu', weight: 0.4 },
    { name: 'child_summary_telugu', weight: 0.2 },
    { name: 'moral_themes', weight: 0.5 },
    { name: 'chapter_name_telugu', weight: 0.3 },
    { name: 'id', weight: 0.6 },
  ],
  threshold: 0.4,
  includeScore: true,
};

export function useSearch(slokas) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ chapter: null, theme: null });

  const results = useMemo(() => {
    let filtered = slokas;

    if (filters.chapter) {
      filtered = filtered.filter(s => s.chapter === Number(filters.chapter));
    }
    if (filters.theme) {
      filtered = filtered.filter(s => s.moral_themes.includes(filters.theme));
    }

    const normalized = query.trim().replace(/\./g, '-');
    if (normalized) {
      const fuse = new Fuse(filtered, fuseOptions);
      return fuse.search(normalized).map(r => r.item);
    }

    return filtered;
  }, [query, filters, slokas]);

  return { query, setQuery, filters, setFilters, results };
}
