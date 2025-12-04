'use client';

import Link from 'next/link';
import { FileUp, List, PenTool, LogOut, User, Plus } from 'lucide-react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { useAuth } from '../../lib/firebase';
import AuthGuard from '../../components/AuthGuard';

function DashboardContent() {
  const { t } = useI18n();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 safe-area-inset-top safe-area-inset-bottom">
      {/* Auth status indicator */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-100">
            <User size={16} className="text-slate-500" />
            <span className="text-sm text-slate-600 max-w-[150px] truncate">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg shadow-sm border border-slate-100 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center border border-slate-100">
        <div className="w-16 h-16 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6">
          <PenTool size={32} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{t.home.title}</h1>
        <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8">{t.home.subtitle}</p>
        
        <div className="space-y-3">
          <Link
            href="/templates"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation text-base"
          >
            <List size={22} />
            <span>{t.home.browseTemplates}</span>
          </Link>
          
          <Link
            href="/create"
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation text-base"
          >
            <Plus size={22} />
            <span>Create New Form</span>
          </Link>
          
          <Link
            href="/editor"
            className="block w-full"
          >
            <div className="w-full bg-slate-600 hover:bg-slate-700 active:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-slate-500/30 active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation text-base">
              <FileUp size={22} />
              <span>{t.home.uploadNewPdf}</span>
            </div>
          </Link>
        </div>
        
        <p className="mt-4 text-xs text-slate-400">{t.home.supportedFormats}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
