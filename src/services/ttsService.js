import { elevenLabsSpeak } from './elevenLabsApi';
import { sarvamSpeak } from './sarvamApi';

let currentAudio = null;

export async function speak(text, options = {}) {
  const { lang = 'te-IN', rate = 1.0, onStart, onEnd, onError } = options;

  stop(); // stop anything currently playing

  // Try ElevenLabs
  if (import.meta.env.VITE_ELEVENLABS_API_KEY) {
    try {
      const audio = await elevenLabsSpeak(text, { onStart, onEnd, onError });
      currentAudio = audio;
      await audio.play();
      return;
    } catch (err) {
      console.warn('ElevenLabs failed, falling back:', err);
    }
  }

  // Try Sarvam AI
  if (import.meta.env.VITE_SARVAM_API_KEY) {
    try {
      const audio = await sarvamSpeak(text, { rate, onStart, onEnd, onError });
      currentAudio = audio;
      await audio.play();
      return;
    } catch (err) {
      console.warn('Sarvam AI failed, falling back to browser TTS:', err);
    }
  }

  // Browser TTS fallback — always works
  browserSpeak(text, { lang, rate, onStart, onEnd, onError });
}

export function stop() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  try { window.speechSynthesis.cancel(); } catch (_) {}
}

export function pause() {
  if (currentAudio) {
    currentAudio.pause();
  } else {
    try { window.speechSynthesis.pause(); } catch (_) {}
  }
}

export function resume() {
  if (currentAudio) {
    currentAudio.play();
  } else {
    try { window.speechSynthesis.resume(); } catch (_) {}
  }
}

function browserSpeak(text, { lang, rate, onStart, onEnd, onError }) {
  if (!window.speechSynthesis) {
    console.error('Speech synthesis not supported');
    if (onError) onError(new Error('Not supported'));
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.error('Browser TTS error:', e);
    if (onError) onError(e);
  };
  // Slight delay ensures cancel() is processed before speak()
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
    if (onStart) onStart();
  }, 150);
}
