import React, { useCallback } from 'react';
import { getAllChapters, getAllThemes } from '../data/slokas';

const chapters = getAllChapters();
// Show only English themes in the UI filter
const themes = getAllThemes().filter(t => !/[\u0C00-\u0C7F]/.test(t));

export default function SearchBar({ query, setQuery, filters, setFilters, resultCount }) {
  const handleQuery = useCallback((e) => setQuery(e.target.value), [setQuery]);

  const clearAll = () => {
    setQuery('');
    setFilters({ chapter: null, theme: null });
  };

  const hasFilter = query || filters.chapter || filters.theme;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4">
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
        <input
          type="text"
          value={query}
          onChange={handleQuery}
          placeholder="Search slokas... (e.g. Duty, 2-47, Courage)"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main text-lg"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={filters.chapter || ''}
          onChange={e => setFilters(f => ({ ...f, chapter: e.target.value || null }))}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary text-text-muted"
        >
          <option value="">All Adhayayas</option>
          {chapters.map(c => (
            <option key={c} value={c}>Adhyayam {c}</option>
          ))}
        </select>

        <select
          value={filters.theme || ''}
          onChange={e => setFilters(f => ({ ...f, theme: e.target.value || null }))}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary text-text-muted"
        >
          <option value="">All Virtues</option>
          {themes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {hasFilter && (
          <button onClick={clearAll} className="text-xs text-primary underline hover:no-underline">
            Clear filters
          </button>
        )}

        {resultCount !== undefined && (
          <span className="ml-auto text-xs text-text-muted">{resultCount} slokas found</span>
        )}
      </div>
    </div>
  );
}
