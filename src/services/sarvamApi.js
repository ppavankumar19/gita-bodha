export async function sarvamSpeak(text, { rate = 0.75, onStart, onEnd, onError }) {
  const apiKey = import.meta.env.VITE_SARVAM_API_KEY;

  const response = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,   // correct Sarvam auth header
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: 'te-IN',
      speaker: 'anushka',
      speech_sample_rate: 22050,
      enable_preprocessing: false,
      model: 'bulbul:v2',
    }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Sarvam AI ${response.status}: ${msg}`);
  }

  const data = await response.json();
  const base64Audio = data.audios?.[0];
  if (!base64Audio) throw new Error('No audio returned from Sarvam AI');

  // Decode base64 → WAV blob → Audio element
  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);
  audio.playbackRate = rate;
  audio.onplay = () => { if (onStart) onStart(); };
  audio.onended = () => { URL.revokeObjectURL(url); if (onEnd) onEnd(); };
  audio.onerror = (e) => { URL.revokeObjectURL(url); if (onError) onError(e); };

  return audio; // caller will invoke .play()
}
