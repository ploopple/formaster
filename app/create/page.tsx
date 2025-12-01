'use client';

import React, { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { PenTool, Download, FileUp, ArrowLeft, Eye, Pencil, Loader2 } from 'lucide-react';
import { generateBlankPDF, PageSizeKey, FormElement } from '../../services/pdfGenerator';
import { FormField } from '../../types';
import { useI18n, LanguageToggle } from '../../lib/i18n/I18nContext';

const FormCreator = dynamic(() => import('../../components/FormCreator'), { ssr: false });
const PDFViewer = dynamic(() => import('../../components/PDFViewer'), { ssr: false });

type ViewMode = 'design' | 'preview';

function CreateFormContent() {
  const router = useRouter();
  const { t } = useI18n();
  
  const [elements, setElements] = useState<FormElement[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeKey>('A4');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('design');
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Convert design elements to FormFields for the editor
  const convertElementsToFields = useCallback((elems: FormElement[]): FormField[] => {
    return elems
      .filter(e => e.type === 'text-field' || e.type === 'checkbox')
      .map(e => ({
        id: e.id,
        page: e.page,
        x: e.x,
        y: e.y,
        width: e.width,
        height: e.height,
        name: e.fieldName || `Field ${e.id.slice(0, 4)}`,
        value: '',
        previewText: e.placeholder || '',
        type: e.type === 'checkbox' ? 'checkbox' : 'text',
        fontSize: e.fontSize || 12,
        letterSpacing: 0,
        options: e.type === 'checkbox' ? [{ id: crypto.randomUUID(), x: e.x, y: e.y, width: e.width, height: e.height, value: 'checked' }] : [],
        color: e.color,
        backgroundColor: e.backgroundColor,
        borderColor: e.borderColor,
        borderWidth: e.borderWidth,
      } as FormField));
  }, []);

  const generatePreview = useCallback(async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateBlankPDF(pageCount, pageSize, elements);
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      setPreviewBlob(blob);
      setFormFields(convertElementsToFields(elements));
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF preview');
    } finally {
      setIsGenerating(false);
    }
  }, [pageCount, pageSize, elements, convertElementsToFields]);

  const handleViewModeChange = async (mode: ViewMode) => {
    if (mode === 'preview') {
      await generatePreview();
    }
    setViewMode(mode);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateBlankPDF(pageCount, pageSize, elements);
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'custom-form.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInEditor = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateBlankPDF(pageCount, pageSize, elements);
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const fields = convertElementsToFields(elements);
      
      // Store in sessionStorage for the editor to pick up
      const formTemplate = {
        id: crypto.randomUUID(),
        title: 'Custom Form',
        description: 'Created with Form Builder',
        fileName: 'custom-form.pdf',
        fields: fields,
        createdAt: new Date().toISOString(),
        category: 'Custom',
        pdfBlob: await blobToBase64(blob),
      };
      
      sessionStorage.setItem('customFormTemplate', JSON.stringify(formTemplate));
      router.push('/editor?source=create');
    } catch (error) {
      console.error('Failed to open in editor:', error);
      alert('Failed to open in editor');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <PenTool size={16} />
            </div>
            <span className="hidden sm:inline">Create PDF Form</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => handleViewModeChange('design')}
            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
              viewMode === 'design' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Design</span>
          </button>
          <button
            onClick={() => handleViewModeChange('preview')}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
              viewMode === 'preview' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            } disabled:opacity-50`}
          >
            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden md:block" />
          <button
            onClick={handleOpenInEditor}
            disabled={isGenerating || elements.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileUp size={16} />
            <span className="hidden sm:inline">Open in Editor</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'design' ? (
          <FormCreator
            elements={elements}
            onElementsChange={setElements}
            pageCount={pageCount}
            onPageCountChange={setPageCount}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-200 p-4">
            {previewBlob ? (
              <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full h-full">
                <iframe
                  src={URL.createObjectURL(previewBlob)}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="text-center text-slate-500">
                <Loader2 size={48} className="mx-auto mb-4 animate-spin" />
                <p>Generating preview...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to convert Blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function CreateFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    }>
      <CreateFormContent />
    </Suspense>
  );
}
