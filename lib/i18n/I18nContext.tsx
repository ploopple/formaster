'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { en, TranslationKeys } from './index';

interface I18nContextType {
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const value: I18nContextType = {
    t: en,
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

export const useTranslations = () => {
  const { t } = useI18n();
  return t;
};
