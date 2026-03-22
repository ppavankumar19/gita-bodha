export async function sarvamSpeak(text, { rate = 1.0, onStart, onEnd, onError }) {
  const apiKey = import.meta.env.VITE_SARVAM_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('Missing VITE_SARVAM_API_KEY');
  }

  const response = await fetch('https://api.sarvam.ai/text-to-speech/stream', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      target_language_code: 'te-IN',
      speaker: 'simran',
      model: 'bulbul:v3',
      pace: 1,
      speech_sample_rate: 22050,
      output_audio_codec: 'mp3',
      enable_preprocessing: true,
    }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Sarvam AI ${response.status}: ${msg}`);
  }

  const blob = await response.blob();
  if (!blob || blob.size === 0) {
    throw new Error('No audio returned from Sarvam AI');
  }

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  audio.playbackRate = rate;
  audio.onplay = () => { if (onStart) onStart(); };
  audio.onended = () => { URL.revokeObjectURL(url); if (onEnd) onEnd(); };
  audio.onerror = (e) => { URL.revokeObjectURL(url); if (onError) onError(e); };

  return audio;
}
