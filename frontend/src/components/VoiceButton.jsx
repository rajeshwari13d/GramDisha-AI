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
      title={speaking ? 'आवाज बंद करें / Stop Voice' : 'बोलकर सुनें / Listen to Audio'}
      className={`inline-flex items-center gap-1.5 font-bold transition-all duration-200 cursor-pointer select-none rounded-full ${
        speaking
          ? 'bg-amber-500 text-white shadow-md animate-pulse ring-2 ring-amber-300'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
      } ${
        isSmall
          ? 'px-2.5 py-1 text-xs'
          : isLarge
          ? 'px-4 py-2 text-sm shadow-sm'
          : 'px-3 py-1.5 text-xs'
      } ${className}`}
      aria-label={label || 'Listen to Voice'}
    >
      {speaking ? (
        <VolumeX className={isSmall ? 'w-3.5 h-3.5' : isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : (
        <Volume2 className={isSmall ? 'w-3.5 h-3.5 text-emerald-600' : isLarge ? 'w-5 h-5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
      )}
      <span>{label || (speaking ? (language === 'hi' ? 'रोकें' : 'Stop') : (language === 'hi' ? 'सुनें 🔊' : 'Listen 🔊'))}</span>
    </button>
  );
}
