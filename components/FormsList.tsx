import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FormTemplate } from '../formsData';
import { formService } from '../services/formService';
import { FileText, Search, Calendar, FolderOpen, ArrowLeft, Copy } from 'lucide-react';
import { useI18n } from '../lib/i18n/I18nContext';

interface FormsListProps {
  onSelectForm: (form: FormTemplate) => void;
  onDuplicateForm?: (form: FormTemplate) => void;
}

const FormsList: React.FC<FormsListProps> = ({ onSelectForm, onDuplicateForm }) => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [forms, setForms] = useState<FormTemplate[]>([]);

  useEffect(() => {
    setForms(formService.getForms());
  }, []);

  const handleDuplicate = (e: React.MouseEvent, form: FormTemplate) => {
    e.stopPropagation();
    const duplicatedForm = formService.duplicateForm(form);
    setForms(formService.getForms());
    if (onDuplicateForm) {
      onDuplicateForm(duplicatedForm);
    }
  };

  const categories = ['all', ...Array.from(new Set(forms.map(f => f.category).filter(Boolean)))] as string[];

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-8 safe-area-inset-top safe-area-inset-bottom">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 active:text-blue-700 mb-3 md:mb-4 transition-colors touch-manipulation p-1 -ml-1">
            <ArrowLeft size={20} />
            <span>{t.templates.backToHome}</span>
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-1 md:mb-2">{t.templates.title}</h1>
          <p className="text-sm md:text-base text-slate-600">{t.templates.subtitle}</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={t.templates.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-10 pe-4 py-3 md:py-2 border border-slate-300 rounded-xl md:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 md:py-2 rounded-xl md:rounded-lg text-sm font-medium whitespace-nowrap transition-all touch-manipulation active:scale-95 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300'
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
            <FolderOpen className="mx-auto mb-4 text-slate-300" size={48} />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t.templates.noFormsFound}</h3>
            <p className="text-sm md:text-base text-slate-500">
              {searchQuery ? t.templates.tryAdjustingSearch : t.templates.addFormTemplates}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredForms.map(form => (
              <div
                key={form.id}
                onClick={() => onSelectForm(form)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-lg hover:border-blue-300 active:bg-slate-50 transition-all cursor-pointer group touch-manipulation"
              >
                <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 mb-1 truncate text-base">{form.title}</h3>
                    {form.category && (
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                        {form.category}
                      </span>
                    )}
                  </div>
                  {onDuplicateForm && (
                    <button
                      onClick={(e) => handleDuplicate(e, form)}
                      className="p-2.5 md:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100 touch-manipulation"
                      title={t.templates.duplicateForm}
                    >
                      <Copy size={18} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-3 md:mb-4 line-clamp-2">{form.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar size={14} />
                  <span>{new Date(form.createdAt).toLocaleDateString('en-US')}</span>
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
