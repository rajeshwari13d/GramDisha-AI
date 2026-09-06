import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';

const savedLang = localStorage.getItem('gramdisha-lang');
const activeLang = savedLang === 'hi' ? 'hi' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: activeLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
