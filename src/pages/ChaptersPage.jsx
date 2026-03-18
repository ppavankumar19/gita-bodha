import React from 'react';
import { Link } from 'react-router-dom';
import { CHAPTERS } from '../data/chapters';
import { slokas } from '../data/slokas';

// Count curated slokas per chapter for badge display
const curatedCountByChapter = {};
slokas.forEach(s => {
  curatedCountByChapter[s.chapter] = (curatedCountByChapter[s.chapter] || 0) + 1;
});

const totalVerses = CHAPTERS.reduce((sum, c) => sum + c.verses_count, 0);

export default function ChaptersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-up">
      <h1 className="section-heading text-2xl text-text-main mb-1">📚 All Adhayayas</h1>
      <p className="font-ui text-text-muted text-sm mb-6">18 Adhayayas · {totalVerses} total slokas</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {CHAPTERS.map(c => {
          const curatedCount = curatedCountByChapter[c.chapter_number] || 0;
          return (
            <Link
              key={c.chapter_number}
              to={`/chapter/${c.chapter_number}`}
              className="bg-white border border-orange-100 rounded-2xl p-4 flex items-center gap-4 hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center font-bold text-lg text-text-main flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors font-ui">
                {c.chapter_number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-ui font-semibold text-text-main truncate text-sm">{c.name}</p>
                <p className="font-telugu text-xs text-secondary truncate mt-0.5">{c.chapter_name_telugu}</p>
                {curatedCount > 0 && (
                  <p className="font-ui text-xs text-text-muted mt-1">⭐ {curatedCount} curated slokas</p>
                )}
              </div>
              <span className="font-ui text-xs bg-orange-50 text-primary px-2.5 py-1 rounded-full font-semibold flex-shrink-0 border border-orange-200">
                {c.verses_count} slokas
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
