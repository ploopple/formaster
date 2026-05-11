'use client';

import { useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { AppMode, FormField, FieldSection } from '../../../types';
import Sidebar from '../../../components/Sidebar';

const PDFViewer = dynamic(() => import('../../../components/PDFViewer'), { ssr: false });
import { SignatureModal } from '../../../components/SignatureModal';
import KeyboardShortcutsPanel from '../../../components/KeyboardShortcutsPanel';
import { FormTemplateData, firestoreService } from '../../../lib/firebase';
import { saveFilledPDF, downloadBlob } from '../../../services/pdfUtils';
import { useUndoRedo } from '../../../hooks/useUndoRedo';
import { validateAllFields, isFormValid, getValidationSummary } from '../../../services/validationService';
import { Pencil, PenTool, Menu, Copy, Check, Undo2, Redo2, Keyboard, AlertTriangle, Share2, Cloud, LogIn, LogOut, Save, Bug, ClipboardPaste } from 'lucide-react';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { generateUUID } from '../../../lib/uuid';
import { useAuth } from '../../../lib/firebase';

// LocalStorage key prefix for saved form states (fallback for non-authenticated users)
const FORM_STORAGE_KEY_PREFIX = 'pdf_form_state_';

function EditorContent() {
  const router = useRouter();
  const params = useParams();
  const formId = params.formId as string;
  const { t } = useI18n();
  const { user, logout, isConfigured } = useAuth();
  
  const [mode, setMode] = useState<AppMode>(AppMode.FILL);
  const [file, setFile] = useState<File | null>(null);
  const { state: fields, setState: setFields, undo, redo, canUndo, canRedo } = useUndoRedo<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [sections, setSections] = useState<FieldSection[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPasted, setIsPasted] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [signingFieldId, setSigningFieldId] = useState<string | null>(null);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }>({ width: 600, height: 800 });
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [showValidationWarning, setShowValidationWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [formNotFound, setFormNotFound] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormTemplateData | null>(null);
  const [globalDrawColor, setGlobalDrawColor] = useState<string>('#000000');
  const [isSavedToStorage, setIsSavedToStorage] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const validationStates = useMemo(() => validateAllFields(fields), [fields]);
  const formIsValid = useMemo(() => isFormValid(validationStates), [validationStates]);
  const validationSummary = useMemo(() => getValidationSummary(validationStates, fields), [validationStates, fields]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load form by ID from Firestore
  useEffect(() => {
    // Reset state when formId changes
    setIsLoading(true);
    setFormNotFound(false);
    setFile(null);
    setPdfBytes(null);
    setPreviewBlob(null);
    setCurrentForm(null);
    setIsOwner(false);
    
    const loadForm = async () => {
      try {
        // Load form template from Firestore
        const form = await firestoreService.getFormTemplate(formId);
        if (!form) {
          setFormNotFound(true);
          setIsLoading(false);
          return;
        }
        
        setCurrentForm(form);
        
        // Check if current user is the owner
        const ownerStatus = user ? form.ownerId === user.uid : false;
        setIsOwner(ownerStatus);
        
        // Initialize with template defaults
        let savedFields = form.fields || [];
        let savedSections = form.sections || [];
        let savedGlobalDrawColor = form.globalDrawColor || '#000000';
        
        // If not owner, try to load user's saved state (their filled values)
        if (!ownerStatus && user) {
          try {
            const userState = await firestoreService.getFormState(user.uid, formId);
            if (userState) {
              // Merge user's filled values with template fields
              const templateFieldsMap = new Map(form.fields.map(f => [f.id, f]));
              savedFields = userState.fields.map((savedField: FormField) => {
                const templateField = templateFieldsMap.get(savedField.id);
                if (templateField) {
                  return { ...templateField, ...savedField };
                }
                return savedField;
              });
            }
          } catch (error) {
            console.error('Failed to load user form state', error);
          }
        } else if (!ownerStatus && !user) {
          // Fallback to localStorage for non-authenticated users
          try {
            const localState = localStorage.getItem(`${FORM_STORAGE_KEY_PREFIX}${formId}`);
            if (localState) {
              const parsed = JSON.parse(localState);
              if (parsed.fields && Array.isArray(parsed.fields)) {
                const templateFieldsMap = new Map(form.fields.map(f => [f.id, f]));
                savedFields = parsed.fields.map((savedField: FormField) => {
                  const templateField = templateFieldsMap.get(savedField.id);
                  if (templateField) {
                    return { ...templateField, ...savedField };
                  }
                  return savedField;
                });
              }
            }
          } catch (error) {
            console.error('Failed to load localStorage state', error);
          }
        }
        
        // Load PDF - use pdfUrl (Firebase Storage) if available, otherwise fall back to fileName
        const pdfSource = form.pdfUrl || form.fileName;
        const response = await fetch(pdfSource);
        if (!response.ok) throw new Error('Failed to load PDF');
        
        const blob = await response.blob();
        
        // Validate that we got a PDF
        if (blob.type && !blob.type.includes('pdf') && !blob.type.includes('octet-stream')) {
          console.error('Invalid content type:', blob.type);
          throw new Error('Invalid PDF file');
        }
        
        const pdfFile = new File([blob], pdfSource.split('/').pop()?.split('?')[0] || 'form.pdf', { type: 'application/pdf' });
        
        setFile(pdfFile);
        setFields(savedFields);
        setSections(savedSections);
        setGlobalDrawColor(savedGlobalDrawColor);
        
        const bytes = await blob.arrayBuffer();
        setPdfBytes(bytes);
        
        const generatedBytes = await saveFilledPDF(bytes, savedFields);
        const previewBlobData = new Blob([generatedBytes as BlobPart], { type: 'application/pdf' });
        setPreviewBlob(previewBlobData);
        
        // Set mode based on ownership - owners can edit, others can only fill
        setMode(ownerStatus ? AppMode.EDITOR : AppMode.FILL);
        setIsSidebarOpen(true);
      } catch (error) {
        console.error('Failed to load form', error);
        setFormNotFound(true);
      }
      setIsLoading(false);
    };
    
    if (formId) {
      loadForm();
    }
  }, [formId, setFields, user]);

  const handleCopyShareLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link', error);
    }
  };

  // Save form - owners save the template, others save their filled values
  const saveFormState = useCallback(async () => {
    setIsSavingToCloud(true);
    try {
      if (isOwner && user) {
        // Owner saves the form template
        await firestoreService.updateFormTemplate(formId, user.uid, {
          fields,
          sections,
          globalDrawColor,
        });
      } else if (user) {
        // Non-owner saves their filled values
        await firestoreService.saveFormState(user.uid, formId, fields, sections, globalDrawColor);
      } else {
        // Fallback to localStorage for non-authenticated users
        const formState = {
          fields,
          sections,
          globalDrawColor,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(`${FORM_STORAGE_KEY_PREFIX}${formId}`, JSON.stringify(formState));
      }
      setIsSavedToStorage(true);
      setTimeout(() => setIsSavedToStorage(false), 2000);
    } catch (error) {
      console.error('Failed to save form state', error);
      alert('Failed to save. ' + (error instanceof Error ? error.message : ''));
    } finally {
      setIsSavingToCloud(false);
    }
  }, [fields, sections, globalDrawColor, formId, user, isOwner]);

  useEffect(() => {
    if (!pdfBytes) return;
    const timer = setTimeout(async () => {
      try {
        // Apply global color to fields that have useGlobalColor enabled
        const fieldsWithGlobalColor = fields.map(f => 
          f.useGlobalColor !== false ? { ...f, color: globalDrawColor } : f
        );
        const generatedBytes = await saveFilledPDF(pdfBytes, fieldsWithGlobalColor);
        const blob = new Blob([generatedBytes as BlobPart], { type: 'application/pdf' });
        setPreviewBlob(blob);
      } catch (e) {
        console.error("Preview generation failed", e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [fields, pdfBytes, globalDrawColor]);

  const addField = useCallback((field: FormField) => setFields((prev) => [...prev, field]), [setFields]);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields((prev) => {
      const targetField = prev.find(f => f.id === id);
      if (!targetField) return prev;
      const syncKeys: (keyof FormField)[] = ['name', 'value', 'type', 'previewText', 'fontSize', 'letterSpacing', 'maxLength', 'options', 'maxRows', 'filledRows', 'showHeaders', 'columns'];
      const shouldSync = targetField.groupId && Object.keys(updates).some(k => syncKeys.includes(k as keyof FormField));
      return prev.map((f) => {
        if (f.id === id) return { ...f, ...updates };
        if (shouldSync && f.groupId === targetField.groupId) {
          const syncedUpdates: Partial<FormField> = {};
          Object.keys(updates).forEach((key) => {
            if (syncKeys.includes(key as keyof FormField)) {
              // @ts-ignore
              syncedUpdates[key] = updates[key];
            }
          });
          return { ...f, ...syncedUpdates };
        }
        return f;
      });
    });
  }, [setFields]);

  const deleteField = useCallback((id: string) => {
    setFields((prev) => {
      const idsToDelete = new Set<string>([id]);
      let added = true;
      while (added) {
        added = false;
        prev.forEach(f => {
          if (f.parentFieldId && idsToDelete.has(f.parentFieldId) && !idsToDelete.has(f.id)) {
            idsToDelete.add(f.id);
            added = true;
          }
        });
      }
      return prev.filter(f => !idsToDelete.has(f.id));
    });
    if (selectedFieldId === id) setSelectedFieldId(null);
  }, [selectedFieldId, setFields]);

  const duplicateField = useCallback((id: string) => {
    const field = fields.find(f => f.id === id);
    if (field) {
      const newField: FormField = { ...field, id: generateUUID(), groupId: undefined, name: `${field.name} (Copy)`, x: Math.min(field.x + 2, 95), y: Math.min(field.y + 2, 95), parentFieldId: field.parentFieldId, parentOptionId: field.parentOptionId };
      setFields((prev) => [...prev, newField]);
      setSelectedFieldId(newField.id);
    }
  }, [fields, setFields]);

  const addLinkedFieldLocation = useCallback((id: string) => {
    setFields(prev => {
      const field = prev.find(f => f.id === id);
      if (!field) return prev;
      const groupId = field.groupId || generateUUID();
      const newField: FormField = { ...field, id: generateUUID(), groupId: groupId, x: Math.min(field.x + 5, 95), y: Math.min(field.y + 5, 95) };
      return prev.map(f => f.id === id ? { ...f, groupId } : f).concat(newField);
    });
  }, [setFields]);

  const addNestedField = useCallback((parentId: string, optionId: string) => {
    const parentField = fields.find(f => f.id === parentId);
    if (!parentField) return;
    
    if (parentField.type === 'checkbox' && parentField.useFieldAsCheckbox) {
      const newField: FormField = { 
        id: generateUUID(), page: parentField.page, x: Math.min(parentField.x + 5, 90), y: Math.min(parentField.y + 5, 95), 
        width: 20, height: 3, name: `Nested: ${parentField.name}`, value: '', previewText: '', type: 'text', 
        fontSize: 12, letterSpacing: 0, options: [], parentFieldId: parentId,
      };
      setFields(prev => [...prev, newField]);
      setSelectedFieldId(newField.id);
      return;
    }
    
    const parentOption = parentField?.options?.find(o => o.id === optionId);
    if (!parentOption) return;
    const newField: FormField = { id: generateUUID(), page: parentField.page, x: Math.min(parentOption.x + 5, 90), y: Math.min(parentOption.y + 5, 95), width: 20, height: 3, name: `Nested: ${parentOption.value}`, value: '', previewText: '', type: 'text', fontSize: 12, letterSpacing: 0, options: [], parentFieldId: parentId, parentOptionId: optionId };
    setFields(prev => [...prev, newField]);
    setSelectedFieldId(newField.id);
  }, [fields, setFields]);

  const addTableRow = useCallback((tableId: string) => {
    const tableField = fields.find(f => f.id === tableId);
    if(!tableField) return;
    const existingRows = fields.filter(f => f.parentFieldId === tableId && f.type === 'table-row');
    const nextIndex = existingRows.length;
    const lastRow = existingRows[existingRows.length - 1];
    let newY = lastRow ? lastRow.y + lastRow.height : (tableField.showHeaders ? tableField.y + 4 : tableField.y);
    if (newY > 95) newY = tableField.y;
    const newRow: FormField = { 
      id: generateUUID(), page: tableField.page, x: tableField.x, y: newY, width: tableField.width, height: 5, 
      name: `${tableField.name} Row ${nextIndex + 1}`, value: '', previewText: '', type: 'table-row', 
      fontSize: 12, letterSpacing: 0, parentFieldId: tableId, rowIndex: nextIndex 
    };
    setFields(prev => [...prev, newRow]);
    setSelectedFieldId(newRow.id);
  }, [fields, setFields]);

  const syncCompositeChildren = useCallback((compositeId: string, template: string) => {
    const compositeField = fields.find(f => f.id === compositeId);
    if (!compositeField) return;
    
    const placeholderRegex = /\{(text|date|number):([^}]+)\}/g;
    const placeholders: { type: 'text' | 'date' | 'number'; name: string }[] = [];
    let match;
    while ((match = placeholderRegex.exec(template)) !== null) {
      placeholders.push({ type: match[1] as 'text' | 'date' | 'number', name: match[2] });
    }
    
    const existingChildren = fields.filter(f => f.parentFieldId === compositeId);
    const existingByName = new Map(existingChildren.map(f => [f.name, f]));
    const newChildren: FormField[] = [];
    const keepIds = new Set<string>();
    
    placeholders.forEach((ph, idx) => {
      const childName = ph.name;
      const existing = existingByName.get(childName);
      if (existing) {
        keepIds.add(existing.id);
        if (existing.type !== ph.type) {
          setFields(prev => prev.map(f => f.id === existing.id ? { ...f, type: ph.type } : f));
        }
      } else {
        const newChild: FormField = {
          id: generateUUID(), page: compositeField.page, x: compositeField.x + (idx * 15) % 60, y: compositeField.y + Math.floor(idx / 4) * 5,
          width: 15, height: 3, name: childName, value: '', previewText: ph.type === 'date' ? 'DD/MM/YYYY' : '', type: ph.type,
          fontSize: compositeField.fontSize || 12, letterSpacing: compositeField.letterSpacing || 0, parentFieldId: compositeId,
          dateFormat: ph.type === 'date' ? 'DD/MM/YYYY' : undefined,
        };
        newChildren.push(newChild);
      }
    });
    
    const toRemove = existingChildren.filter(c => !keepIds.has(c.id)).map(c => c.id);
    setFields(prev => [...prev.filter(f => !toRemove.includes(f.id)), ...newChildren]);
  }, [fields, setFields]);

  const clearAllFields = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all fields?')) {
      setFields([]);
      setSelectedFieldId(null);
    }
  }, [setFields]);

  const reorderFields = useCallback((reorderedFields: FormField[]) => setFields(reorderedFields), [setFields]);

  const addSection = useCallback((name: string) => {
    const newSection: FieldSection = { id: generateUUID(), name, collapsed: false, order: sections.length };
    setSections(prev => [...prev, newSection]);
    return newSection.id;
  }, [sections.length]);

  const updateSection = useCallback((id: string, updates: Partial<FieldSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    setFields(prev => prev.map(f => f.sectionId === id ? { ...f, sectionId: undefined } : f));
  }, [setFields]);

  const reorderSections = useCallback((reorderedSections: FieldSection[]) => {
    setSections(reorderedSections.map((s, i) => ({ ...s, order: i })));
  }, []);

  const handleFieldBlur = useCallback((fieldId: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldId));
  }, []);

  const touchAllFields = useCallback(() => {
    const allFieldIds = fields.filter(f => f.type !== 'table-row').map(f => f.id);
    setTouchedFields(new Set(allFieldIds));
  }, [fields]);

  const handleDownload = async () => {
    if (!pdfBytes) return;
    touchAllFields();
    if (!formIsValid) {
      setShowValidationWarning(true);
      return;
    }
    try {
      // Apply global color to fields that have useGlobalColor enabled
      const fieldsWithGlobalColor = fields.map(f => 
        f.useGlobalColor !== false ? { ...f, color: globalDrawColor } : f
      );
      const generatedBytes = await saveFilledPDF(pdfBytes, fieldsWithGlobalColor);
      downloadBlob(generatedBytes, `filled_${file?.name || 'document'}`);
    } catch (error) {
      console.error('Failed to save PDF', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleForceDownload = async () => {
    if (!pdfBytes) return;
    setShowValidationWarning(false);
    try {
      // Apply global color to fields that have useGlobalColor enabled
      const fieldsWithGlobalColor = fields.map(f => 
        f.useGlobalColor !== false ? { ...f, color: globalDrawColor } : f
      );
      const generatedBytes = await saveFilledPDF(pdfBytes, fieldsWithGlobalColor);
      downloadBlob(generatedBytes, `filled_${file?.name || 'document'}`);
    } catch (error) {
      console.error('Failed to save PDF', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleSaveSignature = (dataUrl: string) => {
    if (signingFieldId) {
      updateField(signingFieldId, { value: dataUrl });
      setSigningFieldId(null);
    }
  };

 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === '?') { e.preventDefault(); setShowShortcuts(prev => !prev); return; }
      if (mode === AppMode.EDITOR) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); return; }
        if ((e.metaKey || e.ctrlKey) && e.key === 'y') { e.preventDefault(); redo(); return; }
      }
      if (mode !== AppMode.EDITOR || !selectedFieldId) return;
      const field = fields.find(f => f.id === selectedFieldId);
      if (!field) return;
      const moveStep = e.shiftKey ? 5 : 0.5;
      const resizeStep = e.shiftKey ? 5 : 0.5;
      switch (e.key) {
        case 'Delete':
        case 'Backspace': 
          e.preventDefault(); 
          // Don't delete locked fields
          if (!field.locked) deleteField(selectedFieldId); 
          break;
        case 'ArrowUp': 
          e.preventDefault(); 
          // Don't move/resize locked fields
          if (field.locked) break;
          if (e.metaKey || e.ctrlKey) updateField(selectedFieldId, { height: Math.max(1, field.height - resizeStep) }); 
          else updateField(selectedFieldId, { y: Math.max(0, field.y - moveStep) }); 
          break;
        case 'ArrowDown': 
          e.preventDefault(); 
          if (field.locked) break;
          if (e.metaKey || e.ctrlKey) updateField(selectedFieldId, { height: Math.min(100, field.height + resizeStep) }); 
          else updateField(selectedFieldId, { y: Math.min(100, field.y + moveStep) }); 
          break;
        case 'ArrowLeft': 
          e.preventDefault(); 
          if (field.locked) break;
          if (e.metaKey || e.ctrlKey) updateField(selectedFieldId, { width: Math.max(1, field.width - resizeStep) }); 
          else updateField(selectedFieldId, { x: Math.max(0, field.x - moveStep) }); 
          break;
        case 'ArrowRight': 
          e.preventDefault(); 
          if (field.locked) break;
          if (e.metaKey || e.ctrlKey) updateField(selectedFieldId, { width: Math.min(100, field.width + resizeStep) }); 
          else updateField(selectedFieldId, { x: Math.min(100, field.x + moveStep) }); 
          break;
        case 'Escape': e.preventDefault(); setSelectedFieldId(null); break;
        case 'd': if (e.ctrlKey || e.metaKey) { e.preventDefault(); duplicateField(selectedFieldId); } break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, selectedFieldId, fields, deleteField, updateField, duplicateField, undo, redo]);

  if (isLoading || !isClient) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-slate-600">{t.common.loading}</div></div>;
  }

  if (formNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.editor.formNotFound || 'Form Not Found'}</h1>
          <p className="text-slate-500 mb-6">{t.editor.formNotFoundDesc || 'The form you are looking for does not exist or has been removed.'}</p>
          <button onClick={() => router.push('/templates')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">
            {t.templates.backToHome || 'Browse Templates'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-2 md:px-6 shrink-0 z-30 shadow-sm relative safe-area-inset-top">
        {/* Logo/Back button + Undo/Redo on mobile */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base md:text-lg cursor-pointer touch-manipulation" onClick={() => {  router.push('/templates'); }}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
              <PenTool size={16} />
            </div>
            <span className="hidden md:inline truncate max-w-[150px] lg:max-w-none">{currentForm?.title || t.home.title}</span>
          </div>
          {/* Undo/Redo on mobile - shown on left side */}
          {mode === AppMode.EDITOR && isOwner && (
            <div className="flex sm:hidden items-center gap-0.5 ms-1">
              <button onClick={undo} disabled={!canUndo} className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation" title={t.editor.undo}>
                <Undo2 size={16} />
              </button>
              <button onClick={redo} disabled={!canRedo} className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation" title={t.editor.redo}>
                <Redo2 size={16} />
              </button>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-0.5 md:gap-2 shrink-0 z-10">
          {/* Mode Toggle - Inline */}
          <div className="flex bg-slate-100 p-0.5 md:p-1 rounded-lg">
            {isOwner && (
              <button onClick={() => { setSelectedFieldId(null); setMode(AppMode.EDITOR); }} className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all touch-manipulation ${mode === AppMode.EDITOR ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 active:bg-slate-200'}`}>
                <Pencil size={14} />
                <span className="hidden sm:inline">{t.editor.editorMode}</span>
                <span className="sm:hidden">{t.editor.edit}</span>
              </button>
            )}
            <button onClick={() => { setSelectedFieldId(null); setMode(AppMode.FILL); }} className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all touch-manipulation ${mode === AppMode.FILL ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 active:bg-slate-200'}`}>
              <PenTool size={14} />
              <span className="hidden sm:inline">{t.editor.fillMode}</span>
              <span className="sm:hidden">{t.editor.fill}</span>
            </button>
          </div>
          {mode === AppMode.EDITOR && isOwner && (
            <div className="hidden sm:flex items-center gap-0.5 me-0.5 md:me-2">
              <button onClick={undo} disabled={!canUndo} className="p-2 md:p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation" title={t.editor.undo}>
                <Undo2 size={18} />
              </button>
              <button onClick={redo} disabled={!canRedo} className="p-2 md:p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation" title={t.editor.redo}>
                <Redo2 size={18} />
              </button>
            </div>
          )}
          <button onClick={saveFormState} disabled={isSavingToCloud} className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 active:bg-green-100 rounded-lg transition-all touch-manipulation disabled:opacity-50" title={isOwner ? 'Save form template' : user ? 'Save your progress' : 'Save locally'}>
            {isSavedToStorage ? <Check size={18} className="text-green-600" /> : isSavingToCloud ? <Cloud size={18} className="animate-pulse" /> : <Save size={18} />}
            <span className="hidden lg:inline">{isSavedToStorage ? 'Saved!' : isSavingToCloud ? 'Saving...' : isOwner ? 'Save Template' : 'Save Progress'}</span>
          </button>
          {isConfigured && (user ? (
            <button onClick={logout} className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all touch-manipulation" title="Sign out">
              <LogOut size={18} />
              <span className="hidden xl:inline">Sign Out</span>
            </button>
          ) : (
            <button onClick={() => router.push('/login')} className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation" title="Sign in to save to cloud">
              <LogIn size={18} />
              <span className="hidden xl:inline">Sign In</span>
            </button>
          ))}
          <button onClick={handleCopyShareLink} className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-all touch-manipulation" title={t.editor.copyShareLink || 'Copy share link'}>
            {isLinkCopied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
            <span className="hidden lg:inline">{isLinkCopied ? t.common.copied : (t.editor.share || 'Share')}</span>
          </button>
          {process.env.NODE_ENV === 'development' && mode === AppMode.EDITOR && isOwner && (
            <>
              <button
                onClick={() => {
                  const jsonData = JSON.stringify({ fields, sections, globalDrawColor }, null, 2);
                  navigator.clipboard.writeText(jsonData).then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  });
                }}
                className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                title="Copy JSON"
              >
                {isCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                <span className="hidden lg:inline">{isCopied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={async () => {
                  try {
                    setPasteError(null);
                    const clipboardText = await navigator.clipboard.readText();
                    const parsed = JSON.parse(clipboardText);
                    
                    // Validate the structure
                    if (parsed.fields && Array.isArray(parsed.fields)) {
                      setFields(parsed.fields);
                      if (parsed.sections && Array.isArray(parsed.sections)) {
                        setSections(parsed.sections);
                      }
                      if (parsed.globalDrawColor) {
                        setGlobalDrawColor(parsed.globalDrawColor);
                      }
                      setIsPasted(true);
                      setTimeout(() => setIsPasted(false), 2000);
                    } else {
                      setPasteError('Invalid JSON format: missing fields array');
                      setTimeout(() => setPasteError(null), 3000);
                    }
                  } catch (err) {
                    setPasteError('Failed to paste: Invalid JSON');
                    setTimeout(() => setPasteError(null), 3000);
                  }
                }}
                className={`flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
                  pasteError 
                    ? 'text-red-600 bg-red-50' 
                    : isPasted 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title="Paste JSON"
              >
                {isPasted ? <Check size={16} className="text-green-600" /> : <ClipboardPaste size={16} />}
                <span className="hidden lg:inline">
                  {pasteError ? 'Error!' : isPasted ? 'Pasted!' : 'Paste JSON'}
                </span>
              </button>
            </>
          )}
          <a href="https://twitter.com/messages/compose?recipient_id=YOUR_TWITTER_ID&text=Feedback%20for%20Smart%20PDF%20Filler%3A%20" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all" title="Report Bug / Request Feature">
            <Bug size={16} />
            <span className="hidden xl:inline">Feedback</span>
          </a>
          <button onClick={() => setShowShortcuts(true)} className="hidden md:flex p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title={t.editor.keyboardShortcuts}>
            <Keyboard size={18} />
          </button>
          <button onClick={() => setIsSidebarOpen(prev => !prev)} className="p-2.5 text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg md:hidden touch-manipulation">
            <Menu size={24} />
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative">
        {mode === AppMode.EDITOR && (previewBlob || file) && (
          <PDFViewer key={formId} file={previewBlob || file} mode={mode} fields={fields} selectedFieldId={selectedFieldId} onFieldAdd={addField} onFieldUpdate={updateField} onFieldSelect={(id) => { setSelectedFieldId(id); /* Only auto-open sidebar on desktop, not mobile - on mobile users can tap the Edit button */ if (id && window.innerWidth >= 768) setIsSidebarOpen(true); }} onFieldDelete={deleteField} onOpenSignature={(id) => setSigningFieldId(id)} onPageDimensionsChange={(width, height) => setPageDimensions({ width, height })} globalDrawColor={globalDrawColor} onOpenSidebar={() => setIsSidebarOpen(true)} />
        )}
        <Sidebar mode={mode} fields={fields} selectedField={fields.find(f => f.id === selectedFieldId)} onUpdateField={updateField} onSelectField={setSelectedFieldId} onDeleteField={deleteField} onDuplicateField={duplicateField} onAddLinkedFieldLocation={addLinkedFieldLocation} onClearAllFields={clearAllFields} onDownload={handleDownload} onAddNestedField={addNestedField} onReorderFields={reorderFields} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onOpenSignature={(id) => setSigningFieldId(id)} onAddTableRow={addTableRow} pageDimensions={pageDimensions} sections={sections} onAddSection={addSection} onUpdateSection={updateSection} onDeleteSection={deleteSection} onReorderSections={reorderSections} validationStates={validationStates} touchedFields={touchedFields} onFieldBlur={handleFieldBlur} onSyncCompositeChildren={syncCompositeChildren} globalDrawColor={globalDrawColor} onGlobalDrawColorChange={setGlobalDrawColor} />
      </div>
      <SignatureModal 
        isOpen={!!signingFieldId} 
        onClose={() => setSigningFieldId(null)} 
        onSave={handleSaveSignature}
        canvasWidth={signingFieldId ? fields.find(f => f.id === signingFieldId)?.signatureCanvasWidth : undefined}
        canvasHeight={signingFieldId ? fields.find(f => f.id === signingFieldId)?.signatureCanvasHeight : undefined}
        strokeColor={signingFieldId ? (fields.find(f => f.id === signingFieldId)?.useGlobalColor !== false ? globalDrawColor : fields.find(f => f.id === signingFieldId)?.color) : undefined}
      />
      <KeyboardShortcutsPanel isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      {showValidationWarning && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">{t.validation.errors}</h3>
                <p className="text-sm text-slate-500">{t.validation.someFieldsHaveIssues}</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-800 mb-2">
                <strong>{validationSummary.totalErrors}</strong> {t.validation.errorsFound} <strong>{validationSummary.invalidFields.length}</strong> {t.validation.fieldsWithErrors}:
              </p>
              <ul className="text-sm text-amber-700 list-disc list-inside max-h-32 overflow-y-auto">
                {validationSummary.invalidFields.slice(0, 5).map((name, idx) => (<li key={idx}>{name}</li>))}
                {validationSummary.invalidFields.length > 5 && (<li className="text-amber-600">...{t.validation.andMore.replace('{count}', String(validationSummary.invalidFields.length - 5))}</li>)}
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowValidationWarning(false)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">{t.validation.fixErrors}</button>
              <button onClick={handleForceDownload} className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">{t.validation.downloadAnyway}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import AuthGuard from '../../../components/AuthGuard';

export default function FormEditorPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-slate-600">Loading...</div></div>}>
        <EditorContent />
      </Suspense>
    </AuthGuard>
  );
}
