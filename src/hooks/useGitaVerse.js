import { useState, useEffect } from 'react';
import { fetchVerse } from '../services/gitaApi';
import { getSlokaById } from '../data/slokas';

export function useGitaVerse(id) {
  const local = getSlokaById(id);

  // If the sloka is in our curated local data (has bhavam_telugu), return it instantly
  const [data, setData] = useState(local?.bhavam_telugu ? local : null);
  const [loading, setLoading] = useState(!local?.bhavam_telugu);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setError('Invalid sloka ID');
      setLoading(false);
      return;
    }

    let isActive = true;

    // Curated sloka — already have full data locally, no API call needed
    if (local?.bhavam_telugu) {
      setData(local);
      setError(null);
      setLoading(false);
      return () => { isActive = false; };
    }

    // Non-curated verse — fetch from Telugu API via proxy
    const [chapter, verse] = id.split('-');
    if (!chapter || !verse) {
      setData(null);
      setError('Invalid sloka ID');
      setLoading(false);
      return () => { isActive = false; };
    }

    setLoading(true);
    setError(null);

    fetchVerse(chapter, verse, local || {})
      .then((result) => {
        if (!isActive) return;
        setData(result);
      })
      .catch((err) => {
        if (!isActive) return;
        setData(null);
        setError(err.message);
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => { isActive = false; };
  }, [id]);

  return { data, loading, error };
}
