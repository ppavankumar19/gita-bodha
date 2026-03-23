import { useCallback } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Enhanced useVoice hook that uses the global AppContext state.
 * This ensures that only one sloka plays at a time and all UI 
 * components stay in sync.
 */
export function useVoice() {
  const { 
    playingId, voiceStatus, voiceRate, setVoiceRate,
    playSloka, stopGlobalVoice, pauseGlobalVoice, resumeGlobalVoice
  } = useApp();

  const playText = useCallback(async (text, id = 'unknown') => {
    await playSloka(id, text);
  }, [playSloka]);

  const handlePause = useCallback(() => {
    if (voiceStatus === 'playing') {
      pauseGlobalVoice();
    } else if (voiceStatus === 'paused') {
      resumeGlobalVoice();
    }
  }, [voiceStatus, pauseGlobalVoice, resumeGlobalVoice]);

  const handleStop = useCallback(() => {
    stopGlobalVoice();
  }, [stopGlobalVoice]);

  return { 
    status: voiceStatus, 
    rate: voiceRate, 
    setRate: setVoiceRate, 
    playText, 
    handlePause, 
    handleStop,
    playingId
  };
}
