export async function elevenLabsSpeak(text, { onStart, onEnd, onError }) {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!response.ok) throw new Error(`ElevenLabs ${response.status}`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);
  audio.onplay = () => { if (onStart) onStart(); };
  audio.onended = () => { URL.revokeObjectURL(url); if (onEnd) onEnd(); };
  audio.onerror = (e) => { URL.revokeObjectURL(url); if (onError) onError(e); };

  return audio; // caller will invoke .play()
}
