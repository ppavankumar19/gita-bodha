# 🪷 గీత బాల వనం (Gita Bala Vanam)
### Bhagavad Gita for Children — Telugu Slokas with English UI

> *"విద్యా దదాతి వినయం"* — Knowledge gives humility.

A web application that brings the timeless wisdom of the **Bhagavad Gita** to children through curated Telugu slokas, bhavam (meaning), voice narration, and a searchable library — making moral values accessible and engaging for ages 6–16.

---

## ✨ Features

| Feature | Description | Status |
|---|---|---|
| 📖 **Sloka Library** | 23 curated slokas with Telugu bhavam | ✅ Live |
| 🌐 **Full Gita via API** | Browse all 700 verses across 18 chapters | ✅ Live |
| 🔍 **Smart Search** | Search by keyword, chapter, sloka ID, or virtue | ✅ Live |
| 🔊 **Voice Playback** | Listen to slokas and bhavam via TTS | ✅ Live |
| 🎯 **Virtues** | Slokas tagged with values like Duty, Courage, Compassion | ✅ Live |
| 🌞 **Daily Sloka** | One featured sloka shown on homepage each day | ✅ Live |
| ❤️ **Favorites** | Bookmark slokas, stored in browser localStorage | ✅ Live |
| 📚 **Chapter Browser** | Browse all 18 Adhayayas with verse counts | ✅ Live |
| 📱 **Responsive Design** | Works on mobile, tablet, and desktop | ✅ Live |

---

## 🗂️ Project Structure

```
gita-bodha/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SlokaCard.jsx
│   │   ├── VoicePlayer.jsx
│   │   ├── ChapterNav.jsx
│   │   ├── ThemeTag.jsx
│   │   └── DailySloka.jsx
│   ├── context/
│   │   └── AppContext.jsx         # Favorites state (localStorage)
│   ├── data/
│   │   ├── slokas.js              # 23 curated slokas with Telugu bhavam
│   │   └── chapters.js            # 18 chapters with Telugu names + verse counts
│   ├── hooks/
│   │   ├── useCuratedSlokas.js    # Local curated slokas (no API call)
│   │   ├── useSearch.js           # Fuse.js fuzzy search
│   │   ├── useVoice.js            # TTS playback state
│   │   ├── useGitaVerse.js        # Fetch single verse (local-first, then API)
│   │   └── useGitaChapter.js      # Fetch all verses of a chapter from API
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── SlokaList.jsx
│   │   ├── SlokaView.jsx
│   │   ├── ChaptersPage.jsx
│   │   ├── ThemePage.jsx
│   │   └── ThemesPage.jsx
│   ├── services/
│   │   ├── gitaApi.js             # gita-api.vercel.app client + cache + merge
│   │   ├── ttsService.js          # TTS abstraction (ElevenLabs → Sarvam → Browser)
│   │   ├── elevenLabsApi.js       # ElevenLabs TTS
│   │   └── sarvamApi.js           # Sarvam AI TTS (Telugu native)
│   └── styles/
│       └── global.css
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js                 # Dev proxy: /api/gita → gita-api.vercel.app
├── bhagavadgita.md                # Chapter reference table
├── SCOPE.md
└── SPEC.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+

### Installation

```bash
# Install dependencies
npm install

# Copy the environment file and add your keys
cp .env.example .env

# Start the development server
npm run dev
```

Open your browser at `http://localhost:5173`

---

## 🔑 Environment Variables

```env
# ElevenLabs TTS — optional, for high-quality voice (with voice cloning)
VITE_ELEVENLABS_API_KEY=
VITE_ELEVENLABS_VOICE_ID=

# Sarvam AI — best Telugu TTS quality (already integrated)
VITE_SARVAM_API_KEY=

# Feature flags
VITE_ENABLE_FAVORITES=true
VITE_ENABLE_DAILY_SLOKA=true
VITE_USE_BROWSER_TTS_FALLBACK=true
```

> **Note on chapter browsing:** The app fetches verses from `gita-api.vercel.app` (free, no key required). In development the Vite dev proxy handles CORS automatically. Production deployment needs a reverse proxy for chapter browsing to work.

---

## 🔊 Voice / TTS Options

Priority order — the app uses the first available:

| Priority | Provider | Telugu Quality | Cost | Setup |
|---|---|---|---|---|
| 1 | **ElevenLabs** | Excellent (voice cloning) | Paid | Add API key + voice ID |
| 2 | **Sarvam AI** | Excellent (native Indian) | Paid | Add API key |
| 3 | **Web Speech API** | Basic | Free | None — works out of the box |

---

## 🌐 API Integration

The app uses **`gita-api.vercel.app`** (free, no API key required) to fetch:
- All 700 verses across 18 chapters
- Sanskrit text in Telugu script, transliteration, Telugu bhavam

**Telugu bhavam** for the 23 curated slokas is sourced from local data (`src/data/slokas.js`) and overlaid on top of API data. For verses without local bhavam, the API's Telugu translation is shown.

In development, CORS is handled by the Vite dev proxy (`/api/gita → gita-api.vercel.app`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Search | Fuse.js (fuzzy, offline) |
| Gita Data | gita-api.vercel.app (free) |
| Voice | ElevenLabs / Sarvam AI / Web Speech API |
| State | React Context + useState |
| Persistence | localStorage (favorites) |

---

## 🙏 Acknowledgements

- Bhagavad Gita — Sri Veda Vyasa
- Telugu translations guided by traditional scholars
- Built with love for the children of Andhra Pradesh & Telangana