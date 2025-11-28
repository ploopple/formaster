import React, { useState } from 'react';
import Link from 'next/link';
import { formsData, FormTemplate } from '../formsData';
import { FileText, Search, Calendar, FolderOpen, ArrowLeft } from 'lucide-react';
import { useI18n, LanguageToggle } from '../lib/i18n/I18nContext';

interface FormsListProps {
  onSelectForm: (form: FormTemplate) => void;
}

const FormsList: React.FC<FormsListProps> = ({ onSelectForm }) => {
  const { t, language } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(formsData.map(f => f.category).filter(Boolean)))] as string[];

  const filteredForms = formsData.filter(form => {
    const title = form.titleHe && language === 'he' ? form.titleHe : form.title;
    const description = form.descriptionHe && language === 'he' ? form.descriptionHe : form.description;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFormTitle = (form: FormTemplate) => {
    return form.titleHe && language === 'he' ? form.titleHe : form.title;
  };

  const getFormDescription = (form: FormTemplate) => {
    return form.descriptionHe && language === 'he' ? form.descriptionHe : form.description;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="absolute top-4 end-4">
        <LanguageToggle />
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors">
            <ArrowLeft size={20} />
            <span>{t.templates.backToHome}</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">{t.templates.title}</h1>
          <p className="text-slate-600">{t.templates.subtitle}</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={t.templates.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-10 pe-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? t.templates.allForms : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <FolderOpen className="mx-auto mb-4 text-slate-300" size={48} />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t.templates.noFormsFound}</h3>
            <p className="text-slate-500">
              {searchQuery ? t.templates.tryAdjustingSearch : t.templates.addFormTemplates}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map(form => (
              <div
                key={form.id}
                onClick={() => onSelectForm(form)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 mb-1 truncate">{getFormTitle(form)}</h3>
                    {form.category && (
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                        {form.category}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{getFormDescription(form)}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar size={14} />
                  <span>{new Date(form.createdAt).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}</span>
                  <span className="ms-auto">{form.fields.length} {t.common.fields}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsList;
