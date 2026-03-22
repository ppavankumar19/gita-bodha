import { useState, useEffect } from 'react';
import { fetchChapterVerses } from '../services/gitaApi';
import { getSlokaById } from '../data/slokas';
import { CHAPTERS } from '../data/chapters';

export function useGitaChapter(chapterNum) {
  const [verses, setVerses] = useState([]);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chapterNum) {
      setVerses([]);
      setChapterInfo(null);
      setError('Invalid chapter');
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);
    setError(null);
    setVerses([]);

    // Set chapter info immediately from local data
    const info = CHAPTERS.find(c => c.chapter_number === Number(chapterNum));
    setChapterInfo(info || null);

    fetchChapterVerses(chapterNum)
      .then(fetched => {
        if (!isActive) return;
        // Merge API verses with any local curated metadata
        const enriched = fetched.map(v => {
          const meta = getSlokaById(v.id);
          if (!meta) return v;
          return {
            ...v,
            moral_themes: meta.moral_themes,
            difficulty: meta.difficulty,
            age_group: meta.age_group,
            is_featured: meta.is_featured,
            child_summary_telugu: meta.child_summary_telugu || v.child_summary_telugu,
          };
        });
        setVerses(enriched);
      })
      .catch(err => {
        if (!isActive) return;
        setError(err.message);
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => { isActive = false; };
  }, [chapterNum]);

  return { verses, chapterInfo, loading, error };
}
