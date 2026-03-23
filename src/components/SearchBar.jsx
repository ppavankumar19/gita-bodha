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

  // Suggest popular virtues based on current query or just common ones
  const suggestions = themes.filter(t => 
    !query || t.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 transition-all focus-within:shadow-md focus-within:border-orange-200">
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/60 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={handleQuery}
          placeholder="Search by virtue, chapter, or verse... (e.g. Courage, 2.47)"
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-primary/50 text-sm transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-main text-xl transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Suggested Virtues "Auto-update" search */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mr-1">Suggestions:</span>
        {suggestions.map(t => (
          <button
            key={t}
            onClick={() => { setQuery(t); setFilters(f => ({ ...f, theme: null })); }}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              query === t 
                ? 'bg-primary text-white border-primary shadow-sm scale-105' 
                : 'bg-white text-text-muted border-gray-100 hover:border-primary hover:text-primary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Adhyayam:</label>
          <select
            value={filters.chapter || ''}
            onChange={e => setFilters(f => ({ ...f, chapter: e.target.value || null }))}
            className="text-xs border border-gray-100 bg-gray-50/50 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary text-text-main font-medium cursor-pointer"
          >
            <option value="">All</option>
            {chapters.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Virtue:</label>
          <select
            value={filters.theme || ''}
            onChange={e => setFilters(f => ({ ...f, theme: e.target.value || null }))}
            className="text-xs border border-gray-100 bg-gray-50/50 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary text-text-main font-medium cursor-pointer"
          >
            <option value="">All</option>
            {themes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {hasFilter && (
          <button onClick={clearAll} className="ml-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            Reset Filters
          </button>
        )}

        {resultCount !== undefined && (
          <div className="ml-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {resultCount} {resultCount === 1 ? 'Sloka' : 'Slokas'} found
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
