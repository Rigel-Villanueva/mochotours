'use client';

import { useTranslation } from '@/shared/lib/TranslationProvider';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LanguageToggle() {
  const { language, toggleLanguage } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Evita el hydration mismatch de los componentes en cliente
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-stone-100 text-stone-700 opacity-50 cursor-default">
        <Globe className="w-4 h-4" />
        ES/EN
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors shadow-sm border border-stone-200"
      aria-label="Toggle language / Cambiar idioma"
    >
      <Globe className="w-4 h-4 text-stone-500" />
      <span className="w-5 text-center">
        {language === 'es' ? 'ES' : 'EN'}
      </span>
    </button>
  );
}
