import { useState, useCallback } from 'react';
import { speak, stop, pause, resume } from '../services/ttsService';

export function useVoice() {
  const [status, setStatus] = useState('idle');
  const [rate, setRate] = useState(0.75);

  const playText = useCallback(async (text, lang = 'te-IN') => {
    if (!text) return;

    if (status === 'playing') {
      stop();
      setStatus('idle');
      return;
    }

    setStatus('loading');

    try {
      await speak(text, {
        lang,
        rate,
        onStart: () => setStatus('playing'),
        onEnd: () => setStatus('idle'),
        onError: () => setStatus('error'),
      });
    } catch (err) {
      console.error('playText error:', err);
      setStatus('error');
    }
  }, [status, rate]);

  const handlePause = useCallback(() => {
    if (status === 'playing') {
      pause();
      setStatus('paused');
    } else if (status === 'paused') {
      resume();
      setStatus('playing');
    }
  }, [status]);

  const handleStop = useCallback(() => {
    stop();
    setStatus('idle');
  }, []);

  return { status, rate, setRate, playText, handlePause, handleStop };
}
