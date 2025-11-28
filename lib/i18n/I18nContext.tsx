'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { en, he, ru, ar, am, TranslationKeys } from './index';

export type Language = 'en' | 'he' | 'ru' | 'ar' | 'am';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
}

const translations: Record<Language, TranslationKeys> = {
  en,
  he,
  ru,
  ar,
  am,
};

const rtlLanguages: Language[] = ['he', 'ar'];

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  defaultLanguage = 'en' 
}) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // Load saved language preference on mount
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('app-language') as Language | null;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  // Update document direction when language changes
  useEffect(() => {
    if (mounted) {
      const isRTL = rtlLanguages.includes(language);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  }, []);

  const isRTL = rtlLanguages.includes(language);
  const dir = isRTL ? 'rtl' : 'ltr';
  const t = translations[language];

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    isRTL,
    dir,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Helper hook for getting just translations
export const useTranslations = () => {
  const { t } = useI18n();
  return t;
};

// Language names for display
const languageNames: Record<Language, { native: string; short: string }> = {
  en: { native: 'English', short: 'EN' },
  he: { native: 'עברית', short: 'עב' },
  ru: { native: 'Русский', short: 'RU' },
  ar: { native: 'العربية', short: 'عر' },
  am: { native: 'አማርኛ', short: 'አማ' },
};

// Language switcher component (dropdown)
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useI18n();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className={`px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-sm ${className}`}
    >
      <option value="en">English</option>
      <option value="he">עברית</option>
      <option value="ru">Русский</option>
      <option value="ar">العربية</option>
      <option value="am">አማርኛ</option>
    </select>
  );
};

// Button-style language toggle (cycles through languages)
export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useI18n();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: Language[] = ['en', 'he', 'ru', 'ar', 'am'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-sm font-medium transition-colors ${className}`}
        title="Change language"
      >
        {languageNames[language].short}
      </button>
      {showDropdown && (
        <div className="absolute top-full mt-1 end-0 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[120px] py-1">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setShowDropdown(false);
              }}
              className={`w-full px-3 py-2 text-start text-sm hover:bg-slate-100 transition-colors ${
                language === lang ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700'
              }`}
            >
              {languageNames[lang].native}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
