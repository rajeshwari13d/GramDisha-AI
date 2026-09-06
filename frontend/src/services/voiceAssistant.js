// GramDisha AI — Web Speech Synthesis Utility for Rural Voice Assistance

let currentUtterance = null;
let isSpeakingState = false;
const listeners = new Set();

export const isSpeechSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const subscribeToSpeechStatus = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const notifyListeners = (speaking) => {
  isSpeakingState = speaking;
  listeners.forEach((cb) => cb(speaking));
};

export const speakText = (text, language = 'hi') => {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Stop any currently running speech
  window.speechSynthesis.cancel();

  if (!text || text.trim() === '') {
    notifyListeners(false);
    return;
  }

  const cleanText = text
    .replace(/[#*`_~]/g, '') // remove markdown symbols
    .replace(/₹/g, ' रुपये ') // pronounce currency in Hindi/English
    .replace(/(\d+)\s*L/gi, '$1 लाख')
    .replace(/(\d+)\s*k/gi, '$1 हजार')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  // Set language & voice
  const langCode = language === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.lang = langCode;
  utterance.rate = language === 'hi' ? 0.95 : 1.0; // Slightly slower pace for clarity
  utterance.pitch = 1.0;

  // Attempt to select an Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const matchedVoice = voices.find(
      (v) =>
        (language === 'hi' && (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'))) ||
        (language === 'en' && (v.lang === 'en-IN' || v.name.toLowerCase().includes('india')))
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  utterance.onstart = () => {
    notifyListeners(true);
  };

  utterance.onend = () => {
    notifyListeners(false);
    currentUtterance = null;
  };

  utterance.onerror = () => {
    notifyListeners(false);
    currentUtterance = null;
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
    notifyListeners(false);
    currentUtterance = null;
  }
};

export const toggleSpeech = (text, language = 'hi') => {
  if (isSpeakingState) {
    stopSpeech();
  } else {
    speakText(text, language);
  }
};
