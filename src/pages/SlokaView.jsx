import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VoicePlayer from '../components/VoicePlayer';
import ThemeTag from '../components/ThemeTag';
import { useGitaVerse } from '../hooks/useGitaVerse';
import { CHAPTERS } from '../data/chapters';

export default function SlokaView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useApp();
  const { data: sloka, loading, error } = useGitaVerse(id);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-ui text-text-muted text-sm">Loading sloka...</p>
      </div>
    );
  }

  if (error || !sloka) {
    return (
      <div className="text-center py-20 text-text-muted">
        <p className="text-5xl mb-4">😕</p>
        <p className="font-ui">{error || 'Sloka not found.'}</p>
        <Link to="/slokas" className="font-ui text-primary underline mt-3 block text-sm">
          ← Go back to Slokas
        </Link>
      </div>
    );
  }

  const [idChapter, idVerse] = id.split('-').map(Number);
  const chapter = Number.isInteger(idChapter) ? idChapter : sloka.chapter;
  const verse = Number.isInteger(idVerse) ? idVerse : sloka.verse;
  const chapterIndex = CHAPTERS.findIndex(c => c.chapter_number === chapter);
  const chapterMeta = chapterIndex >= 0 ? CHAPTERS[chapterIndex] : null;
  const chapterVerseCount = chapterMeta?.verses_count || verse;

  let prevId = null;
  let nextId = null;

  if (verse > 1) {
    prevId = `${chapter}-${verse - 1}`;
  } else if (chapterIndex > 0) {
    const prevChapter = CHAPTERS[chapterIndex - 1];
    prevId = `${prevChapter.chapter_number}-${prevChapter.verses_count}`;
  }

  if (verse < chapterVerseCount) {
    nextId = `${chapter}-${verse + 1}`;
  } else if (chapterIndex >= 0 && chapterIndex < CHAPTERS.length - 1) {
    const nextChapter = CHAPTERS[chapterIndex + 1];
    nextId = `${nextChapter.chapter_number}-1`;
  }

  const formatVerseLabel = (targetId) => {
    const [c, v] = targetId.split('-').map(Number);
    return `Adhyayam ${c} · Slokam ${v}`;
  };
  const favorite = isFavorite(sloka.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 fade-up">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-6 flex-wrap font-ui">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-orange-300">/</span>
        <Link to={`/chapter/${chapter}`} className="hover:text-primary transition-colors">
          Adhyayam {chapter}
        </Link>
        <span className="text-orange-300">/</span>
        <span className="text-text-main font-medium">Slokam {verse}</span>
      </nav>

      {/* Chapter + verse header */}
      <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden mb-5">
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="font-ui text-xs bg-accent/70 text-text-main font-bold px-3 py-1 rounded-full">
                Adhyayam {chapter} · Slokam {verse}
              </span>
              {sloka.chapter_name_english && (
                <p className="font-ui text-secondary text-sm font-semibold mt-2">{sloka.chapter_name_english}</p>
              )}
              {sloka.chapter_name_telugu && (
                <p className="font-telugu text-text-muted text-xs mt-0.5">{sloka.chapter_name_telugu}</p>
              )}
            </div>
            <button
              onClick={() => toggleFavorite(sloka.id)}
              className="text-2xl hover:scale-125 transition-transform duration-150 ml-3"
            >
              {favorite ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Sloka in Telugu script */}
          <div className="mb-5">
            <p className="font-telugu text-xs font-semibold text-text-muted mb-2">
              శ్లోకం
            </p>
            <div className="bg-orange-50 rounded-xl px-5 py-4 border-l-4 border-primary">
              <p className="sloka-text text-text-main whitespace-pre-line">
                {sloka.sloka_sanskrit}
              </p>
            </div>
          </div>

          {/* Word meanings collapsible */}
          {sloka.word_meanings && (
            <details className="mt-3 group">
              <summary className="font-ui text-xs text-primary cursor-pointer hover:underline list-none flex items-center gap-1">
                <span className="group-open:rotate-90 transition-transform inline-block">›</span>
                Word meanings
              </summary>
              <p className="font-ui text-xs text-text-muted mt-2 leading-relaxed border-l-2 border-orange-200 pl-3">
                {sloka.word_meanings}
              </p>
            </details>
          )}
        </div>
      </div>

      {/* Telugu Bhavam */}
      {sloka.bhavam_telugu ? (
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 mb-5">
          <h2 className="font-telugu font-bold text-secondary text-base mb-3 flex items-center gap-2">
            📖 భావం
          </h2>
          <p className="bhavam-text text-text-main leading-relaxed">{sloka.bhavam_telugu}</p>
        </div>
      ) : sloka.bhavam_english ? (
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-ui font-bold text-secondary text-base">📖 Meaning (English)</h2>
            {sloka.bhavam_author && (
              <span className="font-ui text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                {sloka.bhavam_author}
              </span>
            )}
          </div>
          <p className="font-ui text-text-main leading-relaxed text-sm">{sloka.bhavam_english}</p>
          <p className="font-telugu text-xs text-text-muted mt-4 italic border-t border-orange-100 pt-3">
            * తెలుగు భావం త్వరలో జోడించబడుతుంది.
          </p>
        </div>
      ) : null}

      {/* Purport — extended Telugu commentary from API */}
      {sloka.purport_telugu && (
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 mb-5">
          <details className="group">
            <summary className="font-telugu font-bold text-secondary text-base mb-1 flex items-center gap-2 cursor-pointer list-none">
              <span className="group-open:rotate-90 transition-transform inline-block text-primary">›</span>
              📜 తాత్పర్యం
              <span className="font-ui text-xs text-text-muted font-normal">(Purport)</span>
            </summary>
            <p className="bhavam-text text-text-main leading-relaxed mt-3 border-l-4 border-orange-100 pl-4">
              {sloka.purport_telugu}
            </p>
          </details>
        </div>
      )}

      {/* For Children */}
      {sloka.child_summary_telugu && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-6 mb-5">
          <h2 className="font-telugu font-bold text-primary text-base mb-3 flex items-center gap-2">
            🌟 పిల్లలకు
          </h2>
          <p className="summary-text text-text-main">{sloka.child_summary_telugu}</p>
        </div>
      )}

      {/* Moral themes */}
      {sloka.moral_themes?.filter(t => !/[\u0C00-\u0C7F]/.test(t)).length > 0 && (
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5 mb-5">
          <p className="font-ui text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
            Virtues
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {sloka.moral_themes.map(t => <ThemeTag key={t} theme={t} />)}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-orange-50">
            {sloka.difficulty && (
              <span className={`font-ui text-xs px-2.5 py-1 rounded-full font-medium ${
                sloka.difficulty === 'beginner'
                  ? 'bg-green-100 text-secondary'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {sloka.difficulty === 'beginner' ? '🟢 Beginner' : '🟡 Intermediate'}
              </span>
            )}
            {sloka.age_group && (
              <span className="font-ui text-xs bg-gray-100 text-text-muted px-2.5 py-1 rounded-full">
                Age {sloka.age_group}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Voice Player */}
      <div className="mb-8">
        <p className="font-ui text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
          🔊 Listen
        </p>
        <VoicePlayer
          slokaText={sloka.sloka_sanskrit}
          bhavamText={sloka.bhavam_telugu || sloka.bhavam_english || ''}
        />
      </div>

      {/* Prev / Next */}
      <div className="grid grid-cols-2 gap-3">
        {prevId ? (
          <button
            onClick={() => navigate(`/sloka/${prevId}`)}
            className="bg-white border border-orange-200 rounded-xl p-4 text-left hover:border-primary hover:shadow-sm transition-all group"
          >
            <p className="font-ui text-xs text-text-muted mb-1 flex items-center gap-1">
              <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
              Previous
            </p>
            <p className="font-ui text-sm font-semibold text-text-main">
              {formatVerseLabel(prevId)}
            </p>
          </button>
        ) : <div />}

        {nextId ? (
          <button
            onClick={() => navigate(`/sloka/${nextId}`)}
            className="bg-white border border-orange-200 rounded-xl p-4 text-right hover:border-primary hover:shadow-sm transition-all group"
          >
            <p className="font-ui text-xs text-text-muted mb-1 flex items-center gap-1 justify-end">
              Next
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </p>
            <p className="font-ui text-sm font-semibold text-text-main">
              {formatVerseLabel(nextId)}
            </p>
          </button>
        ) : <div />}
      </div>
    </div>
  );
}
