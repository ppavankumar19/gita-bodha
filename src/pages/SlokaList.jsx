import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SlokaCard from '../components/SlokaCard';
import { useSearch } from '../hooks/useSearch';
import { useGitaChapter } from '../hooks/useGitaChapter';
import { useCuratedSlokas } from '../hooks/useCuratedSlokas';

function CuratedList() {
  const { slokas, loading, error } = useCuratedSlokas();
  const { query, setQuery, filters, setFilters, results } = useSearch(slokas);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-ui text-text-muted text-sm">Loading slokas from Telugu Gita...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-text-muted">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-ui text-sm">Failed to load: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-heading text-2xl text-text-main">📖 Curated Slokas</h1>
        <Link to="/chapters" className="font-ui text-sm text-primary hover:underline font-medium">Browse all Adhayayas →</Link>
      </div>

      <div className="mb-6">
        <SearchBar
          query={query}
          setQuery={setQuery}
          filters={filters}
          setFilters={setFilters}
          resultCount={results.length}
        />
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-ui text-sm">No slokas found. Try a different keyword.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(s => <SlokaCard key={s.id} sloka={s} />)}
        </div>
      )}
    </div>
  );
}

function ChapterList({ chapterNum }) {
  const { verses, chapterInfo, loading, error } = useGitaChapter(chapterNum);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-ui text-text-muted text-sm">Loading Adhyayam {chapterNum}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-text-muted">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-ui text-sm">Failed to load: {error}</p>
      </div>
    );
  }

  const chapterNameTe = chapterInfo?.chapter_name_telugu || verses[0]?.chapter_name_telugu;
  const chapterNameEn = chapterInfo?.name || '';
  const curatedCount = verses.filter(v => v.is_featured || v.moral_themes?.length > 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-6 font-ui">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-orange-300">/</span>
        <Link to="/chapters" className="hover:text-primary transition-colors">Adhayayas</Link>
        <span className="text-orange-300">/</span>
        <span className="text-text-main font-medium">Adhyayam {chapterNum}</span>
      </nav>

      <div className="mb-6">
        <h1 className="section-heading text-2xl text-text-main mb-1">
          Adhyayam {chapterNum} — {chapterNameEn}
          {chapterNameTe && <span className="font-telugu text-secondary ml-2 text-lg font-normal">({chapterNameTe})</span>}
        </h1>
        <p className="font-ui text-text-muted text-sm mt-1 flex items-center gap-2">
          {chapterInfo?.verses_count || verses.length} slokas
          {curatedCount > 0 && (
            <span className="text-xs bg-green-100 text-secondary px-2 py-0.5 rounded-full font-semibold">
              ⭐ {curatedCount} curated
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {verses.map(v => <SlokaCard key={v.id} sloka={v} />)}
      </div>
    </div>
  );
}

export default function SlokaList() {
  const { chapterNum } = useParams();
  if (chapterNum) return <ChapterList chapterNum={chapterNum} />;
  return <CuratedList />;
}
