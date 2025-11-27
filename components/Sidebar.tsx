import React from 'react';
import { FormField, AppMode, FieldType, FieldOption, TableColumn, MarkStyle, FieldSection, ValidationRule, ValidationPattern, FieldValidationState, DocumentAttachment, DocumentRequirement, FieldPosition } from '../types';
import { Download, Edit2, Type, MousePointer2, ArrowLeft, Layers, Copy, Trash2, Plus, GripVertical, CornerDownRight, Table, X, Minus, MapPin, Calendar, PenTool, ChevronDown, ChevronRight, List, Rows, Check, Palette, AlignLeft, AlignCenter, AlignRight, BoxSelect, FolderPlus, Folder, ShieldCheck, AlertCircle, CheckCircle2, Paperclip, FileText, Image, Upload, Info, HelpCircle } from 'lucide-react';
import { isFieldVisible, getFieldDepth } from '../services/formLogic';
import { validateField, getPatternDisplayName } from '../services/validationService';
import TableBuilder from './TableBuilder';
import InlineTableEditor from './InlineTableEditor';

interface SidebarProps {
  mode: AppMode;
  fields: FormField[];
  selectedField: FormField | undefined;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onSelectField: (id: string | null) => void;
  onDeleteField: (id: string) => void;
  onDuplicateField: (id: string) => void;
  onAddLinkedFieldLocation: (id: string) => void;
  onClearAllFields: () => void;
  onDownload: () => void;
  onAddNestedField: (parentId: string, optionId: string) => void;
  onReorderFields: (reorderedFields: FormField[]) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSignature?: (fieldId: string) => void;
  onAddTableRow?: (tableId: string) => void;
  pageDimensions: { width: number; height: number };
  sections?: FieldSection[];
  onAddSection?: (name: string) => string;
  onUpdateSection?: (id: string, updates: Partial<FieldSection>) => void;
  onDeleteSection?: (id: string) => void;
  onReorderSections?: (sections: FieldSection[]) => void;
  validationStates?: Map<string, FieldValidationState>;
  touchedFields?: Set<string>;
  onFieldBlur?: (fieldId: string) => void;
  onSyncCompositeChildren?: (compositeId: string, template: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mode,
  fields,
  selectedField,
  onUpdateField,
  onSelectField,
  onDeleteField,
  onDuplicateField,
  onAddLinkedFieldLocation,
  onClearAllFields,
  onDownload,
  onAddNestedField,
  onReorderFields,
  isOpen,
  onClose,
  onOpenSignature,
  onAddTableRow,
  pageDimensions,
  sections = [],
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onReorderSections,
  validationStates,
  touchedFields,
  onFieldBlur,
  onSyncCompositeChildren
}) => {
  const [draggedFieldId, setDraggedFieldId] = React.useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = React.useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = React.useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(new Set());
  const [editingSectionId, setEditingSectionId] = React.useState<string | null>(null);
  const [newSectionName, setNewSectionName] = React.useState('');
  const [showNewSectionInput, setShowNewSectionInput] = React.useState(false);
  const [currentFillStep, setCurrentFillStep] = React.useState(0);
  const [sidebarWidth, setSidebarWidth] = React.useState(320);
  const [isResizing, setIsResizing] = React.useState(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  if (mode === AppMode.UPLOAD) return null;

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      // Min width: 280px, Max width: 800px
      const clampedWidth = Math.min(Math.max(newWidth, 280), 800);
      setSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleTypeChange = (newType: FieldType) => {
    if (!selectedField) return;
    
    const updates: Partial<FormField> = { type: newType };
    
    if ((newType === 'radio' || newType === 'checkbox' || newType === 'select') && (!selectedField.options || selectedField.options.length === 0)) {
        updates.options = [
            { id: crypto.randomUUID(), x: selectedField.x, y: selectedField.y, width: 0, height: 0, value: "Option 1" },
            { id: crypto.randomUUID(), x: selectedField.x, y: selectedField.y, width: 0, height: 0, value: "Option 2" }
        ];
        if (newType !== 'select') {
           updates.options = updates.options.map(o => ({
               ...o,
               width: Math.min(5, selectedField.width),
               height: Math.min(3, selectedField.height)
           }));
        }
        updates.value = "";
    }
    
    if (newType === 'table') {
        updates.maxRows = 3;
        updates.filledRows = 1;
        updates.showHeaders = true;
        updates.cellPadding = 2;
        updates.cellGap = 0;
        updates.columns = [
            { id: crypto.randomUUID(), name: 'Col 1', type: 'text', width: 50 },
            { id: crypto.randomUUID(), name: 'Col 2', type: 'text', width: 50 }
        ];
        updates.value = "[]"; 
    }
    
    if (newType === 'signature') { updates.value = ""; updates.previewText = "Sign Here"; }
    if (newType === 'date') { updates.value = ""; updates.previewText = "DD/MM/YYYY"; updates.dateFormat = "DD/MM/YYYY"; }
    if (newType === 'select') { updates.previewText = "Select..."; }
    if (newType === 'textarea') { updates.previewText = "Multiline Text..."; }
    if (newType === 'composite') { 
        updates.compositeTemplate = "I am a permanent resident since {date:since_date}. I live in {text:location}.";
        updates.compositeValues = {};
        updates.previewText = "Composite Text...";
    }

    onUpdateField(selectedField.id, updates);
  };

  const addOption = () => {
    if (!selectedField) return;
    const existingOptions = selectedField.options || [];
    const lastOpt = existingOptions.length > 0 ? existingOptions[existingOptions.length - 1] : null;
    const newX = lastOpt ? Math.min(lastOpt.x + 5, 95) : selectedField.x;
    const newY = lastOpt ? lastOpt.y : selectedField.y;
    const isVisualOption = selectedField.type === 'radio' || selectedField.type === 'checkbox';

    const newOption: FieldOption = {
        id: crypto.randomUUID(),
        x: newX, y: newY,
        width: lastOpt && isVisualOption ? lastOpt.width : (isVisualOption ? 4 : 0),
        height: lastOpt && isVisualOption ? lastOpt.height : (isVisualOption ? 3 : 0),
        value: `Option ${existingOptions.length + 1}`
    };
    onUpdateField(selectedField.id, { options: [...existingOptions, newOption] });
  };

  const updateOptionValue = (optId: string, newValue: string) => {
      if (!selectedField || !selectedField.options) return;
      onUpdateField(selectedField.id, { options: selectedField.options.map(o => o.id === optId ? { ...o, value: newValue } : o) });
  };

  const deleteOption = (optId: string) => {
      if (!selectedField || !selectedField.options) return;
      onUpdateField(selectedField.id, { options: selectedField.options.filter(opt => opt.id !== optId) });
  };

  // --- Table Helpers ---
  const getTableData = (val: string): string[][] => {
      try { const data = JSON.parse(val || "[]"); return Array.isArray(data) ? data : []; } catch { return []; }
  };

  const updateTableCell = (field: FormField, rIdx: number, cIdx: number, cellValue: string) => {
      const data = getTableData(field.value);
      if (!data[rIdx]) data[rIdx] = [];
      data[rIdx][cIdx] = cellValue;
      onUpdateField(field.id, { value: JSON.stringify(data) });
  };
  
  // --- Date Helpers for Sidebar ---
  const formatDateForInput = (val: string, format: string) => {
      if (!val) return '';
      if (format === 'YYYY') return val; // Just the year string
      if (format === 'MM/YYYY') {
          // Stored: MM/YYYY (12/2024) -> Input: YYYY-MM (2024-12)
          const parts = val.split('/');
          if (parts.length === 2) return `${parts[1]}-${parts[0]}`;
          return '';
      }
      // Stored: DD/MM/YYYY (31/12/2024) -> Input: YYYY-MM-DD (2024-12-31)
      const parts = val.split('/');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return '';
  };

  const handleDateChange = (val: string, format: string, id: string) => {
      let newVal = val;
      if (format === 'YYYY') {
          // val is YYYY
          newVal = val;
      } else if (format === 'MM/YYYY') {
          // val is YYYY-MM -> MM/YYYY
          if (val) {
              const [y, m] = val.split('-');
              newVal = `${m}/${y}`;
          }
      } else {
          // val is YYYY-MM-DD -> DD/MM/YYYY
          if (val) {
              const [y, m, d] = val.split('-');
              newVal = `${d}/${m}/${y}`;
          }
      }
      onUpdateField(id, { value: newVal });
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
      setDraggedFieldId(fieldId);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', fieldId);
  };

  const handleDragOver = (e: React.DragEvent, fieldId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverFieldId(fieldId);
      setDragOverSectionId(null);
  };

  const handleDragEnd = () => {
      setDraggedFieldId(null);
      setDragOverFieldId(null);
      setDragOverSectionId(null);
  };

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
      e.preventDefault();
      
      if (!draggedFieldId || draggedFieldId === targetFieldId) {
          setDraggedFieldId(null);
          setDragOverFieldId(null);
          setDragOverSectionId(null);
          return;
      }

      const draggedIndex = fields.findIndex(f => f.id === draggedFieldId);
      const targetIndex = fields.findIndex(f => f.id === targetFieldId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const reordered = [...fields];
      const [removed] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, removed);

      onReorderFields(reordered);
      setDraggedFieldId(null);
      setDragOverFieldId(null);
      setDragOverSectionId(null);
  };

  // Section drag handlers
  const handleSectionDragOver = (e: React.DragEvent, sectionId: string) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      setDragOverSectionId(sectionId);
      setDragOverFieldId(null);
  };

  const handleSectionDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverSectionId(null);
  };

  const handleSectionDrop = (e: React.DragEvent, sectionId: string | null) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!draggedFieldId) {
          setDragOverSectionId(null);
          return;
      }

      // Update the field's sectionId
      onUpdateField(draggedFieldId, { sectionId: sectionId || undefined });
      
      // Also move all nested fields (children) to the same section
      const nestedFieldIds = new Set<string>();
      let added = true;
      nestedFieldIds.add(draggedFieldId);
      while (added) {
          added = false;
          fields.forEach(f => {
              if (f.parentFieldId && nestedFieldIds.has(f.parentFieldId) && !nestedFieldIds.has(f.id)) {
                  nestedFieldIds.add(f.id);
                  added = true;
              }
          });
      }
      // Update all nested fields to the same section (excluding the dragged field itself which is already updated)
      nestedFieldIds.forEach(fieldId => {
          if (fieldId !== draggedFieldId) {
              onUpdateField(fieldId, { sectionId: sectionId || undefined });
          }
      });
      
      setDraggedFieldId(null);
      setDragOverFieldId(null);
      setDragOverSectionId(null);
  };

  return (
    <>
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
    
    <div 
      ref={sidebarRef}
      className={`fixed md:relative top-0 right-0 h-full w-full bg-white border-l border-slate-200 shadow-xl z-50 md:z-20 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} flex flex-col`}
      style={{ width: window.innerWidth >= 768 ? `${sidebarWidth}px` : '100%' }}
    >
      {/* Resize handle */}
      <div 
        className="hidden md:block absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 transition-colors group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-slate-300 group-hover:bg-blue-500 rounded-r transition-colors" />
      </div>
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            {mode === AppMode.EDITOR ? <Edit2 size={18} /> : <Type size={18} />}
            {mode === AppMode.EDITOR ? 'Editor Mode' : 'Fill Form'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
            {mode === AppMode.EDITOR ? 'Configure fields.' : 'Fill information.'}
            </p>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-500 hover:bg-slate-200 p-2 rounded-full"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {mode === AppMode.EDITOR ? (
          <div className="h-full flex flex-col">
            {selectedField ? (
              <div className="animate-in slide-in-from-right-4 fade-in duration-200">
                <button onClick={() => onSelectField(null)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium mb-6 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Name</label>
                        <input type="text" value={selectedField.name} onChange={(e) => onUpdateField(selectedField.id, { name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm" autoFocus />
                        {selectedField.groupId && <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium"><MapPin size={10} /><span>Linked</span></div>}
                    </div>

                    {sections.length > 0 && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Section</label>
                            <select 
                                value={selectedField.sectionId || ''} 
                                onChange={(e) => onUpdateField(selectedField.id, { sectionId: e.target.value || undefined })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm"
                            >
                                <option value="">No Section</option>
                                {sections.sort((a, b) => a.order - b.order).map(section => (
                                    <option key={section.id} value={section.id}>{section.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedField.type !== 'table-row' && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Type</label>
                            <select value={selectedField.type} onChange={(e) => handleTypeChange(e.target.value as FieldType)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm">
                                <option value="text">Text</option>
                                <option value="textarea">Text Area</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="signature">Signature</option>
                                <option value="select">Select</option>
                                <option value="radio">Radio</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="table">Table</option>
                                <option value="composite">Composite Text</option>
                            </select>
                        </div>
                    )}
                    
                    {selectedField.type === 'date' && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date Format</label>
                                <select 
                                    value={selectedField.dateFormat || 'DD/MM/YYYY'} 
                                    onChange={(e) => onUpdateField(selectedField.id, { dateFormat: e.target.value, previewText: e.target.value })} 
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm"
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/01/2024)</option>
                                    <option value="MM/YYYY">MM/YYYY (01/2024)</option>
                                    <option value="YYYY">YYYY (2024)</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={selectedField.dateHideSeparator || false} 
                                    onChange={(e) => onUpdateField(selectedField.id, { dateHideSeparator: e.target.checked })} 
                                    className="rounded border-slate-300" 
                                />
                                Hide "/" separator in PDF
                            </label>
                        </div>
                    )}

                    {/* COMPOSITE FIELD CONFIGURATION */}
                    {selectedField.type === 'composite' && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText size={14} className="text-slate-600" />
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Composite Template</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                Use <code className="bg-slate-100 px-1 rounded">{'{text:name}'}</code> for text inputs, <code className="bg-slate-100 px-1 rounded">{'{date:name}'}</code> for dates, <code className="bg-slate-100 px-1 rounded">{'{number:name}'}</code> for numbers. Child fields will be created that you can position on the PDF.
                            </p>
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase">Template</label>
                                <textarea 
                                    value={selectedField.compositeTemplate || ''} 
                                    onChange={(e) => onUpdateField(selectedField.id, { compositeTemplate: e.target.value })}
                                    placeholder="I am a resident since {date:since_date}. I live in {text:location}."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm min-h-[80px] font-mono text-xs"
                                    dir="auto"
                                />
                            </div>
                            {/* Sync button and child fields */}
                            {selectedField.compositeTemplate && (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => onSyncCompositeChildren?.(selectedField.id, selectedField.compositeTemplate || '')}
                                        className="w-full px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={14} />
                                        Sync Child Fields from Template
                                    </button>
                                    
                                    {/* Show existing child fields */}
                                    {(() => {
                                        const childFields = fields.filter(f => f.parentFieldId === selectedField.id);
                                        if (childFields.length === 0) return (
                                            <p className="text-[10px] text-slate-400 italic text-center py-2">
                                                Click "Sync" to create positionable child fields
                                            </p>
                                        );
                                        return (
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-slate-400 uppercase">Child Fields ({childFields.length})</label>
                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                    {childFields.map(child => (
                                                        <div 
                                                            key={child.id} 
                                                            onClick={() => onSelectField(child.id)}
                                                            className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${child.type === 'date' ? 'bg-purple-100 text-purple-700' : child.type === 'number' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    {child.type}
                                                                </span>
                                                                <span className="text-xs text-slate-700">{child.name}</span>
                                                            </div>
                                                            <ChevronRight size={12} className="text-slate-400" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* VISUAL STYLING SECTION */}
                    {(selectedField.type === 'text' || selectedField.type === 'number' || selectedField.type === 'date' || selectedField.type === 'select' || selectedField.type === 'textarea' || selectedField.type === 'signature') && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                             <div className="flex items-center gap-2 mb-1">
                                <Palette size={14} className="text-slate-600" />
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Visual Styling</h3>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Text Color</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={selectedField.color || '#000000'} onChange={(e) => onUpdateField(selectedField.id, { color: e.target.value })} className="w-6 h-6 rounded border-0 p-0 overflow-hidden cursor-pointer" />
                                        <button onClick={() => onUpdateField(selectedField.id, { color: undefined })} className="text-[10px] text-slate-400 hover:text-red-500">Clear</button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Background</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={selectedField.backgroundColor || '#ffffff'} onChange={(e) => onUpdateField(selectedField.id, { backgroundColor: e.target.value })} className="w-6 h-6 rounded border-0 p-0 overflow-hidden cursor-pointer" />
                                        <button onClick={() => onUpdateField(selectedField.id, { backgroundColor: undefined })} className="text-[10px] text-slate-400 hover:text-red-500">Clear</button>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Border Color</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={selectedField.borderColor || '#000000'} onChange={(e) => onUpdateField(selectedField.id, { borderColor: e.target.value })} className="w-6 h-6 rounded border-0 p-0 overflow-hidden cursor-pointer" />
                                        <button onClick={() => onUpdateField(selectedField.id, { borderColor: undefined })} className="text-[10px] text-slate-400 hover:text-red-500">Clear</button>
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Border Width</label>
                                    <input type="number" min="0" value={selectedField.borderWidth || 0} onChange={(e) => onUpdateField(selectedField.id, { borderWidth: Number(e.target.value) })} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Radius</label>
                                    <input type="number" min="0" value={selectedField.borderRadius || 0} onChange={(e) => onUpdateField(selectedField.id, { borderRadius: Number(e.target.value) })} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs" />
                                </div>
                             </div>
                             
                             <div className="space-y-1">
                                 <label className="text-[10px] font-semibold text-slate-400 uppercase">Padding (px)</label>
                                 <input type="number" min="0" value={selectedField.padding || 3} onChange={(e) => onUpdateField(selectedField.id, { padding: Number(e.target.value) })} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs" />
                             </div>
                        </div>
                    )}

                    {(selectedField.type === 'text' || selectedField.type === 'number' || selectedField.type === 'date' || selectedField.type === 'select' || selectedField.type === 'textarea') && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                             <div className="flex items-center gap-2 mb-1">
                                <Type size={14} className="text-slate-600" />
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Typography</h3>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Font Size</label>
                                    <input type="number" value={selectedField.fontSize || 12} onChange={(e) => onUpdateField(selectedField.id, { fontSize: Number(e.target.value) })} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Letter Space</label>
                                    <input type="number" value={selectedField.letterSpacing || 0} onChange={(e) => onUpdateField(selectedField.id, { letterSpacing: Number(e.target.value) })} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" step="0.5" />
                                </div>
                             </div>

                             {(selectedField.type === 'text' || selectedField.type === 'number' || selectedField.type === 'textarea') && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Max Length</label>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        value={selectedField.maxLength || ''} 
                                        onChange={(e) => onUpdateField(selectedField.id, { maxLength: e.target.value ? Number(e.target.value) : undefined })} 
                                        placeholder="No limit"
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" 
                                    />
                                </div>
                             )}

                             <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase">Alignment</label>
                                <div className="flex bg-slate-100 rounded p-1 gap-1">
                                    {['left', 'center', 'right'].map((align) => (
                                        <button 
                                            key={align}
                                            onClick={() => onUpdateField(selectedField.id, { textAlign: align as any })}
                                            className={`flex-1 flex justify-center py-1 rounded hover:bg-white hover:shadow-sm transition-all ${selectedField.textAlign === align || (!selectedField.textAlign && align === 'left') ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                                        >
                                            {align === 'left' && <AlignLeft size={14} />}
                                            {align === 'center' && <AlignCenter size={14} />}
                                            {align === 'right' && <AlignRight size={14} />}
                                        </button>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}

                    {/* DIGIT POSITIONS FOR NUMBER FIELDS */}
                    {selectedField.type === 'number' && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BoxSelect size={14} className="text-slate-600" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Digit Positions</h3>
                                </div>
                                <button 
                                    onClick={() => {
                                        const positions = selectedField.digitPositions || [];
                                        const newPos = { x: positions.length * 15, y: 50 };
                                        onUpdateField(selectedField.id, { digitPositions: [...positions, newPos] });
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <Plus size={12} /> Add
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400">Control each digit's position individually (% relative to field)</p>
                            
                            {selectedField.digitPositions && selectedField.digitPositions.length > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {selectedField.digitPositions.map((pos, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                                            <span className="text-xs font-mono text-slate-500 w-6">#{idx + 1}</span>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[9px] text-slate-400">X%</label>
                                                    <input 
                                                        type="number" 
                                                        value={pos.x} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.digitPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], x: Number(e.target.value) };
                                                            onUpdateField(selectedField.id, { digitPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <label className="text-[9px] text-slate-400">Y%</label>
                                                    <input 
                                                        type="number" 
                                                        value={pos.y} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.digitPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], y: Number(e.target.value) };
                                                            onUpdateField(selectedField.id, { digitPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newPositions = (selectedField.digitPositions || []).filter((_, i) => i !== idx);
                                                    onUpdateField(selectedField.id, { digitPositions: newPositions.length > 0 ? newPositions : undefined });
                                                }}
                                                className="text-slate-400 hover:text-red-500"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic text-center py-2">No custom positions. Digits render normally.</p>
                            )}
                            
                            {selectedField.digitPositions && selectedField.digitPositions.length > 0 && (
                                <button 
                                    onClick={() => onUpdateField(selectedField.id, { digitPositions: undefined })}
                                    className="w-full py-1.5 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200"
                                >
                                    Clear All Positions
                                </button>
                            )}
                        </div>
                    )}

                    {selectedField.type === 'table' && (
                        <div className="space-y-4 pt-2 border-t border-slate-100">
                             {/* Custom Rows Section */}
                             <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Custom Rows</h3>
                                </div>
                                <button onClick={() => onAddTableRow?.(selectedField.id)} className="w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md text-sm font-medium flex items-center justify-center gap-2 border border-indigo-200">
                                    <Plus size={16} /> Add Custom Row Template
                                </button>
                                
                                {fields.filter(f => f.parentFieldId === selectedField.id && f.type === 'table-row').length > 0 && (
                                    <div className="space-y-1 mt-2">
                                        {fields.filter(f => f.parentFieldId === selectedField.id && f.type === 'table-row').map(row => (
                                            <div key={row.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                                                <span className="font-medium truncate flex-1">{row.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => onSelectField(row.id)} className="text-blue-600 hover:underline">Edit</button>
                                                    <button onClick={() => onDeleteField(row.id)} className="text-red-500 hover:text-red-700"><Trash2 size={12} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>

                             {/* Table Builder Component */}
                             <div className="pt-2 border-t border-slate-100">
                                <TableBuilder 
                                    field={selectedField} 
                                    onUpdateField={onUpdateField}
                                />
                             </div>
                        </div>
                    )}

                    {selectedField.type === 'table-row' && (
                        <div className="space-y-4 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Rows size={14} className="text-slate-600" />
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Row Position</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 bg-blue-50 p-2 rounded border border-blue-100">
                                Row cells are defined by the parent table's columns. Edit columns in the table settings.
                            </p>
                            {(() => {
                                const parentTable = fields.find(f => f.id === selectedField.parentFieldId);
                                if (parentTable?.columns && parentTable.columns.length > 0) {
                                    return (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-medium text-slate-500">Columns from parent table:</label>
                                            <div className="flex flex-wrap gap-1">
                                                {parentTable.columns.map(col => (
                                                    <span key={col.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                                                        {col.name} ({col.type})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    )}

                    {(selectedField.type === 'radio' || selectedField.type === 'checkbox' || selectedField.type === 'select') && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                             <div className="flex items-center justify-between"><h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Options</h3><button onClick={addOption} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded flex items-center gap-1 transition-colors"><Plus size={12} /> Add</button></div>
                             <div className="space-y-2 max-h-40 overflow-y-auto">
                                {(selectedField.options || []).map((opt, idx) => (
                                    <div key={opt.id} className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded">
                                        {selectedField.type !== 'select' && <div className="text-slate-400 cursor-move"><GripVertical size={14} /></div>}
                                        <input type="text" value={opt.value} onChange={(e) => updateOptionValue(opt.id, e.target.value)} className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs" />
                                        <button onClick={() => onAddNestedField(selectedField.id, opt.id)} className="text-slate-400 hover:text-blue-500 p-1 rounded"><CornerDownRight size={14} /></button>
                                        <button onClick={() => deleteOption(opt.id)} className="text-slate-400 hover:text-red-500 p-1 rounded"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {(selectedField.type === 'radio' || selectedField.type === 'checkbox') && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                             <div className="flex items-center gap-2 mb-1">
                                <Check size={14} className="text-slate-600" />
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Mark Style</h3>
                             </div>
                             <div className="grid grid-cols-6 gap-2">
                                {[
                                    { value: 'checkmark', label: '✓', title: 'Checkmark' },
                                    { value: 'x', label: '✕', title: 'X Mark' },
                                    { value: 'circle', label: '○', title: 'Circle' },
                                    { value: 'square', label: '■', title: 'Square' },
                                    { value: 'dot', label: '●', title: 'Dot' },
                                    { value: 'none', label: '∅', title: 'None' },
                                ].map((mark) => (
                                    <button
                                        key={mark.value}
                                        onClick={() => onUpdateField(selectedField.id, { markStyle: mark.value as any })}
                                        title={mark.title}
                                        className={`flex items-center justify-center py-2 rounded border text-lg transition-all ${
                                            (selectedField.markStyle || 'checkmark') === mark.value
                                                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        {mark.label}
                                    </button>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* PARENT FIELD SECTION - For radio/checkbox/composite */}
                    {(selectedField.type === 'radio' || selectedField.type === 'checkbox' || selectedField.type === 'composite') && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <CornerDownRight size={14} className="text-slate-600" />
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Parent Field</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                Make this field visible only when a specific option is selected in another radio/checkbox field.
                            </p>
                            
                            {/* Parent Field Selector */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase">Parent Field</label>
                                <select
                                    value={selectedField.parentFieldId || ''}
                                    onChange={(e) => {
                                        const newParentId = e.target.value || undefined;
                                        onUpdateField(selectedField.id, { 
                                            parentFieldId: newParentId,
                                            parentOptionId: undefined // Reset option when parent changes
                                        });
                                    }}
                                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                                >
                                    <option value="">None (Always Visible)</option>
                                    {fields
                                        .filter(f => 
                                            (f.type === 'radio' || f.type === 'checkbox') && 
                                            f.id !== selectedField.id &&
                                            f.options && f.options.length > 0
                                        )
                                        .map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            
                            {/* Parent Option Selector - Only show when parent is selected */}
                            {selectedField.parentFieldId && (() => {
                                const parentField = fields.find(f => f.id === selectedField.parentFieldId);
                                if (!parentField || !parentField.options || parentField.options.length === 0) return null;
                                
                                return (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase">Show When Option Is</label>
                                        <select
                                            value={selectedField.parentOptionId || ''}
                                            onChange={(e) => {
                                                onUpdateField(selectedField.id, { parentOptionId: e.target.value || undefined });
                                            }}
                                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                                        >
                                            <option value="">Select an option...</option>
                                            {parentField.options.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.value}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })()}
                            
                            {/* Show current parent info */}
                            {selectedField.parentFieldId && selectedField.parentOptionId && (() => {
                                const parentField = fields.find(f => f.id === selectedField.parentFieldId);
                                const parentOption = parentField?.options?.find(o => o.id === selectedField.parentOptionId);
                                if (!parentField || !parentOption) return null;
                                
                                return (
                                    <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                                        <span className="font-medium">Visible when:</span> "{parentField.name}" = "{parentOption.value}"
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* VALIDATION RULES SECTION */}
                    {selectedField.type !== 'table' && selectedField.type !== 'table-row' && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-slate-600" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Validation</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        const rules = selectedField.validationRules || [];
                                        const newRule: ValidationRule = { type: 'required' };
                                        onUpdateField(selectedField.id, { validationRules: [...rules, newRule] });
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <Plus size={12} /> Add Rule
                                </button>
                            </div>
                            
                            {(!selectedField.validationRules || selectedField.validationRules.length === 0) ? (
                                <p className="text-xs text-slate-400 italic text-center py-2">No validation rules. Field is optional.</p>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedField.validationRules.map((rule, ruleIdx) => (
                                        <div key={ruleIdx} className="p-2 border border-slate-200 rounded bg-slate-50/50 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <select
                                                    value={rule.type}
                                                    onChange={(e) => {
                                                        const rules = [...(selectedField.validationRules || [])];
                                                        rules[ruleIdx] = { ...rules[ruleIdx], type: e.target.value as any };
                                                        onUpdateField(selectedField.id, { validationRules: rules });
                                                    }}
                                                    className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                                >
                                                    <option value="required">Required</option>
                                                    <option value="pattern">Pattern Match</option>
                                                    <option value="minLength">Min Length</option>
                                                    <option value="maxLength">Max Length</option>
                                                    {(selectedField.type === 'number') && <option value="min">Min Value</option>}
                                                    {(selectedField.type === 'number') && <option value="max">Max Value</option>}
                                                    <option value="conditional">Conditional</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        const rules = (selectedField.validationRules || []).filter((_, i) => i !== ruleIdx);
                                                        onUpdateField(selectedField.id, { validationRules: rules.length > 0 ? rules : undefined });
                                                    }}
                                                    className="ml-2 text-slate-400 hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            
                                            {rule.type === 'pattern' && (
                                                <div className="space-y-2">
                                                    <select
                                                        value={rule.pattern || 'email'}
                                                        onChange={(e) => {
                                                            const rules = [...(selectedField.validationRules || [])];
                                                            rules[ruleIdx] = { ...rules[ruleIdx], pattern: e.target.value as ValidationPattern };
                                                            onUpdateField(selectedField.id, { validationRules: rules });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                                    >
                                                        <option value="email">Email</option>
                                                        <option value="phone">Phone Number</option>
                                                        <option value="israeliId">Israeli ID (9 digits)</option>
                                                        <option value="israeliPhone">Israeli Phone</option>
                                                        <option value="zipCode">Zip Code</option>
                                                        <option value="url">URL</option>
                                                        <option value="alphanumeric">Alphanumeric</option>
                                                        <option value="lettersOnly">Letters Only</option>
                                                        <option value="numbersOnly">Numbers Only</option>
                                                        <option value="custom">Custom Regex</option>
                                                    </select>
                                                    {rule.pattern === 'custom' && (
                                                        <input
                                                            type="text"
                                                            value={rule.customPattern || ''}
                                                            onChange={(e) => {
                                                                const rules = [...(selectedField.validationRules || [])];
                                                                rules[ruleIdx] = { ...rules[ruleIdx], customPattern: e.target.value };
                                                                onUpdateField(selectedField.id, { validationRules: rules });
                                                            }}
                                                            placeholder="Enter regex pattern..."
                                                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            
                                            {(rule.type === 'minLength' || rule.type === 'maxLength' || rule.type === 'min' || rule.type === 'max') && (
                                                <input
                                                    type="number"
                                                    value={rule.value || ''}
                                                    onChange={(e) => {
                                                        const rules = [...(selectedField.validationRules || [])];
                                                        rules[ruleIdx] = { ...rules[ruleIdx], value: Number(e.target.value) };
                                                        onUpdateField(selectedField.id, { validationRules: rules });
                                                    }}
                                                    placeholder={rule.type.includes('Length') ? 'Characters' : 'Value'}
                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                                />
                                            )}
                                            
                                            {rule.type === 'conditional' && (
                                                <div className="space-y-2">
                                                    <select
                                                        value={rule.dependsOnFieldId || ''}
                                                        onChange={(e) => {
                                                            const rules = [...(selectedField.validationRules || [])];
                                                            rules[ruleIdx] = { ...rules[ruleIdx], dependsOnFieldId: e.target.value };
                                                            onUpdateField(selectedField.id, { validationRules: rules });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                                    >
                                                        <option value="">Select field...</option>
                                                        {fields.filter(f => f.id !== selectedField.id && f.type !== 'table-row').map(f => (
                                                            <option key={f.id} value={f.id}>{f.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select
                                                            value={rule.dependsOnOperator || 'equals'}
                                                            onChange={(e) => {
                                                                const rules = [...(selectedField.validationRules || [])];
                                                                rules[ruleIdx] = { ...rules[ruleIdx], dependsOnOperator: e.target.value as any };
                                                                onUpdateField(selectedField.id, { validationRules: rules });
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                                        >
                                                            <option value="equals">Equals</option>
                                                            <option value="notEquals">Not Equals</option>
                                                            <option value="contains">Contains</option>
                                                            <option value="notEmpty">Not Empty</option>
                                                        </select>
                                                        {rule.dependsOnOperator !== 'notEmpty' && (
                                                            <input
                                                                type="text"
                                                                value={rule.dependsOnValue || ''}
                                                                onChange={(e) => {
                                                                    const rules = [...(selectedField.validationRules || [])];
                                                                    rules[ruleIdx] = { ...rules[ruleIdx], dependsOnValue: e.target.value };
                                                                    onUpdateField(selectedField.id, { validationRules: rules });
                                                                }}
                                                                placeholder="Value..."
                                                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <input
                                                type="text"
                                                value={rule.message || ''}
                                                onChange={(e) => {
                                                    const rules = [...(selectedField.validationRules || [])];
                                                    rules[ruleIdx] = { ...rules[ruleIdx], message: e.target.value };
                                                    onUpdateField(selectedField.id, { validationRules: rules });
                                                }}
                                                placeholder="Custom error message (optional)"
                                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* DOCUMENT ATTACHMENT SECTION */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Paperclip size={14} className="text-slate-600" />
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Document Attachment</h3>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedField.documentRequirement?.enabled || false}
                                    onChange={(e) => {
                                        const current = selectedField.documentRequirement || { enabled: false };
                                        onUpdateField(selectedField.id, {
                                            documentRequirement: {
                                                ...current,
                                                enabled: e.target.checked,
                                                acceptedTypes: current.acceptedTypes || ['image/*', 'application/pdf'],
                                                maxFiles: current.maxFiles || 5
                                            }
                                        });
                                    }}
                                    className="rounded border-slate-300 text-blue-600"
                                />
                                <span className="text-xs text-slate-600">Enable</span>
                            </label>
                        </div>
                        <p className="text-[10px] text-slate-400">Allow users to attach supporting documents (e.g., certificates, IDs)</p>
                        
                        {selectedField.documentRequirement?.enabled && (
                            <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Label</label>
                                    <input
                                        type="text"
                                        value={selectedField.documentRequirement?.label || ''}
                                        onChange={(e) => onUpdateField(selectedField.id, {
                                            documentRequirement: { ...selectedField.documentRequirement!, label: e.target.value }
                                        })}
                                        placeholder="e.g., Disability Certificate"
                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                                        <HelpCircle size={10} /> How to Obtain
                                    </label>
                                    <textarea
                                        value={selectedField.documentRequirement?.description || ''}
                                        onChange={(e) => onUpdateField(selectedField.id, {
                                            documentRequirement: { ...selectedField.documentRequirement!, description: e.target.value }
                                        })}
                                        placeholder="e.g., Visit your local health office to request this document..."
                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs resize-y"
                                        rows={2}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase">Max Files</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={selectedField.documentRequirement?.maxFiles || 5}
                                            onChange={(e) => onUpdateField(selectedField.id, {
                                                documentRequirement: { ...selectedField.documentRequirement!, maxFiles: Number(e.target.value) }
                                            })}
                                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase">Required</label>
                                        <select
                                            value={selectedField.documentRequirement?.required ? 'yes' : 'no'}
                                            onChange={(e) => onUpdateField(selectedField.id, {
                                                documentRequirement: { ...selectedField.documentRequirement!, required: e.target.value === 'yes' }
                                            })}
                                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                        >
                                            <option value="no">Optional</option>
                                            <option value="yes">Required</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Accepted Types</label>
                                    <div className="flex flex-wrap gap-1">
                                        {[
                                            { value: 'image/*', label: 'Images', icon: Image },
                                            { value: 'application/pdf', label: 'PDF', icon: FileText }
                                        ].map(({ value, label, icon: Icon }) => {
                                            const types = selectedField.documentRequirement?.acceptedTypes || [];
                                            const isSelected = types.includes(value);
                                            return (
                                                <button
                                                    key={value}
                                                    onClick={() => {
                                                        const newTypes = isSelected
                                                            ? types.filter(t => t !== value)
                                                            : [...types, value];
                                                        onUpdateField(selectedField.id, {
                                                            documentRequirement: { ...selectedField.documentRequirement!, acceptedTypes: newTypes }
                                                        });
                                                    }}
                                                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                                                        isSelected
                                                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                            : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <Icon size={10} />
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <BoxSelect size={14} className="text-slate-600" />
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Geometry</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-[10px] font-semibold text-slate-400 uppercase">Page</label><input type="number" min="1" value={selectedField.page} onChange={(e) => onUpdateField(selectedField.id, { page: Number(e.target.value) })} className="w-full px-2 py-1 bg-slate-50 border rounded text-sm" /></div>
                            <div></div>
                            <div className="space-y-1"><label className="text-[10px] font-semibold text-slate-400 uppercase">X (px)</label><input type="number" value={Math.round((selectedField.x / 100) * pageDimensions.width)} onChange={(e) => onUpdateField(selectedField.id, { x: (Number(e.target.value) / pageDimensions.width) * 100 })} className="w-full px-2 py-1 bg-slate-50 border rounded text-sm" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-semibold text-slate-400 uppercase">Y (px)</label><input type="number" value={Math.round((selectedField.y / 100) * pageDimensions.height)} onChange={(e) => onUpdateField(selectedField.id, { y: (Number(e.target.value) / pageDimensions.height) * 100 })} className="w-full px-2 py-1 bg-slate-50 border rounded text-sm" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-semibold text-slate-400 uppercase">W (px)</label><input type="number" value={Math.round((selectedField.width / 100) * pageDimensions.width)} onChange={(e) => onUpdateField(selectedField.id, { width: (Number(e.target.value) / pageDimensions.width) * 100 })} className="w-full px-2 py-1 bg-slate-50 border rounded text-sm" /></div>
                            <div className="space-y-1"><label className="text-[10px] font-semibold text-slate-400 uppercase">H (px)</label><input type="number" value={Math.round((selectedField.height / 100) * pageDimensions.height)} onChange={(e) => onUpdateField(selectedField.id, { height: (Number(e.target.value) / pageDimensions.height) * 100 })} className="w-full px-2 py-1 bg-slate-50 border rounded text-sm" /></div>
                        </div>
                    </div>

                    {/* Additional Positions - for fields that need to appear in multiple places */}
                    {selectedField.type !== 'table' && selectedField.type !== 'table-row' && selectedField.type !== 'radio' && selectedField.type !== 'checkbox' && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Copy size={14} className="text-slate-600" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Additional Positions</h3>
                                </div>
                                <button 
                                    onClick={() => {
                                        const positions = selectedField.additionalPositions || [];
                                        const newPos = { 
                                            page: selectedField.page, 
                                            x: selectedField.x, 
                                            y: selectedField.y, 
                                            width: selectedField.width, 
                                            height: selectedField.height 
                                        };
                                        onUpdateField(selectedField.id, { additionalPositions: [...positions, newPos] });
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <Plus size={12} /> Add Position
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400">Same field value rendered at multiple locations/pages</p>
                            
                            {selectedField.additionalPositions && selectedField.additionalPositions.length > 0 ? (
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {selectedField.additionalPositions.map((pos, idx) => (
                                        <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-slate-600">Position #{idx + 2}</span>
                                                <button 
                                                    onClick={() => {
                                                        const newPositions = selectedField.additionalPositions?.filter((_, i) => i !== idx);
                                                        onUpdateField(selectedField.id, { additionalPositions: newPositions });
                                                    }}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-400">Page</label>
                                                    <input 
                                                        type="number" 
                                                        min="1"
                                                        value={pos.page} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.additionalPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], page: Number(e.target.value) };
                                                            onUpdateField(selectedField.id, { additionalPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" 
                                                    />
                                                </div>
                                                <div></div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-400">X (px)</label>
                                                    <input 
                                                        type="number" 
                                                        value={Math.round((pos.x / 100) * pageDimensions.width)} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.additionalPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], x: (Number(e.target.value) / pageDimensions.width) * 100 };
                                                            onUpdateField(selectedField.id, { additionalPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" 
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-400">Y (px)</label>
                                                    <input 
                                                        type="number" 
                                                        value={Math.round((pos.y / 100) * pageDimensions.height)} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.additionalPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], y: (Number(e.target.value) / pageDimensions.height) * 100 };
                                                            onUpdateField(selectedField.id, { additionalPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" 
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-400">W (px)</label>
                                                    <input 
                                                        type="number" 
                                                        value={Math.round((pos.width / 100) * pageDimensions.width)} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.additionalPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], width: (Number(e.target.value) / pageDimensions.width) * 100 };
                                                            onUpdateField(selectedField.id, { additionalPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" 
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-400">H (px)</label>
                                                    <input 
                                                        type="number" 
                                                        value={Math.round((pos.height / 100) * pageDimensions.height)} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.additionalPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], height: (Number(e.target.value) / pageDimensions.height) * 100 };
                                                            onUpdateField(selectedField.id, { additionalPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" 
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-400">Font Size</label>
                                                    <input 
                                                        type="number" 
                                                        min="1"
                                                        value={pos.fontSize ?? selectedField.fontSize ?? 12} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.additionalPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], fontSize: Number(e.target.value) };
                                                            onUpdateField(selectedField.id, { additionalPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" 
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-400">Letter Space</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.5"
                                                        value={pos.letterSpacing ?? selectedField.letterSpacing ?? 0} 
                                                        onChange={(e) => {
                                                            const newPositions = [...(selectedField.additionalPositions || [])];
                                                            newPositions[idx] = { ...newPositions[idx], letterSpacing: Number(e.target.value) };
                                                            onUpdateField(selectedField.id, { additionalPositions: newPositions });
                                                        }}
                                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[10px] text-slate-400 italic">No additional positions. Click "Add Position" to render this field in multiple places.</p>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                        <button onClick={() => onDuplicateField(selectedField.id)} className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-md text-sm font-medium transition-colors"><Copy size={16} /> Clone</button>
                        <button onClick={() => onDeleteField(selectedField.id)} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-md text-sm font-medium transition-colors"><Trash2 size={16} /> Delete</button>
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in slide-in-from-left-4 fade-in duration-200">
                <div className="flex items-center justify-between text-slate-500 px-1 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Fields ({fields.length})</span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowNewSectionInput(true)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            title="Add Section"
                        >
                            <FolderPlus size={14} />
                        </button>
                        <Layers size={14} />
                    </div>
                </div>
                
                {/* New Section Input */}
                {showNewSectionInput && (
                    <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            placeholder="Section name..."
                            className="w-full px-2 py-1 text-sm border border-blue-300 rounded mb-2"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newSectionName.trim() && onAddSection) {
                                    onAddSection(newSectionName.trim());
                                    setNewSectionName('');
                                    setShowNewSectionInput(false);
                                }
                                if (e.key === 'Escape') {
                                    setNewSectionName('');
                                    setShowNewSectionInput(false);
                                }
                            }}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (newSectionName.trim() && onAddSection) {
                                        onAddSection(newSectionName.trim());
                                        setNewSectionName('');
                                        setShowNewSectionInput(false);
                                    }
                                }}
                                className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setNewSectionName('');
                                    setShowNewSectionInput(false);
                                }}
                                className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded hover:bg-slate-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {(() => {
                        // Build hierarchical field list: parents followed by their children
                        const getHierarchicalFields = (allFields: FormField[]): FormField[] => {
                            const result: FormField[] = [];
                            const addedIds = new Set<string>();
                            
                            const addFieldWithChildren = (field: FormField) => {
                                if (addedIds.has(field.id)) return;
                                addedIds.add(field.id);
                                result.push(field);
                                // Find and add all direct children
                                allFields
                                    .filter(f => f.parentFieldId === field.id)
                                    .forEach(child => addFieldWithChildren(child));
                            };
                            
                            // Start with root fields (no parent)
                            allFields
                                .filter(f => !f.parentFieldId)
                                .forEach(field => addFieldWithChildren(field));
                            
                            // Add any orphaned fields (parent was deleted)
                            allFields.forEach(f => {
                                if (!addedIds.has(f.id)) {
                                    result.push(f);
                                }
                            });
                            
                            return result;
                        };

                        const renderFieldItem = (field: FormField) => {
                            const depth = getFieldDepth(field, fields);
                            const isDragging = draggedFieldId === field.id;
                            const isDragOver = dragOverFieldId === field.id;
                            return (
                                <div 
                                    key={field.id} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, field.id)}
                                    onDragOver={(e) => handleDragOver(e, field.id)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={(e) => handleDrop(e, field.id)}
                                    onClick={() => onSelectField(field.id)} 
                                    style={{ marginLeft: `${depth * 16}px` }} 
                                    className={`group p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md cursor-move transition-all flex items-center justify-between relative overflow-hidden ${depth > 0 ? 'border-l-4 border-l-slate-300' : ''} ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-blue-500 border-2' : ''}`}
                                >
                                    <div className="relative z-10 w-full flex items-center gap-2">
                                        <div className="text-slate-400 cursor-grab active:cursor-grabbing">
                                            <GripVertical size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-700 text-sm group-hover:text-blue-700 transition-colors flex items-center gap-1 w-full">
                                                {depth > 0 && <CornerDownRight size={10} className="inline mr-1 text-slate-400" />}
                                                {field.type === 'table' && <Table size={12} className="text-slate-400" />}
                                                {field.type === 'table-row' && <Rows size={12} className="text-slate-400" />}
                                                <span className="truncate">{field.name}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                                                <span className="bg-slate-100 px-1 rounded uppercase text-[9px]">{field.type}</span>
                                                <span>Pg {field.page}</span>
                                                {field.validationRules && field.validationRules.length > 0 && (
                                                    <span className="bg-green-100 text-green-700 px-1 rounded text-[9px] flex items-center gap-0.5">
                                                        <ShieldCheck size={8} /> {field.validationRules.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        };

                        const hierarchicalFields = getHierarchicalFields(fields);
                        const sortedSections = [...sections].sort((a, b) => a.order - b.order);
                        
                        // Group fields by section
                        const unsectionedFields = hierarchicalFields.filter(f => !f.sectionId);
                        
                        return (
                            <>
                                {/* Render sections */}
                                {sortedSections.map(section => {
                                    const sectionFields = hierarchicalFields.filter(f => f.sectionId === section.id);
                                    const isCollapsed = collapsedSections.has(section.id);
                                    const isEditing = editingSectionId === section.id;
                                    const isDragOver = dragOverSectionId === section.id;
                                    
                                    return (
                                        <div 
                                            key={section.id} 
                                            className="mb-2"
                                            onDragOver={(e) => handleSectionDragOver(e, section.id)}
                                            onDragLeave={handleSectionDragLeave}
                                            onDrop={(e) => handleSectionDrop(e, section.id)}
                                        >
                                            <div 
                                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer group transition-all ${
                                                    isDragOver 
                                                        ? 'bg-blue-100 border-blue-400 border-2 border-dashed' 
                                                        : 'bg-slate-100 border-slate-200 hover:bg-slate-150'
                                                }`}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setCollapsedSections(prev => {
                                                            const next = new Set(prev);
                                                            if (next.has(section.id)) next.delete(section.id);
                                                            else next.add(section.id);
                                                            return next;
                                                        });
                                                    }}
                                                    className="text-slate-500 hover:text-slate-700"
                                                >
                                                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                                <Folder size={14} className={isDragOver ? 'text-blue-500' : 'text-slate-500'} />
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        defaultValue={section.name}
                                                        className="flex-1 px-1 py-0.5 text-sm border border-blue-300 rounded bg-white"
                                                        autoFocus
                                                        onBlur={(e) => {
                                                            if (e.target.value.trim() && onUpdateSection) {
                                                                onUpdateSection(section.id, { name: e.target.value.trim() });
                                                            }
                                                            setEditingSectionId(null);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                if (e.currentTarget.value.trim() && onUpdateSection) {
                                                                    onUpdateSection(section.id, { name: e.currentTarget.value.trim() });
                                                                }
                                                                setEditingSectionId(null);
                                                            }
                                                            if (e.key === 'Escape') {
                                                                setEditingSectionId(null);
                                                            }
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <span 
                                                        className={`flex-1 text-sm font-medium truncate ${isDragOver ? 'text-blue-700' : 'text-slate-700'}`}
                                                        onDoubleClick={() => setEditingSectionId(section.id)}
                                                    >
                                                        {section.name}
                                                        {isDragOver && <span className="text-xs ml-2 text-blue-500">(drop here)</span>}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                                                    {sectionFields.length}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onDeleteSection && confirm(`Delete section "${section.name}"? Fields will be moved to unsectioned.`)) {
                                                            onDeleteSection(section.id);
                                                        }
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            {!isCollapsed && (
                                                <div className="mt-1 ml-2 space-y-1 border-l-2 border-slate-200 pl-2">
                                                    {sectionFields.map(renderFieldItem)}
                                                    {sectionFields.length === 0 && (
                                                        <div className="text-xs text-slate-400 italic py-2 text-center">
                                                            Drop fields here
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                
                                {/* Render unsectioned fields */}
                                {sections.length > 0 && (
                                    <div 
                                        className="mb-2"
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.dataTransfer.dropEffect = 'move';
                                            setDragOverSectionId('__unsectioned__');
                                            setDragOverFieldId(null);
                                        }}
                                        onDragLeave={handleSectionDragLeave}
                                        onDrop={(e) => handleSectionDrop(e, null)}
                                    >
                                        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-2 rounded transition-all ${
                                            dragOverSectionId === '__unsectioned__'
                                                ? 'bg-blue-100 border-2 border-blue-400 border-dashed text-blue-600'
                                                : 'text-slate-400'
                                        }`}>
                                            Unsectioned {dragOverSectionId === '__unsectioned__' && <span className="text-blue-500">(drop to remove from section)</span>}
                                        </div>
                                    </div>
                                )}
                                {unsectionedFields.map(renderFieldItem)}
                            </>
                        );
                    })()}
                </div>
                <button onClick={onClearAllFields} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 py-3 rounded-lg text-sm font-medium transition-colors border border-dashed border-slate-300 hover:border-red-200"><Trash2 size={16} /> Clear All Fields</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {(() => {
              const renderFillField = (field: FormField, isNested: boolean = false) => {
                if (!isFieldVisible(field, fields)) return null;
                if (field.type === 'table-row') return null;
                // Skip nested fields at top level - they are rendered inside their parent
                if (!isNested && field.parentFieldId) return null;
                const linkedDedupe = fields.find(f => f.groupId === field.groupId);
                if (field.groupId && linkedDedupe && linkedDedupe.id !== field.id && fields.indexOf(linkedDedupe) < fields.indexOf(field)) return null;

                // Get validation state for this field
                const validationState = validationStates?.get(field.id);
                const isTouched = touchedFields?.has(field.id);
                const showError = isTouched && validationState && !validationState.isValid;
                const showSuccess = isTouched && validationState?.isValid && field.validationRules && field.validationRules.length > 0;
                const hasRequiredRule = field.validationRules?.some(r => r.type === 'required' || r.type === 'conditional');
                
                const inputClassName = `w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm transition-colors ${
                    showError 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : showSuccess 
                            ? 'border-green-400 focus:border-green-500 focus:ring-green-200'
                            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                } focus:ring-2 focus:outline-none`;

                const handleBlur = () => onFieldBlur?.(field.id);

                return (
                  <div key={field.id} className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                          <span className="truncate">{field.name}</span>
                          {hasRequiredRule && <span className="text-red-500">*</span>}
                          {showSuccess && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                      </label>
                      
                      {field.type === 'text' && ( 
                          <input 
                              type="text" 
                              value={field.value} 
                              onChange={(e) => onUpdateField(field.id, { value: e.target.value })} 
                              onBlur={handleBlur}
                              maxLength={field.maxLength} 
                              className={inputClassName} 
                          /> 
                      )}
                      {field.type === 'number' && ( 
                          <input 
                              type="number" 
                              value={field.value} 
                              onChange={(e) => {
                                  const newValue = e.target.value;
                                  if (field.maxLength && newValue.length > field.maxLength) return;
                                  onUpdateField(field.id, { value: newValue });
                              }} 
                              onBlur={handleBlur}
                              className={inputClassName} 
                          /> 
                      )}
                      {field.type === 'textarea' && ( 
                          <textarea 
                              value={field.value} 
                              onChange={(e) => onUpdateField(field.id, { value: e.target.value })} 
                              onBlur={handleBlur}
                              maxLength={field.maxLength} 
                              className={`${inputClassName} resize-y`} 
                              rows={3} 
                          /> 
                      )}
                      
                      {field.type === 'select' && (
                          <select 
                              value={field.value} 
                              onChange={(e) => onUpdateField(field.id, { value: e.target.value })} 
                              onBlur={handleBlur}
                              className={inputClassName}
                          >
                              <option value="">Select</option>
                              {(field.options || []).map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                          </select>
                      )}

                      {field.type === 'date' && (
                        <div className="relative group">
                            <div className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer">
                                <span className={`text-sm ${field.value ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                    {field.value || (field.dateFormat === 'YYYY' ? 'Select Year' : field.dateFormat === 'MM/YYYY' ? 'Select Month' : 'Select Date')}
                                </span>
                                <Calendar size={16} className="text-slate-400 group-hover:text-blue-500" />
                            </div>

                            {field.dateFormat === 'YYYY' ? (
                                <select 
                                    value={field.value}
                                    onChange={(e) => onUpdateField(field.id, { value: e.target.value })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10"
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 121 }, (_, i) => new Date().getFullYear() + 10 - i).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    type={field.dateFormat === 'MM/YYYY' ? 'month' : 'date'}
                                    value={formatDateForInput(field.value, field.dateFormat || 'DD/MM/YYYY')}
                                    onChange={(e) => handleDateChange(e.target.value, field.dateFormat || 'DD/MM/YYYY', field.id)}
                                    onClick={(e) => {
                                        try {
                                            if (typeof (e.currentTarget as any).showPicker === 'function') {
                                                (e.currentTarget as any).showPicker();
                                            }
                                        } catch (err) {}
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                            )}
                        </div>
                    )}

                    {(field.type === 'radio') && (
                        <div className="space-y-1 mt-1 bg-white p-2 rounded-md border border-slate-200">
                            {(field.options || []).map((opt) => {
                                const nestedFields = fields.filter(f => f.parentFieldId === field.id && f.parentOptionId === opt.id);
                                return (
                                    <div key={opt.id}>
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                            <input 
                                                type="radio" 
                                                name={`field-${field.id}`}
                                                value={opt.value}
                                                checked={field.value === opt.value}
                                                onChange={() => onUpdateField(field.id, { value: opt.value })}
                                                className="text-blue-600 focus:ring-blue-500 accent-blue-600"
                                            />
                                            <span className="text-sm text-slate-700">{opt.value}</span>
                                        </label>
                                        {/* Render nested fields when this option is selected */}
                                        {field.value === opt.value && nestedFields.length > 0 && (
                                            <div className="ml-6 mt-2 pl-3 border-l-2 border-blue-200 space-y-3">
                                                {nestedFields.map(nestedField => renderFillField(nestedField, true))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    {(field.type === 'checkbox') && (
                        <div className="space-y-1 mt-1 bg-white p-2 rounded-md border border-slate-200">
                             {(field.options || []).map((opt) => {
                                // Use ||| as separator to handle option values containing commas
                                const separator = '|||';
                                const currentValues = field.value ? field.value.split(separator).filter(v => v) : [];
                                const isChecked = currentValues.includes(opt.value);
                                const nestedFields = fields.filter(f => f.parentFieldId === field.id && f.parentOptionId === opt.id);
                                return (
                                    <div key={opt.id}>
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                            <input 
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const separator = '|||';
                                                    const current = field.value ? field.value.split(separator).filter(v => v) : [];
                                                    let next;
                                                    if (e.target.checked) next = [...current, opt.value];
                                                    else next = current.filter(v => v !== opt.value);
                                                    onUpdateField(field.id, { value: next.join(separator) });
                                                }}
                                                className="text-blue-600 focus:ring-blue-500 rounded accent-blue-600"
                                            />
                                            <span className="text-sm text-slate-700">{opt.value}</span>
                                        </label>
                                        {/* Render nested fields when this option is checked */}
                                        {isChecked && nestedFields.length > 0 && (
                                            <div className="ml-6 mt-2 pl-3 border-l-2 border-blue-200 space-y-3">
                                                {nestedFields.map(nestedField => renderFillField(nestedField, true))}
                                            </div>
                                        )}
                                    </div>
                                )
                             })}
                        </div>
                    )}

                    {field.type === 'table' && (
                        <InlineTableEditor
                            field={field}
                            onUpdateField={onUpdateField}
                            customRows={fields.filter(f => f.parentFieldId === field.id && f.type === 'table-row')}
                        />
                    )}

                    {field.type === 'composite' && field.compositeTemplate && (
                        <div className="p-3 bg-white border border-slate-200 rounded-md text-sm leading-relaxed" dir="auto">
                            {(() => {
                                // Parse template and render with inline inputs using child field values
                                const template = field.compositeTemplate;
                                const childFields = fields.filter(f => f.parentFieldId === field.id);
                                const childByName = new Map(childFields.map(c => [c.name, c]));
                                const parts: React.ReactNode[] = [];
                                let lastIndex = 0;
                                const regex = /\{(text|date|number):([^}]+)\}/g;
                                let match;
                                let keyIdx = 0;
                                
                                while ((match = regex.exec(template)) !== null) {
                                    // Add static text before this match
                                    if (match.index > lastIndex) {
                                        parts.push(<span key={`static-${keyIdx++}`}>{template.slice(lastIndex, match.index)}</span>);
                                    }
                                    
                                    const [, inputType, inputName] = match;
                                    const childField = childByName.get(inputName);
                                    const inputValue = childField?.value || '';
                                    
                                    if (inputType === 'date') {
                                        parts.push(
                                            <input
                                                key={`input-${inputName}`}
                                                type="date"
                                                value={inputValue}
                                                onChange={(e) => {
                                                    if (childField) {
                                                        onUpdateField(childField.id, { value: e.target.value });
                                                    }
                                                }}
                                                className="inline-block mx-1 px-2 py-0.5 border border-purple-300 rounded bg-purple-50 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 min-w-[130px]"
                                                placeholder={inputName}
                                                disabled={!childField}
                                            />
                                        );
                                    } else if (inputType === 'number') {
                                        parts.push(
                                            <input
                                                key={`input-${inputName}`}
                                                type="number"
                                                value={inputValue}
                                                onChange={(e) => {
                                                    if (childField) {
                                                        onUpdateField(childField.id, { value: e.target.value });
                                                    }
                                                }}
                                                className="inline-block mx-1 px-2 py-0.5 border border-green-300 rounded bg-green-50 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-20"
                                                placeholder={inputName}
                                                disabled={!childField}
                                            />
                                        );
                                    } else {
                                        // text
                                        parts.push(
                                            <input
                                                key={`input-${inputName}`}
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => {
                                                    if (childField) {
                                                        onUpdateField(childField.id, { value: e.target.value });
                                                    }
                                                }}
                                                className="inline-block mx-1 px-2 py-0.5 border border-blue-300 rounded bg-blue-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder={inputName}
                                                style={{ width: `${Math.max(80, inputName.length * 10)}px` }}
                                                disabled={!childField}
                                            />
                                        );
                                    }
                                    
                                    lastIndex = match.index + match[0].length;
                                }
                                
                                // Add remaining static text
                                if (lastIndex < template.length) {
                                    parts.push(<span key={`static-${keyIdx++}`}>{template.slice(lastIndex)}</span>);
                                }
                                
                                // Show warning if no child fields exist
                                if (childFields.length === 0) {
                                    return (
                                        <div className="text-amber-600 text-xs">
                                            ⚠️ No child fields created. Go to Editor mode and click "Sync Child Fields" to create positionable fields.
                                        </div>
                                    );
                                }
                                
                                return parts;
                            })()}
                        </div>
                    )}

                    {field.type === 'signature' && (
                        <div className="space-y-2">
                            {field.value && field.value.startsWith('data:image') ? (
                                <div className="relative group">
                                    <div className="w-full h-24 bg-white border border-slate-200 rounded-md overflow-hidden flex items-center justify-center">
                                        <img 
                                            src={field.value} 
                                            alt="Signature" 
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => onOpenSignature?.(field.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors"
                                        >
                                            <PenTool size={14} />
                                            Redraw
                                        </button>
                                        <button
                                            onClick={() => onUpdateField(field.id, { value: '' })}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm font-medium transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => onOpenSignature?.(field.id)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-600 rounded-lg text-sm font-medium transition-all"
                                >
                                    <PenTool size={18} />
                                    Click to Sign
                                </button>
                            )}
                        </div>
                    )}
                      
                      {/* Validation Error Display */}
                      {showError && validationState.errors.length > 0 && (
                          <div className="flex items-start gap-1.5 mt-1">
                              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                  {validationState.errors.map((error, idx) => (
                                      <p key={idx} className="text-xs text-red-600">{error}</p>
                                  ))}
                              </div>
                          </div>
                      )}
                      
                      {/* Document Attachment Section */}
                      {field.documentRequirement?.enabled && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                  <Paperclip size={14} className="text-slate-600" />
                                  <span className="text-xs font-medium text-slate-700">
                                      {field.documentRequirement.label || 'Attach Documents'}
                                      {field.documentRequirement.required && <span className="text-red-500 ml-1">*</span>}
                                  </span>
                              </div>
                              
                              {/* How to obtain info */}
                              {field.documentRequirement.description && (
                                  <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200 flex items-start gap-2">
                                      <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                      <p className="text-xs text-blue-700">{field.documentRequirement.description}</p>
                                  </div>
                              )}
                              
                              {/* Existing attachments */}
                              {field.attachments && field.attachments.length > 0 && (
                                  <div className="space-y-2 mb-3">
                                      {field.attachments.map((attachment) => (
                                          <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 group">
                                              {attachment.type.startsWith('image/') ? (
                                                  <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 shrink-0">
                                                      <img src={attachment.dataUrl} alt={attachment.name} className="w-full h-full object-cover" />
                                                  </div>
                                              ) : (
                                                  <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center shrink-0">
                                                      <FileText size={20} className="text-red-500" />
                                                  </div>
                                              )}
                                              <div className="flex-1 min-w-0">
                                                  <p className="text-xs font-medium text-slate-700 truncate">{attachment.name}</p>
                                                  <p className="text-[10px] text-slate-400">
                                                      {(attachment.size / 1024).toFixed(1)} KB
                                                  </p>
                                              </div>
                                              <button
                                                  onClick={() => {
                                                      const newAttachments = (field.attachments || []).filter(a => a.id !== attachment.id);
                                                      onUpdateField(field.id, { attachments: newAttachments });
                                                  }}
                                                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                                              >
                                                  <X size={14} />
                                              </button>
                                          </div>
                                      ))}
                                  </div>
                              )}
                              
                              {/* Upload button */}
                              {(!field.attachments || field.attachments.length < (field.documentRequirement.maxFiles || 5)) && (
                                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                      <Upload size={16} className="text-slate-400" />
                                      <span className="text-xs text-slate-500">
                                          Click to upload ({field.attachments?.length || 0}/{field.documentRequirement.maxFiles || 5})
                                      </span>
                                      <input
                                          type="file"
                                          className="hidden"
                                          accept={(field.documentRequirement.acceptedTypes || ['image/*', 'application/pdf']).join(',')}
                                          multiple
                                          onChange={(e) => {
                                              const files = Array.from(e.target.files || []);
                                              const maxFiles = field.documentRequirement?.maxFiles || 5;
                                              const currentCount = field.attachments?.length || 0;
                                              const remainingSlots = maxFiles - currentCount;
                                              const filesToProcess = files.slice(0, remainingSlots);
                                              
                                              filesToProcess.forEach(file => {
                                                  const reader = new FileReader();
                                                  reader.onload = (event) => {
                                                      const newAttachment: DocumentAttachment = {
                                                          id: crypto.randomUUID(),
                                                          name: file.name,
                                                          type: file.type,
                                                          size: file.size,
                                                          dataUrl: event.target?.result as string,
                                                          uploadedAt: new Date().toISOString()
                                                      };
                                                      const currentAttachments = field.attachments || [];
                                                      onUpdateField(field.id, { 
                                                          attachments: [...currentAttachments, newAttachment] 
                                                      });
                                                  };
                                                  reader.readAsDataURL(file);
                                              });
                                              e.target.value = '';
                                          }}
                                      />
                                  </label>
                              )}
                              
                              {/* Accepted types hint */}
                              <p className="text-[10px] text-slate-400 mt-2 text-center">
                                  Accepted: {(field.documentRequirement.acceptedTypes || []).map(t => 
                                      t === 'image/*' ? 'Images' : t === 'application/pdf' ? 'PDF' : t
                                  ).join(', ')}
                              </p>
                          </div>
                      )}
                  </div>
                );
              };

              // Build steps: each section with fields + unsectioned fields as a step
              const sortedSections = [...sections].sort((a, b) => a.order - b.order);
              const unsectionedFields = fields.filter(f => !f.sectionId && !f.parentFieldId && f.type !== 'table-row');
              
              // Filter sections that have visible fields
              const sectionsWithFields = sortedSections.filter(section => {
                const sectionFields = fields.filter(f => f.sectionId === section.id && !f.parentFieldId && f.type !== 'table-row');
                return sectionFields.length > 0;
              });
              
              // Build steps array
              type FillStep = { id: string; name: string; fields: FormField[] };
              const steps: FillStep[] = [];
              
              sectionsWithFields.forEach(section => {
                const sectionFields = fields.filter(f => f.sectionId === section.id);
                steps.push({ id: section.id, name: section.name, fields: sectionFields });
              });
              
              // Add unsectioned fields as a step if there are any
              if (unsectionedFields.length > 0) {
                const unsectionedVisibleFields = fields.filter(f => !f.sectionId);
                steps.push({ id: '__other__', name: sections.length > 0 ? 'Other Fields' : 'Form Fields', fields: unsectionedVisibleFields });
              }
              
              const totalSteps = steps.length;
              const currentStep = Math.min(currentFillStep, totalSteps - 1);
              const activeStep = steps[currentStep];
              const isLastStep = currentStep === totalSteps - 1;
              const isFirstStep = currentStep === 0;
              
              if (totalSteps === 0) {
                return (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                    No fields to fill
                  </div>
                );
              }
              
              return (
                <>
                  {/* Progress indicator */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500">
                        Step {currentStep + 1} of {totalSteps}
                      </span>
                      <span className="text-xs text-slate-400">
                        {Math.round(((currentStep + 1) / totalSteps) * 100)}% complete
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                      />
                    </div>
                    {/* Step dots */}
                    <div className="flex justify-center gap-1.5 mt-3">
                      {steps.map((step, idx) => (
                        <button
                          key={step.id}
                          onClick={() => setCurrentFillStep(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentStep 
                              ? 'bg-blue-600 w-4' 
                              : idx < currentStep 
                                ? 'bg-blue-400' 
                                : 'bg-slate-300'
                          }`}
                          title={step.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Section header */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Folder size={16} className="text-blue-600" />
                      <h3 className="font-semibold text-blue-800">{activeStep.name}</h3>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {activeStep.fields.filter(f => f.type !== 'table-row' && !f.parentFieldId).length} field(s) in this section
                    </p>
                  </div>
                  
                  {/* Validation Summary for current step */}
                  {(() => {
                    const stepFieldsWithValidation = activeStep.fields.filter(f => 
                      f.validationRules && f.validationRules.length > 0 && f.type !== 'table-row'
                    );
                    const invalidStepFields = stepFieldsWithValidation.filter(f => {
                      const state = validationStates?.get(f.id);
                      return state && !state.isValid && touchedFields?.has(f.id);
                    });
                    
                    if (stepFieldsWithValidation.length === 0) return null;
                    
                    const allTouched = stepFieldsWithValidation.every(f => touchedFields?.has(f.id));
                    const allValid = invalidStepFields.length === 0 && allTouched;
                    
                    if (allValid && allTouched) {
                      return (
                        <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <span className="text-xs text-green-700 font-medium">All required fields completed</span>
                        </div>
                      );
                    }
                    
                    if (invalidStepFields.length > 0) {
                      return (
                        <div className="mb-4 p-2 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
                          <AlertCircle size={16} className="text-red-600" />
                          <span className="text-xs text-red-700 font-medium">{invalidStepFields.length} field(s) need attention</span>
                        </div>
                      );
                    }
                    
                    return null;
                  })()}
                  
                  {/* Fields for current step */}
                  <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                    {activeStep.fields.map(f => renderFillField(f))}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {mode === AppMode.FILL && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
          {(() => {
            const sortedSections = [...sections].sort((a, b) => a.order - b.order);
            const unsectionedFields = fields.filter(f => !f.sectionId && !f.parentFieldId && f.type !== 'table-row');
            const sectionsWithFields = sortedSections.filter(section => {
              const sectionFields = fields.filter(f => f.sectionId === section.id && !f.parentFieldId && f.type !== 'table-row');
              return sectionFields.length > 0;
            });
            
            const totalSteps = sectionsWithFields.length + (unsectionedFields.length > 0 ? 1 : 0);
            const currentStep = Math.min(currentFillStep, totalSteps - 1);
            const isLastStep = currentStep === totalSteps - 1;
            const isFirstStep = currentStep === 0;
            
            if (totalSteps === 0) {
              return (
                <button onClick={onDownload} disabled={fields.length === 0} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50">
                  <Download size={18} /> Download PDF
                </button>
              );
            }
            
            return (
              <div className="flex gap-2">
                {!isFirstStep && (
                  <button 
                    onClick={() => setCurrentFillStep(prev => Math.max(0, prev - 1))}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-medium transition-colors"
                  >
                    <ChevronRight size={18} className="rotate-180" /> Back
                  </button>
                )}
                {isLastStep ? (
                  <button 
                    onClick={onDownload} 
                    disabled={fields.length === 0} 
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentFillStep(prev => prev + 1)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
    </>
  );
};

export default Sidebar;