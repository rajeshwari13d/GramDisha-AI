import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeech, subscribeToSpeechStatus, isSpeechSupported } from '../services/voiceAssistant';

export default function VoiceButton({ text, language = 'hi', label = '', className = '', size = 'md' }) {
  const [speaking, setSpeaking] = useState(false);
  const supported = isSpeechSupported();

  useEffect(() => {
    const unsubscribe = subscribeToSpeechStatus((isSpeaking) => {
      setSpeaking(isSpeaking);
    });
    return () => unsubscribe();
  }, []);

  if (!supported) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeech();
    } else {
      speakText(text, language);
    }
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <button
      type="button"
      onClick={handleClick}
      title={speaking ? (language === 'hi' ? 'आवाज बंद करें' : 'Stop Audio') : (language === 'hi' ? 'बोलकर सुनें' : 'Listen to Audio')}
      className={`inline-flex items-center gap-1.5 font-bold transition-all duration-150 cursor-pointer select-none rounded-lg border ${
        speaking
          ? 'bg-[var(--color-caution-bg)] text-[var(--color-caution)] border-[var(--color-caution-border)] shadow-xs animate-pulse ring-1 ring-[var(--color-caution)]'
          : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)]'
      } ${
        isSmall
          ? 'px-2 py-1 text-xs'
          : isLarge
          ? 'px-4 py-2 text-sm shadow-xs'
          : 'px-3 py-1.5 text-xs'
      } ${className}`}
      aria-label={label || 'Listen to Audio'}
    >
      {speaking ? (
        <VolumeX className={isSmall ? 'w-3.5 h-3.5' : isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : (
        <Volume2 className={isSmall ? 'w-3.5 h-3.5 text-[var(--color-positive)]' : isLarge ? 'w-5 h-5 text-[var(--color-positive)]' : 'w-4 h-4 text-[var(--color-positive)]'} />
      )}
      <span>{label || (speaking ? (language === 'hi' ? 'रोकें' : 'Stop') : (language === 'hi' ? 'सुनें' : 'Listen'))}</span>
    </button>
  );
}
