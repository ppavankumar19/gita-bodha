import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { slokas } from '../data/slokas';

const chapterNames = {};
slokas.forEach(s => {
  chapterNames[s.chapter] = s.chapter_name_telugu;
});
const chapters = Object.keys(chapterNames).map(Number).sort((a, b) => a - b);

export default function ChapterNav() {
  const { chapterNum } = useParams();
  const active = chapterNum ? Number(chapterNum) : null;

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-4">
      <h3 className="font-bold text-text-main font-telugu mb-3 text-sm">అధ్యాయాలు</h3>
      <div className="flex flex-col gap-1">
        {chapters.map(c => (
          <Link
            key={c}
            to={`/chapter/${c}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors font-telugu ${
              active === c
                ? 'bg-primary text-white'
                : 'hover:bg-orange-50 text-text-main'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              active === c ? 'bg-white text-primary' : 'bg-accent text-text-main'
            }`}>{c}</span>
            <span className="truncate">{chapterNames[c]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
