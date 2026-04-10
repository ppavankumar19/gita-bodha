# API Integration Guide — Gita Bala Vanam

This document covers all external API integrations: the Telugu Gita data API and the three-tier TTS (Text-to-Speech) system.

---

## 1. Telugu Gita API

**Provider:** [gita-api.vercel.app](https://gita-api.vercel.app)
**Authentication:** None required (free, public)
**Client:** `src/services/gitaApi.js`

### Endpoint Used

```
GET /tel/verse/{chapter}/{verse}
```

Example: `/tel/verse/2/47` returns Bhagavad Gita Chapter 2, Verse 47 in Telugu.

### CORS Proxy

The API does not include permissive CORS headers for all origins, so a proxy is needed:

**Development (Vite dev server):**
```js
// vite.config.js
proxy: {
  '/api/gita': {
    target: 'https://gita-api.vercel.app',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/gita/, ''),
  }
}
```

**Production (Render):**
Set up Render Redirects/Rewrites to forward `/api/gita/*` → `https://gita-api.vercel.app/*`.

All fetch calls in `gitaApi.js` use the relative path `/api/gita/...`, so they work identically in dev and production.

### In-Memory Cache

```js
const cache = new Map();
// Keys: "/tel/verse/2/47"
// Values: normalised verse object
```

Cache is per browser session. Repeated navigation to the same verse or re-opening a chapter does not re-fetch.

### Batch Chapter Fetching

Chapter pages fetch all verses in parallel, batched 15 at a time to avoid overwhelming the API:

```
Chapter 2 has 72 verses:
  Batch 1: verses 1–15   (15 parallel requests)
  Batch 2: verses 16–30
  Batch 3: verses 31–45
  Batch 4: verses 46–60
  Batch 5: verses 61–72
```

Individual verse failures are caught and skipped (null-filtered) so one bad verse doesn't break the whole chapter.

### Normalised Verse Shape

After `mapVerse()`, every verse has this consistent shape regardless of API quirks:

```ts
{
  id: string;                    // "2-47"
  chapter: number;               // 2
  verse: number;                 // 47
  chapter_name_telugu: string;   // "సాంఖ్య యోగం"
  sloka_sanskrit: string;        // verse text (Telugu script)
  bhavam_telugu: string;         // translation
  purport_telugu: string;        // extended commentary
  audio_link: string;            // URL from API (may be empty)
  // --- enriched from local slokas.js if matched ---
  chapter_name_english: string;
  moral_themes: string[];
  difficulty: 'beginner' | 'intermediate' | null;
  age_group: string | null;
  is_featured: boolean;
  child_summary_telugu: string;
}
```

---

## 2. TTS System (Three-Tier Waterfall)

**Abstraction:** `src/services/ttsService.js`
**Providers (in priority order):**

```
1. ElevenLabs   ← best quality, voice cloning, requires API key
2. Sarvam AI    ← native Indian language TTS, requires API key
3. Web Speech   ← built-in browser, always works, no API key
```

The system tries providers in order. If one fails (API error, missing key, network issue), it falls back automatically to the next.

---

### Provider 1: ElevenLabs

**Client:** `src/services/elevenLabsApi.js`
**Endpoint:** `POST https://api.elevenlabs.io/v1/text-to-speech/{voiceId}`
**Env var:** `VITE_ELEVENLABS_API_KEY`, `VITE_ELEVENLABS_VOICE_ID`
**Model:** `eleven_multilingual_v2`

**Request:**
```json
{
  "text": "కర్మణ్యేవాధికారస్తే...",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": { "stability": 0.5, "similarity_boost": 0.75 }
}
```

**Response:** Binary audio stream → `Blob` → `URL.createObjectURL()` → `Audio` element

**Flow:**
```
elevenLabsSpeak(text, { onStart, onEnd, onError })
  → POST to ElevenLabs with Authorization header
  → response.blob() → URL.createObjectURL(blob)
  → new Audio(url)
  → audio.onended → URL.revokeObjectURL(url) + onEnd()
  → return Audio element
```

Activated when: `VITE_ELEVENLABS_API_KEY` is set in `.env`.

---

### Provider 2: Sarvam AI

**Client:** `src/services/sarvamApi.js`
**Endpoint:** `POST https://api.sarvam.ai/text-to-speech/stream`
**Env var:** `VITE_SARVAM_API_KEY`
**Speaker:** `simran`
**Model:** `bulbul:v3`
**Language:** `te-IN` (Telugu)

**Request:**
```json
{
  "inputs": ["కర్మణ్యేవాధికారస్తే..."],
  "target_language_code": "te-IN",
  "speaker": "simran",
  "pitch": 0,
  "pace": 0.85,
  "loudness": 1.5,
  "speech_sample_rate": 8000,
  "enable_preprocessing": true,
  "model": "bulbul:v3"
}
```

**Response:** Audio stream → `Blob` → `URL.createObjectURL()` → `Audio` element

Activated when: `VITE_SARVAM_API_KEY` is set in `.env` and ElevenLabs is not available or fails.

---

### Provider 3: Web Speech API (Browser TTS)

**Built-in browser API, no key required.**
**Language:** `te-IN`
**Rate:** controlled by `voiceRate` from `AppContext` (0.5, 0.75, 1.0)

```js
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'te-IN';
utterance.rate = rate;
window.speechSynthesis.speak(utterance);
```

A 150ms delay is applied before `speak()` to ensure any previous `cancel()` has been fully processed by the browser's synthesis queue.

**Limitations:**
- Voice quality depends on OS/browser
- Some browsers have limited Telugu voice support
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)

---

## 3. Environment Variables

All API keys are configured via environment variables. Copy `.env.example` to `.env` and fill in values:

```bash
# Telugu Gita API — no key required, just the proxy prefix
VITE_API_BASE=/api/gita

# ElevenLabs TTS (optional — enables high-quality voice cloning)
VITE_ELEVENLABS_API_KEY=your_key_here
VITE_ELEVENLABS_VOICE_ID=your_voice_id_here

# Sarvam AI TTS (optional — enables native Telugu TTS)
VITE_SARVAM_API_KEY=your_key_here

# Feature flags
VITE_ENABLE_FAVORITES=true
VITE_ENABLE_DAILY_SLOKA=true
VITE_USE_BROWSER_TTS_FALLBACK=true
```

**Important:** `.env` is listed in `.gitignore` and must never be committed. Use `.env.example` as the template.

---

## 4. TTS Audio Lifecycle

```
speak(text, options)
  │
  ├── stop()          ← cancels any currently playing audio
  │
  ├── ElevenLabs / Sarvam:
  │     fetch API → Blob → URL.createObjectURL → new Audio
  │     audio.oncanplaythrough → onStart()
  │     audio.onended → URL.revokeObjectURL(url) → onEnd()
  │     audio.onerror → URL.revokeObjectURL(url) → onError()
  │     currentAudio = audio
  │
  └── Web Speech:
        new SpeechSynthesisUtterance
        utterance.onstart → onStart()
        utterance.onend → onEnd()
        utterance.onerror → onError()
        window.speechSynthesis.speak(utterance)

stop()
  ├── currentAudio?.pause()
  ├── currentAudio.currentTime = 0
  ├── currentAudio = null
  └── window.speechSynthesis.cancel()

pause()
  ├── currentAudio?.pause()
  └── window.speechSynthesis.pause()

resume()
  ├── currentAudio?.play()
  └── window.speechSynthesis.resume()
```

---

## 5. Adding a New TTS Provider

To add a new TTS provider to the waterfall:

1. Create `src/services/myProviderApi.js` with a `myProviderSpeak(text, { onStart, onEnd, onError })` function that returns an `Audio` element.
2. In `ttsService.js`, add a new `if (import.meta.env.VITE_MY_PROVIDER_API_KEY)` block before the browser TTS fallback.
3. Add `VITE_MY_PROVIDER_API_KEY` to `.env.example`.
