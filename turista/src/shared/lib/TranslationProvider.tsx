'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FALLBACK_DATA, PUBLIC_LINKS } from '../config/public-data';
import { FALLBACK_DATA_EN, PUBLIC_LINKS_EN } from '../config/public-data-en';

type Language = 'es' | 'en';

interface TranslationContextType {
  language: Language;
  toggleLanguage: () => void;
  data: typeof FALLBACK_DATA;
  links: typeof PUBLIC_LINKS;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('mochotours_lang') as Language;
    if (saved && (saved === 'es' || saved === 'en')) {
      setLanguage(saved);
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
      setLanguage(browserLang);
      localStorage.setItem('mochotours_lang', browserLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    localStorage.setItem('mochotours_lang', newLang);
  };

  const data = language === 'es' ? FALLBACK_DATA : FALLBACK_DATA_EN;
  const links = language === 'es' ? PUBLIC_LINKS : PUBLIC_LINKS_EN;

  // Evitar hydration mismatch renderizando el default 'es' en el servidor
  const currentData = mounted ? data : FALLBACK_DATA;
  const currentLinks = mounted ? links : PUBLIC_LINKS;

  return (
    <TranslationContext.Provider value={{ language, toggleLanguage, data: currentData, links: currentLinks }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
