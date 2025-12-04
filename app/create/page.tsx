'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Globe, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth, firestoreService, storageService } from '../../lib/firebase';
import { countries } from '../../lib/countries';
import AuthGuard from '../../components/AuthGuard';

function CreateFormContent() {
  const router = useRouter();
  const { user, isConfigured } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pdfFile) return;

    setError('');
    setIsSubmitting(true);

    try {
      // First create the form to get the formId
      const formId = await firestoreService.createFormTemplate(
        user.uid,
        user.email || '',
        title,
        description,
        '', // Temporary empty fileName
        [], // Empty fields - user will add them in editor
        [],
        '#000000',
        category,
        country,
        isPublic
      );

      // Upload PDF to Firebase Storage
      const pdfUrl = await storageService.uploadPDF(user.uid, pdfFile, formId);

      // Update the form with the PDF URL
      await firestoreService.updateFormTemplate(formId, user.uid, {
        fileName: pdfUrl,
        pdfUrl: pdfUrl,
      });

      router.push(`/editor/${formId}`);
    } catch (err) {
      console.error('Failed to create form:', err);
      setError('Failed to create form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Firebase Not Configured</h1>
          <p className="text-slate-500 mb-6">Please configure Firebase to create forms.</p>
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/templates" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Templates</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Create New Form</h1>
          <p className="text-slate-500 mb-6">Upload a PDF and create a fillable form template.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">PDF File *</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                {pdfFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="text-blue-600" size={24} />
                    <span className="text-slate-700 font-medium">{pdfFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setPdfFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-slate-600 mb-1">Click to upload PDF</p>
                    <p className="text-xs text-slate-400">PDF will be uploaded to Firebase Storage</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Form title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Brief description of the form"
                rows={3}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Tax, Legal, HR"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    isPublic
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Globe size={20} />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    !isPublic
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Lock size={20} />
                  <span>Private</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {isPublic ? 'Anyone can view and fill this form' : 'Only you can access this form'}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!pdfFile || !title || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Create Form'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateFormPage() {
  return (
    <AuthGuard>
      <CreateFormContent />
    </AuthGuard>
  );
}
