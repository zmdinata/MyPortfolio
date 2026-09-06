import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from '../data/translations';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang');
    return saved || 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'id' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let val = translations[lang];
      for (const k of keys) {
        if (val && typeof val === 'object') {
          val = val[k];
        } else {
          return key;
        }
      }
      return val || key;
    },
    [lang]
  );

  const tObj = useCallback(
    (obj) => {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      return obj[lang] || obj.en || '';
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggleLang, t, tObj }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within LangProvider');
  return context;
}
