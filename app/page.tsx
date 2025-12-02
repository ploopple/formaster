'use client';

import Link from 'next/link';
import { FileUp, List, PenTool } from 'lucide-react';
import { useI18n } from '../lib/i18n/I18nContext';

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <PenTool size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.home.title}</h1>
        <p className="text-slate-500 mb-8">{t.home.subtitle}</p>
        
        <div className="space-y-3">
          <Link
            href="/templates"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2"
          >
            <List size={20} />
            <span>{t.home.browseTemplates}</span>
          </Link>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-500">{t.common.or}</span>
            </div>
          </div>
          
          <Link
            href="/editor"
            className="block w-full"
          >
            <div className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-slate-500/30 active:scale-95 flex items-center justify-center gap-2">
              <FileUp size={20} />
              <span>{t.home.uploadNewPdf}</span>
            </div>
          </Link>
        </div>
        
        <p className="mt-4 text-xs text-slate-400">{t.home.supportedFormats}</p>
      </div>
    </div>
  );
}
