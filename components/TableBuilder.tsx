import React, { useState } from 'react';
import { TableColumn, FormField } from '../types';
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
      { header: 'Name', type: 'text' as const, width: 40 },
      { header: 'ID Number', type: 'number' as const, width: 30 },
      { header: 'Date', type: 'date' as const, width: 30 },
    ]
  },
  {
    name: 'Financial',
    icon: '💰',
    columns: [
      { header: 'Description', type: 'text' as const, width: 40 },
      { header: 'Amount', type: 'number' as const, width: 30 },
      { header: 'Total', type: 'number' as const, width: 30 },
    ]
  },
  {
    name: 'Checklist',
    icon: '✅',
    columns: [
      { header: 'Item', type: 'text' as const, width: 60 },
      { header: 'Done', type: 'checkbox' as const, width: 20 },
      { header: 'Notes', type: 'text' as const, width: 20 },
    ]
  },
  {
    name: 'Contact List',
    icon: '📞',
    columns: [
      { header: 'Name', type: 'text' as const, width: 30 },
      { header: 'Phone', type: 'text' as const, width: 25 },
      { header: 'Email', type: 'text' as const, width: 30 },
      { header: 'Active', type: 'checkbox' as const, width: 15 },
    ]
  },
  {
    name: 'Schedule',
    icon: '📅',
    columns: [
      { header: 'Date', type: 'date' as const, width: 25 },
      { header: 'Time', type: 'text' as const, width: 20 },
      { header: 'Event', type: 'text' as const, width: 40 },
      { header: 'Confirmed', type: 'checkbox' as const, width: 15 },
    ]
  },
];

const COLUMN_TYPES = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'date', label: 'Date', icon: '📅' },
];

const TableBuilder: React.FC<TableBuilderProps> = ({ field, onUpdateField, onClose }) => {
  const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [expandedColId, setExpandedColId] = useState<string | null>(null);
  
  const columns = field.columns || [];
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const isWidthValid = Math.abs(totalWidth - 100) < 0.1;

  // Auto-distribute column widths evenly
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

  // Apply a template
  const applyTemplate = (template: typeof COLUMN_TEMPLATES[0]) => {
    const newColumns: TableColumn[] = template.columns.map(col => ({
      id: crypto.randomUUID(),
      header: col.header,
      type: col.type,
      width: col.width,
    }));
    onUpdateField(field.id, { columns: newColumns, value: '[]' });
    setShowTemplates(false);
  };

  // Add a new column
  const addColumn = (type: TableColumn['type'] = 'text') => {
    const newCol: TableColumn = {
      id: crypto.randomUUID(),
      header: `Column ${columns.length + 1}`,
      type,
      width: 20,
    };
    onUpdateField(field.id, { columns: [...columns, newCol] });
  };

  // Update a column
  const updateColumn = (colId: string, updates: Partial<TableColumn>) => {
    const newColumns = columns.map(c => c.id === colId ? { ...c, ...updates } : c);
    onUpdateField(field.id, { columns: newColumns });
  };

  // Delete a column
  const deleteColumn = (colId: string) => {
    if (columns.length <= 1) return;
    onUpdateField(field.id, { columns: columns.filter(c => c.id !== colId) });
  };

  // Drag and drop reordering
  const handleDragStart = (idx: number) => {
    setDraggedColIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedColIndex === null || draggedColIndex === idx) return;
    
    const newColumns = [...columns];
    const [dragged] = newColumns.splice(draggedColIndex, 1);
    newColumns.splice(idx, 0, dragged);
    onUpdateField(field.id, { columns: newColumns });
    setDraggedColIndex(idx);
  };

  const handleDragEnd = () => {
    setDraggedColIndex(null);
  };

  // Adjust width with slider
  const handleWidthChange = (colId: string, newWidth: number) => {
    updateColumn(colId, { width: Math.max(5, Math.min(90, newWidth)) });
  };

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Table Builder</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs px-2 py-1 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded flex items-center gap-1 transition-colors"
          >
            <Wand2 size={12} /> Templates
          </button>
          <button
            onClick={autoDistributeWidths}
            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded flex items-center gap-1 transition-colors"
            title="Distribute widths evenly"
          >
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
              <button
                key={idx}
                onClick={() => applyTemplate(template)}
                className="flex items-center gap-2 p-2 bg-white rounded border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
              >
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
          <div 
            className={`h-full transition-all ${isWidthValid ? 'bg-green-500' : totalWidth > 100 ? 'bg-red-500' : 'bg-yellow-500'}`}
            style={{ width: `${Math.min(totalWidth, 100)}%` }}
          />
        </div>
        <span className={`text-xs font-mono ${isWidthValid ? 'text-green-600' : 'text-red-600'}`}>
          {totalWidth.toFixed(0)}%
        </span>
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
          {columns.map((col, idx) => (
            <div
              key={col.id}
              className="flex items-center justify-center text-[10px] font-medium text-slate-600 border-r border-slate-200 last:border-r-0 truncate px-1"
              style={{ width: `${col.width}%` }}
            >
              {col.header}
            </div>
          ))}
        </div>
        <div className="flex h-6 bg-slate-50">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex items-center justify-center text-[9px] text-slate-400 border-r border-slate-100 last:border-r-0"
              style={{ width: `${col.width}%` }}
            >
              {col.width}%
            </div>
          ))}
        </div>
      </div>

      {/* Column list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {columns.map((col, idx) => {
          const isExpanded = expandedColId === col.id;
          return (
            <div
              key={col.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`border rounded-lg transition-all ${
                draggedColIndex === idx ? 'opacity-50 border-blue-400' : 'border-slate-200'
              } ${isExpanded ? 'bg-slate-50' : 'bg-white'}`}
            >
              {/* Column header row */}
              <div className="flex items-center gap-2 p-2">
                <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                  <GripVertical size={14} />
                </div>
                
                <input
                  type="text"
                  value={col.header}
                  onChange={(e) => updateColumn(col.id, { header: e.target.value })}
                  className="flex-1 min-w-0 px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                  placeholder="Column name"
                />
                
                <select
                  value={col.type}
                  onChange={(e) => {
                    const newType = e.target.value as TableColumn['type'];
                    const updates: Partial<TableColumn> = { type: newType };
                    if (newType === 'select' && (!col.options || col.options.length === 0)) {
                      updates.options = ['Option 1', 'Option 2'];
                    }
                    updateColumn(col.id, updates);
                  }}
                  className="w-20 px-1 py-1 text-[10px] border border-slate-200 rounded bg-white"
                >
                  {COLUMN_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>

                <button
                  onClick={() => setExpandedColId(isExpanded ? null : col.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                >
                  {isExpanded ? <ChevronUp size={14} /> : <Settings2 size={14} />}
                </button>

                <button
                  onClick={() => deleteColumn(col.id)}
                  disabled={columns.length <= 1}
                  className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Expanded settings */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-3">
                  {/* Width slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-medium text-slate-500">Width</label>
                      <span className="text-[10px] font-mono text-slate-600">{col.width}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="90"
                      value={col.width}
                      onChange={(e) => handleWidthChange(col.id, Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>5%</span>
                      <span>90%</span>
                    </div>
                  </div>

                  {/* Select options */}
                  {col.type === 'select' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-medium text-slate-500">Dropdown Options</label>
                        <button
                          onClick={() => updateColumn(col.id, { options: [...(col.options || []), ''] })}
                          className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                        >
                          <Plus size={10} /> Add
                        </button>
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {(col.options || []).map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-1">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...(col.options || [])];
                                newOptions[optIdx] = e.target.value;
                                updateColumn(col.id, { options: newOptions });
                              }}
                              placeholder={`Option ${optIdx + 1}`}
                              className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                            />
                            <button
                              onClick={() => {
                                const newOptions = (col.options || []).filter((_, i) => i !== optIdx);
                                updateColumn(col.id, { options: newOptions });
                              }}
                              className="p-1 text-slate-400 hover:text-red-500"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date format */}
                  {col.type === 'date' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-500">Date Format</label>
                      <select
                        value={col.dateFormat || 'DD/MM/YYYY'}
                        onChange={(e) => updateColumn(col.id, { dateFormat: e.target.value })}
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/YYYY">MM/YYYY</option>
                        <option value="YYYY">YYYY</option>
                      </select>
                    </div>
                  )}

                  {/* Cell spacing */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-medium text-slate-500">Cell Spacing</label>
                      <span className="text-[10px] font-mono text-slate-600">{col.spacing || 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={col.spacing || 0}
                      onChange={(e) => updateColumn(col.id, { spacing: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>0px</span>
                      <span>20px</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add column buttons */}
      <div className="flex flex-wrap gap-1">
        {COLUMN_TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => addColumn(t.value as TableColumn['type'])}
            className="flex items-center gap-1 px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
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
            <input
              type="number"
              min="1"
              max="50"
              value={field.maxRows || 1}
              onChange={(e) => onUpdateField(field.id, { maxRows: Number(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-500">Cell Padding</label>
            <input
              type="number"
              min="0"
              max="20"
              value={field.cellPadding || 2}
              onChange={(e) => onUpdateField(field.id, { cellPadding: Number(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded bg-white"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={field.showHeaders || false}
            onChange={(e) => onUpdateField(field.id, { showHeaders: e.target.checked })}
            className="rounded border-slate-300 text-blue-600"
          />
          <span className="text-xs text-slate-700">Show column headers</span>
        </label>
      </div>
    </div>
  );
};

export default TableBuilder;
