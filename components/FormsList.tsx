'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Download, FileText, FolderOpen, Plus, Search, Trash2 } from 'lucide-react';
import { useI18n } from '../lib/i18n/I18nContext';
import { localForms, type FormTemplateData, type SavedPdfData } from '../lib/localForms';
import { countries } from '../lib/countries';

interface FormsListProps { onSelectForm: (form: FormTemplateData) => void }

const FormsList: React.FC<FormsListProps> = ({ onSelectForm }) => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('all');
  const [forms, setForms] = useState<FormTemplateData[]>([]);
  const [pdfs, setPdfs] = useState<SavedPdfData[]>([]);
  const [tab, setTab] = useState<'forms' | 'pdfs'>('forms');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [savedForms, savedPdfs] = await Promise.all([localForms.list(), localForms.listPdfs()]);
      setForms(savedForms);
      setPdfs(savedPdfs);
    } catch (error) {
      console.error('Failed to load browser files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const filteredForms = forms.filter(form =>
    `${form.title} ${form.description}`.toLowerCase().includes(query.toLowerCase()) &&
    (country === 'all' || form.country === country)
  );

  const download = (pdf: SavedPdfData) => {
    const url = URL.createObjectURL(pdf.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = pdf.name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 safe-area-inset-top">
        <div className="max-w-6xl mx-auto px-3 md:px-8 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white"><FileText size={18} /></div><span className="font-bold text-lg text-slate-800">Smart PDF Filler</span></Link>
          <Link href="/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm"><Plus size={18} /><span>Create Form</span></Link>
        </div>
      </header>
      <main className="p-3 md:p-8"><div className="max-w-6xl mx-auto">
        <div className="mb-6"><h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">My PDFs</h1><p className="text-slate-600">Your forms and filled PDFs are saved in this browser on this device.</p></div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('forms')} className={`px-4 py-2 rounded-lg font-medium ${tab === 'forms' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Forms ({forms.length})</button>
          <button onClick={() => setTab('pdfs')} className={`px-4 py-2 rounded-lg font-medium ${tab === 'pdfs' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Saved PDFs ({pdfs.length})</button>
        </div>
        {tab === 'forms' && <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.templates.searchPlaceholder} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <select value={country} onChange={event => setCountry(event.target.value)} className="px-4 py-3 border border-slate-300 rounded-lg bg-white"><option value="all">All Countries</option>{countries.map(item => <option key={item}>{item}</option>)}</select>
        </div>}
        {loading ? <div className="bg-white rounded-xl border p-10 text-center text-slate-500">Loading browser files…</div> : tab === 'forms' ? (
          filteredForms.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{filteredForms.map(form => <div key={form.id} onClick={() => onSelectForm(form)} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md cursor-pointer group">
            <div className="flex gap-3 items-start"><div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><FileText /></div><div className="min-w-0 flex-1"><h2 className="font-semibold text-slate-800 truncate">{form.title}</h2><div className="text-xs text-slate-500">{form.category || 'PDF form'}{form.country ? ` · ${form.country}` : ''}</div></div><button title="Delete form" onClick={async event => { event.stopPropagation(); if (!confirm('Delete this form and its source PDF from this browser?')) return; await localForms.delete(form.id); setForms(current => current.filter(item => item.id !== form.id)); }} className="p-2 text-slate-400 hover:text-red-600 rounded"><Trash2 size={17} /></button></div>
            <p className="text-sm text-slate-600 mt-3 line-clamp-2">{form.description || form.fileName}</p><div className="flex items-center gap-2 text-xs text-slate-500 mt-4"><Calendar size={14} />Saved {new Date(form.updatedAt.seconds * 1000).toLocaleDateString()}</div>
          </div>)}</div> : <div className="bg-white rounded-xl border p-10 text-center"><FolderOpen className="mx-auto mb-4 text-slate-300" size={44} /><h2 className="font-semibold text-slate-700 mb-2">No forms saved yet</h2><p className="text-sm text-slate-500 mb-5">Create a form to store its PDF and fields in this browser.</p><Link href="/create" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"><Plus size={18} />Create a Form</Link></div>
        ) : pdfs.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{pdfs.map(pdf => <div key={pdf.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3"><FileText className="text-blue-600 shrink-0" /><div className="min-w-0 flex-1"><div className="font-medium truncate">{pdf.name}</div><div className="text-xs text-slate-500">{new Date(pdf.savedAt).toLocaleString()}</div></div><button title="Download PDF" onClick={() => download(pdf)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Download size={18} /></button><button title="Delete PDF" onClick={async () => { await localForms.deletePdf(pdf.id); setPdfs(current => current.filter(item => item.id !== pdf.id)); }} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18} /></button></div>)}</div> : <div className="bg-white rounded-xl border p-10 text-center"><FolderOpen className="mx-auto mb-4 text-slate-300" size={44} /><h2 className="font-semibold text-slate-700 mb-2">No filled PDFs saved</h2><p className="text-sm text-slate-500">Save a filled PDF from the editor and it will appear here.</p></div>}
      </div></main>
    </div>
  );
};

export default FormsList;
