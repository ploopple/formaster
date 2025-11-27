import React, { useState } from 'react';
import { TableColumn, FormField, FieldOption, MarkStyle, ValidationRule, TableColumnType } from '../types';
import { Plus, Trash2, GripVertical, Columns, LayoutGrid, Wand2, ChevronDown, ChevronUp, Settings2, X } from 'lucide-react';

interface TableBuilderProps {
  field: FormField;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onClose?: () => void;
}

// Column templates for quick setup
const COLUMN_TEMPLATES = [
  {
    name: 'Basic Info',
    icon: '👤',
    columns: [
      { name: 'Name', type: 'text' as const, width: 40 },
      { name: 'ID Number', type: 'number' as const, width: 30 },
      { name: 'Date', type: 'date' as const, width: 30 },
    ]
  },
  {
    name: 'Financial',
    icon: '💰',
    columns: [
      { name: 'Description', type: 'text' as const, width: 40 },
      { name: 'Amount', type: 'number' as const, width: 30 },
      { name: 'Total', type: 'number' as const, width: 30 },
    ]
  },
  {
    name: 'Checklist',
    icon: '✅',
    columns: [
      { name: 'Item', type: 'text' as const, width: 60 },
      { name: 'Done', type: 'checkbox' as const, width: 20 },
      { name: 'Notes', type: 'text' as const, width: 20 },
    ]
  },
];

const COLUMN_TYPES: { value: TableColumnType; label: string; icon: string }[] = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'radio', label: 'Radio', icon: '⭕' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'signature', label: 'Signature', icon: '✍️' },
  { value: 'textarea', label: 'Text Area', icon: '📄' },
];

const TableBuilder: React.FC<TableBuilderProps> = ({ field, onUpdateField }) => {
  const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [expandedColId, setExpandedColId] = useState<string | null>(null);
  
  const columns = field.columns || [];
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const isWidthValid = Math.abs(totalWidth - 100) < 0.1;

  const autoDistributeWidths = () => {
    if (columns.length === 0) return;
    const evenWidth = Math.floor(100 / columns.length);
    const remainder = 100 - (evenWidth * columns.length);
    const newColumns = columns.map((col, idx) => ({
      ...col,
      width: evenWidth + (idx === columns.length - 1 ? remainder : 0)
    }));
    onUpdateField(field.id, { columns: newColumns });
  };

  const applyTemplate = (template: typeof COLUMN_TEMPLATES[0]) => {
    const newColumns: TableColumn[] = template.columns.map(col => ({
      id: crypto.randomUUID(),
      name: col.name,
      type: col.type,
      width: col.width,
      fontSize: 12,
      textAlign: 'center',
    }));
    onUpdateField(field.id, { columns: newColumns, value: '[]' });
    setShowTemplates(false);
  };

  const addColumn = (type: TableColumnType = 'text') => {
    const newCol: TableColumn = {
      id: crypto.randomUUID(),
      name: `Column ${columns.length + 1}`,
      type,
      width: 20,
      fontSize: 12,
      textAlign: 'center',
    };
    if (type === 'radio' || type === 'checkbox' || type === 'select') {
      newCol.options = [
        { id: crypto.randomUUID(), x: 0, y: 0, width: 0, height: 0, value: 'Option 1' },
        { id: crypto.randomUUID(), x: 0, y: 0, width: 0, height: 0, value: 'Option 2' },
      ];
    }
    if (type === 'date') {
      newCol.dateFormat = 'DD/MM/YYYY';
    }
    onUpdateField(field.id, { columns: [...columns, newCol] });
  };

  const updateColumn = (colId: string, updates: Partial<TableColumn>) => {
    const newColumns = columns.map(c => c.id === colId ? { ...c, ...updates } : c);
    onUpdateField(field.id, { columns: newColumns });
  };

  const deleteColumn = (colId: string) => {
    if (columns.length <= 1) return;
    onUpdateField(field.id, { columns: columns.filter(c => c.id !== colId) });
  };

  const handleDragStart = (idx: number) => setDraggedColIndex(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedColIndex === null || draggedColIndex === idx) return;
    const newColumns = [...columns];
    const [dragged] = newColumns.splice(draggedColIndex, 1);
    newColumns.splice(idx, 0, dragged);
    onUpdateField(field.id, { columns: newColumns });
    setDraggedColIndex(idx);
  };
  const handleDragEnd = () => setDraggedColIndex(null);

  const addColumnOption = (colId: string) => {
    const col = columns.find(c => c.id === colId);
    if (!col) return;
    const newOption: FieldOption = {
      id: crypto.randomUUID(),
      x: 0, y: 0, width: 0, height: 0,
      value: `Option ${(col.options?.length || 0) + 1}`
    };
    updateColumn(colId, { options: [...(col.options || []), newOption] });
  };

  const updateColumnOption = (colId: string, optId: string, value: string) => {
    const col = columns.find(c => c.id === colId);
    if (!col?.options) return;
    updateColumn(colId, { options: col.options.map(o => o.id === optId ? { ...o, value } : o) });
  };

  const deleteColumnOption = (colId: string, optId: string) => {
    const col = columns.find(c => c.id === colId);
    if (!col?.options) return;
    updateColumn(colId, { options: col.options.filter(o => o.id !== optId) });
  };

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Table Columns</h3>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowTemplates(!showTemplates)} className="text-xs px-2 py-1 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded flex items-center gap-1 transition-colors">
            <Wand2 size={12} /> Templates
          </button>
          <button onClick={autoDistributeWidths} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded flex items-center gap-1 transition-colors" title="Distribute widths evenly">
            <Columns size={12} /> Auto-fit
          </button>
        </div>
      </div>

      {/* Templates dropdown */}
      {showTemplates && (
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-2">
          <p className="text-xs text-purple-700 font-medium">Quick Templates</p>
          <div className="grid grid-cols-2 gap-2">
            {COLUMN_TEMPLATES.map((template, idx) => (
              <button key={idx} onClick={() => applyTemplate(template)} className="flex items-center gap-2 p-2 bg-white rounded border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-left">
                <span className="text-lg">{template.icon}</span>
                <div>
                  <p className="text-xs font-medium text-slate-700">{template.name}</p>
                  <p className="text-[10px] text-slate-400">{template.columns.length} columns</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Width indicator */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className={`h-full transition-all ${isWidthValid ? 'bg-green-500' : totalWidth > 100 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${Math.min(totalWidth, 100)}%` }} />
        </div>
        <span className={`text-xs font-mono ${isWidthValid ? 'text-green-600' : 'text-red-600'}`}>{totalWidth.toFixed(0)}%</span>
      </div>
      {!isWidthValid && (
        <p className="text-[10px] text-amber-600 flex items-center gap-1">
          ⚠️ Column widths should add up to 100%
          <button onClick={autoDistributeWidths} className="underline hover:text-amber-700">Fix it</button>
        </p>
      )}

      {/* Visual column preview */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="flex h-8 bg-slate-100 border-b border-slate-200">
          {columns.map((col) => (
            <div key={col.id} className="flex items-center justify-center text-[10px] font-medium text-slate-600 border-r border-slate-200 last:border-r-0 truncate px-1" style={{ width: `${col.width}%` }}>
              {col.name}
            </div>
          ))}
        </div>
        <div className="flex h-6 bg-slate-50">
          {columns.map((col) => (
            <div key={col.id} className="flex items-center justify-center text-[9px] text-slate-400 border-r border-slate-100 last:border-r-0" style={{ width: `${col.width}%` }}>
              {col.width}%
            </div>
          ))}
        </div>
      </div>

      {/* Column list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {columns.map((col, idx) => {
          const isExpanded = expandedColId === col.id;
          return (
            <div key={col.id} draggable onDragStart={() => handleDragStart(idx)} onDragOver={(e) => handleDragOver(e, idx)} onDragEnd={handleDragEnd}
              className={`border rounded-lg transition-all ${draggedColIndex === idx ? 'opacity-50 border-blue-400' : 'border-slate-200'} ${isExpanded ? 'bg-slate-50' : 'bg-white'}`}>
              {/* Column header row */}
              <div className="flex items-center gap-2 p-2">
                <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"><GripVertical size={14} /></div>
                <input type="text" value={col.name} onChange={(e) => updateColumn(col.id, { name: e.target.value })} className="flex-1 min-w-0 px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200" placeholder="Column name" />
                <select value={col.type} onChange={(e) => {
                  const newType = e.target.value as TableColumnType;
                  const updates: Partial<TableColumn> = { type: newType };
                  if ((newType === 'radio' || newType === 'checkbox' || newType === 'select') && (!col.options || col.options.length === 0)) {
                    updates.options = [
                      { id: crypto.randomUUID(), x: 0, y: 0, width: 0, height: 0, value: 'Option 1' },
                      { id: crypto.randomUUID(), x: 0, y: 0, width: 0, height: 0, value: 'Option 2' },
                    ];
                  }
                  if (newType === 'date' && !col.dateFormat) updates.dateFormat = 'DD/MM/YYYY';
                  updateColumn(col.id, updates);
                }} className="w-24 px-1 py-1 text-[10px] border border-slate-200 rounded bg-white">
                  {COLUMN_TYPES.map(t => (<option key={t.value} value={t.value}>{t.icon} {t.label}</option>))}
                </select>
                <button onClick={() => setExpandedColId(isExpanded ? null : col.id)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                  {isExpanded ? <ChevronUp size={14} /> : <Settings2 size={14} />}
                </button>
                <button onClick={() => deleteColumn(col.id)} disabled={columns.length <= 1} className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={14} /></button>
              </div>

              {/* Expanded settings - Full field properties */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-3">
                  {/* Width slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-medium text-slate-500">Width</label>
                      <span className="text-[10px] font-mono text-slate-600">{col.width}%</span>
                    </div>
                    <input type="range" min="1" max="90" value={col.width} onChange={(e) => updateColumn(col.id, { width: Math.max(1, Math.min(90, Number(e.target.value))) })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>

                  {/* Typography - for text-based types */}
                  {['text', 'number', 'date', 'select', 'textarea'].includes(col.type) && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Typography</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400">Font Size</label>
                          <input type="number" value={col.fontSize || 12} onChange={(e) => updateColumn(col.id, { fontSize: Number(e.target.value) })} className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white" />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400">Letter Spacing</label>
                          <input type="number" step="0.5" value={col.letterSpacing || 0} onChange={(e) => updateColumn(col.id, { letterSpacing: Number(e.target.value) })} className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400">Text Align</label>
                        <div className="flex bg-slate-100 rounded p-0.5 gap-0.5">
                          {['left', 'center', 'right'].map((align) => (
                            <button key={align} onClick={() => updateColumn(col.id, { textAlign: align as 'left' | 'center' | 'right' })}
                              className={`flex-1 py-1 text-[10px] rounded ${col.textAlign === align || (!col.textAlign && align === 'center') ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(col.type === 'text' || col.type === 'number' || col.type === 'textarea') && (
                        <div>
                          <label className="text-[9px] text-slate-400">Max Length</label>
                          <input type="number" min="0" value={col.maxLength || ''} onChange={(e) => updateColumn(col.id, { maxLength: e.target.value ? Number(e.target.value) : undefined })} placeholder="No limit" className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visual Styling */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Styling</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-400">Text Color</label>
                        <div className="flex items-center gap-1">
                          <input type="color" value={col.color || '#000000'} onChange={(e) => updateColumn(col.id, { color: e.target.value })} className="w-6 h-6 rounded border-0 p-0 cursor-pointer" />
                          <button onClick={() => updateColumn(col.id, { color: undefined })} className="text-[9px] text-slate-400 hover:text-red-500">×</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400">Background</label>
                        <div className="flex items-center gap-1">
                          <input type="color" value={col.backgroundColor || '#ffffff'} onChange={(e) => updateColumn(col.id, { backgroundColor: e.target.value })} className="w-6 h-6 rounded border-0 p-0 cursor-pointer" />
                          <button onClick={() => updateColumn(col.id, { backgroundColor: undefined })} className="text-[9px] text-slate-400 hover:text-red-500">×</button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400">Padding</label>
                      <input type="number" min="0" value={col.padding || 0} onChange={(e) => updateColumn(col.id, { padding: Number(e.target.value) })} className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white" />
                    </div>
                  </div>

                  {/* Date format */}
                  {col.type === 'date' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Date Settings</label>
                      <select value={col.dateFormat || 'DD/MM/YYYY'} onChange={(e) => updateColumn(col.id, { dateFormat: e.target.value })} className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/YYYY">MM/YYYY</option>
                        <option value="YYYY">YYYY</option>
                      </select>
                      <label className="flex items-center gap-2 text-[10px] text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={col.dateHideSeparator || false} onChange={(e) => updateColumn(col.id, { dateHideSeparator: e.target.checked })} className="rounded border-slate-300 text-blue-600" />
                        Hide "/" separator in PDF
                      </label>
                    </div>
                  )}

                  {/* Options for radio/checkbox/select */}
                  {(col.type === 'radio' || col.type === 'checkbox' || col.type === 'select') && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Options</label>
                        <button onClick={() => addColumnOption(col.id)} className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-0.5"><Plus size={10} /> Add</button>
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {(col.options || []).map((opt) => (
                          <div key={opt.id} className="flex items-center gap-1">
                            <input type="text" value={opt.value} onChange={(e) => updateColumnOption(col.id, opt.id, e.target.value)} placeholder="Option value" className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded bg-white" />
                            <button onClick={() => deleteColumnOption(col.id, opt.id)} className="p-1 text-slate-400 hover:text-red-500"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mark style for radio/checkbox */}
                  {(col.type === 'radio' || col.type === 'checkbox') && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Mark Style</label>
                      <div className="grid grid-cols-6 gap-1">
                        {[
                          { value: 'checkmark', label: '✓' },
                          { value: 'x', label: '✕' },
                          { value: 'circle', label: '○' },
                          { value: 'square', label: '■' },
                          { value: 'dot', label: '●' },
                          { value: 'none', label: '∅' },
                        ].map((mark) => (
                          <button key={mark.value} onClick={() => updateColumn(col.id, { markStyle: mark.value as MarkStyle })}
                            className={`py-1 rounded border text-sm ${(col.markStyle || 'checkmark') === mark.value ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                            {mark.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add column buttons */}
      <div className="flex flex-wrap gap-1">
        {COLUMN_TYPES.slice(0, 6).map(t => (
          <button key={t.value} onClick={() => addColumn(t.value)} className="flex items-center gap-1 px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors">
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Table settings */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Settings2 size={14} className="text-slate-500" />
          <span className="text-xs font-medium text-slate-700">Table Settings</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-500">Max Rows</label>
            <input type="number" min="1" max="50" value={field.maxRows || 1} onChange={(e) => onUpdateField(field.id, { maxRows: Number(e.target.value) })} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded bg-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-500">Cell Padding</label>
            <input type="number" min="0" max="20" value={field.cellPadding || 2} onChange={(e) => onUpdateField(field.id, { cellPadding: Number(e.target.value) })} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded bg-white" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={field.showHeaders || false} onChange={(e) => onUpdateField(field.id, { showHeaders: e.target.checked })} className="rounded border-slate-300 text-blue-600" />
          <span className="text-xs text-slate-700">Show column headers</span>
        </label>
      </div>
    </div>
  );
};

export default TableBuilder;
