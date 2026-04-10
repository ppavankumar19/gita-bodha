# Development Guide — Gita Bala Vanam

This document covers how to set up, run, build, and deploy the project.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (comes with Node.js)
- **Git**

---

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd gita-bodha

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
# Edit .env and add your API keys (optional — app works without them)
```

---

## Running Locally

```bash
npm run dev
```

- Opens at `http://localhost:5173`
- Hot module reload enabled — changes reflect instantly
- Vite automatically proxies `/api/gita/*` → `https://gita-api.vercel.app/*` to bypass CORS

---

## Building for Production

```bash
npm run build
```

- Output goes to `dist/`
- Runs Tailwind CSS purge (removes unused classes)
- Bundles and minifies JS/CSS

```bash
npm run preview
```

- Previews the production build locally at `http://localhost:4173`
- Use this to verify the build before deploying

---

## Project Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Production bundle to `dist/` |
| Preview | `npm run preview` | Serve `dist/` locally |

---

## Environment Variables

All runtime config is via `.env`. The file is gitignored — never commit it.

```bash
# .env (copy from .env.example)

# Gita API proxy base (do not change)
VITE_API_BASE=/api/gita

# TTS providers (optional — app uses browser TTS if not set)
VITE_ELEVENLABS_API_KEY=
VITE_ELEVENLABS_VOICE_ID=
VITE_SARVAM_API_KEY=

# Feature flags
VITE_ENABLE_FAVORITES=true
VITE_ENABLE_DAILY_SLOKA=true
VITE_USE_BROWSER_TTS_FALLBACK=true
```

All `VITE_` prefixed variables are bundled into the client at build time via `import.meta.env.VITE_*`.

---

## Deployment

### Render (recommended)

1. Connect the GitHub repo to Render
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add a **Redirect/Rewrite rule** for CORS proxy:
   - Source: `/api/gita/*`
   - Destination: `https://gita-api.vercel.app/:splat`
   - Status: `200` (proxy, not redirect)
5. Add environment variables from `.env` in the Render dashboard

### Vercel / Netlify

1. Connect repo, set build command `npm run build`, output `dist`
2. Add a `vercel.json` or `netlify.toml` rewrites rule for `/api/gita/*`
3. Add environment variables in dashboard

**Vercel example (`vercel.json`):**
```json
{
  "rewrites": [
    {
      "source": "/api/gita/:path*",
      "destination": "https://gita-api.vercel.app/:path*"
    }
  ]
}
```

**Netlify example (`netlify.toml`):**
```toml
[[redirects]]
  from = "/api/gita/*"
  to = "https://gita-api.vercel.app/:splat"
  status = 200
```

---

## Adding New Slokas

Curated slokas live in `src/data/slokas.js`. To add a new one:

```js
{
  id: '3-16',                          // "{chapter}-{verse}" — must be unique
  chapter: 3,
  verse: 16,
  chapter_name_english: 'Karma Yoga',
  chapter_name_telugu: 'కర్మ యోగం',
  sloka_sanskrit: `ఏవం ప్రవర్తితం చక్రం...`,   // exact verse text
  bhavam_telugu: `ఈ విధంగా...`,                 // meaning in Telugu
  child_summary_telugu: `పిల్లలకు అర్థమయ్యే...`, // simple explanation
  moral_themes: ['Duty', 'Responsibility'],      // English virtue names
  difficulty: 'beginner',                        // 'beginner' | 'intermediate'
  age_group: '10+',
  is_featured: false,
}
```

The new sloka is immediately available in search, theme filtering, and the curated slokas list. No API call needed.

---

## Adding a New Page/Route

1. Create `src/pages/NewPage.jsx`
2. Import it in `src/App.jsx`
3. Add a `<Route path="/new-path" element={<NewPage />} />` inside `<Routes>`
4. Add a nav link in `src/components/Header.jsx` if needed

---

## Code Conventions

- **File naming:** PascalCase for components (`SlokaCard.jsx`), camelCase for hooks (`useVoice.js`) and services (`gitaApi.js`)
- **Telugu text:** Always use `font-telugu` class (`Noto Sans Telugu` font)
- **English UI:** Always use `font-ui` class (`Poppins` font)
- **Telugu detection:** Check `/[\u0C00-\u0C7F]/.test(text)` to detect Telugu script
- **IDs:** Sloka IDs are always `"{chapter}-{verse}"` strings (e.g. `"2-47"`)
- **Voice:** Always go through `useVoice()` hook — never call `ttsService` directly from components

---

## Known Limitations

1. **Chapter browsing requires the CORS proxy** to work in production. Without proper Render/Vercel rewrites, chapter pages will show an API error.

2. **TTS quality depends on what's configured.** Without API keys, the browser's built-in `te-IN` voice is used — quality varies by browser and OS.

3. **No offline support.** Curated slokas (23) work offline since they're embedded in the bundle, but chapter browsing (700 verses) requires network access.

4. **API rate limits.** The free Telugu Gita API has no documented rate limits but loading very large chapters (Chapter 18 has 78 verses) may occasionally fail for individual verses.
