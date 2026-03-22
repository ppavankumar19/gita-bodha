// Telugu Gita API — https://gita-api.vercel.app
// In dev: requests go through Vite proxy at /api/gita (avoids CORS)
// In prod: requests go directly (deploy behind a reverse proxy or use a CORS-enabled host)
const BASE_URL = import.meta.env.DEV ? '/api/gita' : 'https://gita-api.vercel.app';

const cache = new Map();

async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Telugu Gita API ${res.status}: ${path}`);
  const data = await res.json();
  cache.set(path, data);
  return data;
}

// Map raw API response to our internal shape, optionally merging local metadata
function mapVerse(raw, metadata = {}) {
  if (raw?.error) {
    throw new Error(raw.message || raw.error);
  }

  // Some verses are combined in the API (e.g. verse_no = "5,6") — use first number for ID
  const verseNoRaw = typeof raw.verse_no === 'string'
    ? parseInt(raw.verse_no.split(',')[0], 10)
    : raw.verse_no;
  const verseNo = Number(verseNoRaw);
  const chapterNo = Number(raw.chapter_no);

  if (!Number.isInteger(chapterNo) || !Number.isInteger(verseNo)) {
    throw new Error('Unexpected verse data received from Telugu Gita API');
  }

  // verse field can be a string or an array of lines — normalise to string
  const verseText = Array.isArray(raw.verse)
    ? raw.verse.join('\n')
    : (typeof raw.verse === 'string' ? raw.verse : '');

  // purport may be a single string or an array of paragraphs
  const purportText = Array.isArray(raw.purport)
    ? raw.purport.join('\n\n')
    : (typeof raw.purport === 'string' ? raw.purport : '');

  return {
    id: `${chapterNo}-${verseNo}`,
    chapter: chapterNo,
    verse: verseNo,
    // chapter_name from API includes a "4. " prefix — strip it
    chapter_name_telugu: raw.chapter_name?.replace(/^\d+\.\s*/, '').trim() || '',
    // sloka text, Telugu translation, extended commentary
    sloka_sanskrit: verseText,
    bhavam_telugu: raw.translation || '',
    purport_telugu: purportText,
    audio_link: raw.audio_link || '',
    // enrichment from local curated metadata
    chapter_name_english: metadata.chapter_name_english || '',
    moral_themes: metadata.moral_themes || [],
    difficulty: metadata.difficulty || null,
    age_group: metadata.age_group || null,
    is_featured: metadata.is_featured || false,
    child_summary_telugu: metadata.child_summary_telugu || '',
  };
}

// Fetch a single verse with optional local metadata merged in
export const fetchVerse = async (chapter, verse, metadata = {}) => {
  const raw = await get(`/tel/verse/${chapter}/${verse}`);
  return mapVerse(raw, metadata);
};

// Verse counts per chapter — used to build parallel fetch requests
const CHAPTER_VERSE_COUNTS = {
  1: 47,  2: 72,  3: 43,  4: 42,  5: 29,  6: 47,
  7: 30,  8: 28,  9: 34, 10: 42, 11: 55, 12: 20,
 13: 34, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78,
};

// Fetch all verses of a chapter in parallel (batched to avoid overloading)
export async function fetchChapterVerses(chapterNum) {
  const count = CHAPTER_VERSE_COUNTS[Number(chapterNum)];
  if (!count) throw new Error(`Unknown chapter: ${chapterNum}`);

  const BATCH = 10;
  const results = [];
  for (let i = 1; i <= count; i += BATCH) {
    const batch = Array.from(
      { length: Math.min(BATCH, count - i + 1) },
      (_, j) => fetchVerse(chapterNum, i + j)
    );
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  return results;
}
