'use client';

import React, { useCallback, useRef, useState } from 'react';
import { TableColumn, FormField, FieldOption, MarkStyle, TableColumnType } from '../types';
import {
  Plus, Trash2, GripVertical, Wand2, Settings2, X, Table as TableIcon,
  LayoutGrid, Move, Copy, AlignVerticalSpaceAround, ChevronRight, Palette,
} from 'lucide-react';
import { generateUUID } from '../lib/uuid';
import { makeColumn } from '../lib/fieldTypes';

interface TableBuilderProps {
  field: FormField;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  /** Every field in the form, used to find this table's manual rows */
  fields: FormField[];
  onSelectField: (id: string | null) => void;
  onDeleteField: (id: string) => void;
  /** Switches between auto layout and hand-placed rows, creating/removing rows */
  onSetRowLayout?: (tableId: string, layout: 'auto' | 'manual') => void;
  onAddTableRow?: (tableId: string) => void;
  /** Spreads the manual rows evenly down the table box */
  onDistributeRows?: (tableId: string) => void;
}

const MIN_COLUMN_WIDTH = 4;

const COLUMN_TYPES: { value: TableColumnType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'select', label: 'Dropdown' },
  { value: 'textarea', label: 'Paragraph' },
  { value: 'signature', label: 'Signature' },
];

const TABLE_TEMPLATES: { name: string; icon: string; columns: [string, TableColumnType, number][] }[] = [
  { name: 'People', icon: '\u{1F464}', columns: [['Name', 'text', 40], ['ID Number', 'number', 30], ['Date', 'date', 30]] },
  { name: 'Amounts', icon: '\u{1F4B0}', columns: [['Description', 'text', 50], ['Qty', 'number', 20], ['Amount', 'number', 30]] },
  { name: 'Checklist', icon: '✅', columns: [['Item', 'text', 65], ['Done', 'checkbox', 15], ['Notes', 'text', 20]] },
  { name: 'Dates', icon: '\u{1F4C5}', columns: [['From', 'date', 33], ['To', 'date', 33], ['Reason', 'text', 34]] },
];

const MARK_STYLES: { value: MarkStyle; label: string }[] = [
  { value: 'checkmark', label: '✓' },
  { value: 'x', label: '✕' },
  { value: 'circle', label: '○' },
  { value: 'square', label: '■' },
  { value: 'dot', label: '●' },
  { value: 'none', label: '∅' },
];

/** Scales a set of column widths so they always add up to exactly 100 */
const normalize = (columns: TableColumn[]): TableColumn[] => {
  if (columns.length === 0) return columns;
  const total = columns.reduce((sum, c) => sum + c.width, 0);
  if (total <= 0) {
    const even = Math.round((100 / columns.length) * 10) / 10;
    return columns.map((c) => ({ ...c, width: even }));
  }
  const rounded = columns.map((c) => ({ ...c, width: Math.round((c.width / total) * 1000) / 10 }));
  // Put any rounding remainder on the last column so the total is exactly 100
  const drift = 100 - rounded.reduce((sum, c) => sum + c.width, 0);
  const last = rounded[rounded.length - 1];
  last.width = Math.round((last.width + drift) * 10) / 10;
  return rounded;
};

const TableBuilder: React.FC<TableBuilderProps> = ({
  field, onUpdateField, fields, onSelectField, onDeleteField,
  onSetRowLayout, onAddTableRow, onDistributeRows,
}) => {
  const [selectedColId, setSelectedColId] = useState<string | null>(null);
  const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ index: number; startX: number; barWidth: number; widths: number[] } | null>(null);

  const columns = field.columns || [];
  const manualRows = fields
    .filter((f) => f.parentFieldId === field.id && f.type === 'table-row')
    .sort((a, b) => (a.rowIndex || 0) - (b.rowIndex || 0));

  // Tables saved before rowLayout existed are inferred from their row children
  const layout: 'auto' | 'manual' = field.rowLayout ?? (manualRows.length > 0 ? 'manual' : 'auto');

  const selectedCol = columns.find((c) => c.id === selectedColId) || null;

  const setColumns = useCallback((next: TableColumn[]) => {
    onUpdateField(field.id, { columns: normalize(next) });
  }, [field.id, onUpdateField]);

  const updateColumn = (colId: string, updates: Partial<TableColumn>) => {
    onUpdateField(field.id, {
      columns: (field.columns || []).map((c) => (c.id === colId ? { ...c, ...updates } : c)),
    });
  };

  const addColumn = (type: TableColumnType = 'text') => {
    const next = [...columns, makeColumn(`Column ${columns.length + 1}`, type, 100 / (columns.length + 1))];
    setColumns(next);
    setSelectedColId(next[next.length - 1].id);
  };

  const deleteColumn = (colId: string) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((c) => c.id !== colId));
    if (selectedColId === colId) setSelectedColId(null);
  };

  const duplicateColumn = (colId: string) => {
    const idx = columns.findIndex((c) => c.id === colId);
    if (idx < 0) return;
    const copy: TableColumn = {
      ...columns[idx],
      id: generateUUID(),
      name: `${columns[idx].name} copy`,
      options: columns[idx].options?.map((o) => ({ ...o, id: generateUUID() })),
    };
    const next = [...columns];
    next.splice(idx + 1, 0, copy);
    setColumns(next);
    setSelectedColId(copy.id);
  };

  const distributeColumns = () => setColumns(columns.map((c) => ({ ...c, width: 100 / columns.length })));

  const applyTemplate = (template: typeof TABLE_TEMPLATES[0]) => {
    onUpdateField(field.id, {
      columns: normalize(template.columns.map(([name, type, width]) => makeColumn(name, type, width))),
      value: '[]',
    });
    setShowTemplates(false);
    setSelectedColId(null);
  };

  // --- Drag a divider to trade width between two neighbouring columns ---
  const onResizePointerDown = (e: React.PointerEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const bar = barRef.current;
    if (!bar) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    resizeRef.current = {
      index,
      startX: e.clientX,
      barWidth: bar.getBoundingClientRect().width,
      widths: columns.map((c) => c.width),
    };
  };

  const onResizePointerMove = (e: React.PointerEvent) => {
    const state = resizeRef.current;
    if (!state) return;
    const deltaPct = ((e.clientX - state.startX) / state.barWidth) * 100;
    const left = state.widths[state.index];
    const right = state.widths[state.index + 1];
    const pair = left + right;
    const nextLeft = Math.max(MIN_COLUMN_WIDTH, Math.min(pair - MIN_COLUMN_WIDTH, left + deltaPct));

    onUpdateField(field.id, {
      columns: columns.map((c, i) => {
        if (i === state.index) return { ...c, width: Math.round(nextLeft * 10) / 10 };
        if (i === state.index + 1) return { ...c, width: Math.round((pair - nextLeft) * 10) / 10 };
        return c;
      }),
    });
  };

  const onResizePointerUp = (e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    resizeRef.current = null;
  };

  // --- Reorder columns by dragging their chip ---
  const onChipDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedColIndex === null || draggedColIndex === idx) return;
    const next = [...columns];
    const [moved] = next.splice(draggedColIndex, 1);
    next.splice(idx, 0, moved);
    onUpdateField(field.id, { columns: next });
    setDraggedColIndex(idx);
  };

  const rowCount = field.maxRows || 1;
  const setRowCount = (count: number) => {
    const clamped = Math.max(1, Math.min(50, count));
    onUpdateField(field.id, {
      maxRows: clamped,
      filledRows: Math.min(field.filledRows || 1, clamped),
    });
  };

  const label = 'text-[10px] font-bold text-slate-500 uppercase tracking-wide';
  const input = 'w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none';

  return (
    <div className="space-y-4">
      {/* ---- Row layout -------------------------------------------------- */}
      <div className="space-y-2">
        <span className={label}>Row layout</span>
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => onSetRowLayout?.(field.id, 'auto')}
            className={`flex flex-col items-center gap-1 py-2 rounded-md transition-all ${
              layout === 'auto' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutGrid size={15} />
            <span className="text-[10px] font-semibold">Auto grid</span>
          </button>
          <button
            onClick={() => onSetRowLayout?.(field.id, 'manual')}
            className={`flex flex-col items-center gap-1 py-2 rounded-md transition-all ${
              layout === 'manual' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Move size={15} />
            <span className="text-[10px] font-semibold">Place rows</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 leading-snug">
          {layout === 'auto'
            ? 'Rows share the table box evenly. Resize the box on the page to change row height.'
            : 'Every row is its own box you can drag onto the printed lines of the PDF.'}
        </p>
      </div>

      {/* ---- Rows -------------------------------------------------------- */}
      {layout === 'auto' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={label}>Rows</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setRowCount(rowCount - 1)} disabled={rowCount <= 1}
                className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30">&minus;</button>
              <span className="w-8 text-center text-xs font-mono text-slate-700">{rowCount}</span>
              <button onClick={() => setRowCount(rowCount + 1)} disabled={rowCount >= 50}
                className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30">+</button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" checked={field.showHeaders || false}
              onChange={(e) => onUpdateField(field.id, { showHeaders: e.target.checked })}
              className="rounded border-slate-300 text-blue-600" />
            Reserve a header row
          </label>
          {field.showHeaders && (
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pl-5">
              <input type="checkbox" checked={field.printHeaderText || false}
                onChange={(e) => onUpdateField(field.id, { printHeaderText: e.target.checked })}
                className="rounded border-slate-300 text-blue-600" />
              Print the column names in it
            </label>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={label}>Rows ({manualRows.length})</span>
            <div className="flex items-center gap-1">
              <button onClick={() => onDistributeRows?.(field.id)} disabled={manualRows.length < 2}
                title="Spread rows evenly down the table box"
                className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30">
                <AlignVerticalSpaceAround size={14} />
              </button>
              <button onClick={() => onAddTableRow?.(field.id)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded">
                <Plus size={11} /> Add row
              </button>
            </div>
          </div>
          {manualRows.length === 0 ? (
            <p className="text-[10px] text-slate-400 italic py-2 text-center">No rows yet &mdash; add one to place it on the page.</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {manualRows.map((row, idx) => (
                <div key={row.id} className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded text-xs">
                  <span className="w-5 text-center text-[10px] font-mono text-slate-400">{idx + 1}</span>
                  <span className="flex-1 truncate text-slate-700">{row.name}</span>
                  <button onClick={() => onSelectField(row.id)} className="p-1 text-slate-400 hover:text-blue-600" title="Select on page">
                    <ChevronRight size={13} />
                  </button>
                  <button onClick={() => onDeleteField(row.id)} className="p-1 text-slate-400 hover:text-red-500" title="Delete row">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- Columns ----------------------------------------------------- */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className={label}>Columns</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowTemplates(!showTemplates)} title="Start from a template"
              className="p-1 rounded text-slate-500 hover:text-purple-600 hover:bg-purple-50">
              <Wand2 size={14} />
            </button>
            <button onClick={distributeColumns} title="Make all columns the same width"
              className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50">
              <AlignVerticalSpaceAround size={14} className="rotate-90" />
            </button>
          </div>
        </div>

        {showTemplates && (
          <div className="grid grid-cols-2 gap-1.5 p-2 bg-purple-50 rounded-lg border border-purple-200">
            {TABLE_TEMPLATES.map((tpl) => (
              <button key={tpl.name} onClick={() => applyTemplate(tpl)}
                className="flex items-center gap-1.5 p-1.5 bg-white rounded border border-purple-200 hover:border-purple-400 text-left">
                <span>{tpl.icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-slate-700 truncate">{tpl.name}</p>
                  <p className="text-[9px] text-slate-400">{tpl.columns.length} cols</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Width bar: drag a divider to trade width between neighbours */}
        <div
          ref={barRef}
          className="relative flex h-11 rounded-lg border border-slate-200 overflow-hidden bg-white select-none"
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
        >
          {columns.map((col, idx) => (
            <React.Fragment key={col.id}>
              <button
                onClick={() => setSelectedColId(selectedColId === col.id ? null : col.id)}
                className={`relative min-w-0 flex flex-col items-center justify-center transition-colors ${
                  selectedColId === col.id ? 'bg-blue-100 text-blue-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
                style={{ width: `${col.width}%` }}
                title={`${col.name} - ${col.width}%`}
              >
                <span className="text-[10px] font-medium truncate max-w-full px-1">{col.name}</span>
                <span className="text-[9px] font-mono text-slate-400">{col.width}%</span>
              </button>
              {idx < columns.length - 1 && (
                <div
                  onPointerDown={(e) => onResizePointerDown(e, idx)}
                  className="w-1.5 shrink-0 cursor-col-resize bg-slate-200 hover:bg-blue-500 active:bg-blue-600 transition-colors touch-none"
                  title="Drag to resize"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Column chips: reorder, select, duplicate, delete */}
        <div className="flex flex-wrap gap-1">
          {columns.map((col, idx) => (
            <div
              key={col.id}
              draggable
              onDragStart={() => setDraggedColIndex(idx)}
              onDragOver={(e) => onChipDragOver(e, idx)}
              onDragEnd={() => setDraggedColIndex(null)}
              className={`flex items-center gap-1 pl-1 pr-0.5 py-0.5 rounded border text-[10px] cursor-grab active:cursor-grabbing ${
                selectedColId === col.id ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
              } ${draggedColIndex === idx ? 'opacity-40' : ''}`}
            >
              <GripVertical size={10} className="text-slate-300" />
              <button onClick={() => setSelectedColId(selectedColId === col.id ? null : col.id)} className="max-w-[80px] truncate">
                {col.name}
              </button>
              <button onClick={() => duplicateColumn(col.id)} className="p-0.5 text-slate-300 hover:text-blue-600" title="Duplicate">
                <Copy size={10} />
              </button>
              <button onClick={() => deleteColumn(col.id)} disabled={columns.length <= 1}
                className="p-0.5 text-slate-300 hover:text-red-500 disabled:opacity-30" title="Delete">
                <X size={11} />
              </button>
            </div>
          ))}
          <button onClick={() => addColumn('text')}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-dashed border-slate-300 text-[10px] text-slate-500 hover:border-blue-400 hover:text-blue-600">
            <Plus size={10} /> Column
          </button>
        </div>
      </div>

      {/* ---- Selected column -------------------------------------------- */}
      {selectedCol && (
        <div className="space-y-3 p-3 rounded-lg border border-blue-200 bg-blue-50/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Settings2 size={13} className="text-blue-600" />
              <span className="text-[11px] font-bold text-slate-700">Column settings</span>
            </div>
            <button onClick={() => setSelectedColId(null)} className="p-0.5 text-slate-400 hover:text-slate-600"><X size={13} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Name</label>
              <input type="text" value={selectedCol.name} className={input}
                onChange={(e) => updateColumn(selectedCol.id, { name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Type</label>
              <select value={selectedCol.type} className={input}
                onChange={(e) => {
                  const nextType = e.target.value as TableColumnType;
                  const updates: Partial<TableColumn> = { type: nextType };
                  if ((nextType === 'radio' || nextType === 'checkbox' || nextType === 'select') && !selectedCol.options?.length) {
                    updates.options = [
                      { id: generateUUID(), x: 0, y: 0, width: 0, height: 0, value: 'Option 1' },
                      { id: generateUUID(), x: 0, y: 0, width: 0, height: 0, value: 'Option 2' },
                    ];
                  }
                  if (nextType === 'date' && !selectedCol.dateFormat) updates.dateFormat = 'DD/MM/YYYY';
                  updateColumn(selectedCol.id, updates);
                }}>
                {COLUMN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[9px] text-slate-500">Width</label>
              <span className="text-[9px] font-mono text-slate-600">{selectedCol.width}%</span>
            </div>
            <input type="range" min={MIN_COLUMN_WIDTH} max="90" step="0.5" value={selectedCol.width}
              onChange={(e) => {
                const idx = columns.findIndex((c) => c.id === selectedCol.id);
                // Take the difference from the next column, or the previous one
                const neighbour = idx < columns.length - 1 ? idx + 1 : idx - 1;
                if (neighbour < 0) return;
                const pair = columns[idx].width + columns[neighbour].width;
                const clamped = Math.max(MIN_COLUMN_WIDTH, Math.min(pair - MIN_COLUMN_WIDTH, Number(e.target.value)));
                onUpdateField(field.id, {
                  columns: columns.map((c, i) =>
                    i === idx ? { ...c, width: clamped }
                    : i === neighbour ? { ...c, width: Math.round((pair - clamped) * 10) / 10 }
                    : c),
                });
              }}
              className="w-full accent-blue-600" />
          </div>

          {/* Typography */}
          {['text', 'number', 'date', 'select', 'textarea'].includes(selectedCol.type) && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500">Font size</label>
                  <input type="number" value={selectedCol.fontSize || 12} className={input}
                    onChange={(e) => updateColumn(selectedCol.id, { fontSize: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500">Letter spacing</label>
                  <input type="number" step="0.5" value={selectedCol.letterSpacing || 0} className={input}
                    onChange={(e) => updateColumn(selectedCol.id, { letterSpacing: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500">Align</label>
                <div className="flex bg-white rounded border border-slate-200 p-0.5 gap-0.5">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button key={align} onClick={() => updateColumn(selectedCol.id, { textAlign: align })}
                      className={`flex-1 py-1 text-[10px] rounded capitalize ${
                        (selectedCol.textAlign || 'center') === align ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-500 hover:bg-slate-50'
                      }`}>{align}</button>
                  ))}
                </div>
              </div>
              {['text', 'number', 'textarea'].includes(selectedCol.type) && (
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500">Max length</label>
                  <input type="number" min="0" placeholder="No limit" value={selectedCol.maxLength || ''} className={input}
                    onChange={(e) => updateColumn(selectedCol.id, { maxLength: e.target.value ? Number(e.target.value) : undefined })} />
                </div>
              )}
            </div>
          )}

          {/* Date */}
          {selectedCol.type === 'date' && (
            <div className="space-y-2">
              <select value={selectedCol.dateFormat || 'DD/MM/YYYY'} className={input}
                onChange={(e) => updateColumn(selectedCol.id, { dateFormat: e.target.value })}>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/YYYY">MM/YYYY</option>
                <option value="YYYY">YYYY</option>
              </select>
              <label className="flex items-center gap-2 text-[10px] text-slate-600 cursor-pointer">
                <input type="checkbox" checked={selectedCol.dateHideSeparator || false}
                  onChange={(e) => updateColumn(selectedCol.id, { dateHideSeparator: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600" />
                Hide the &quot;/&quot; separator
              </label>
              {(selectedCol.dateFormat || 'DD/MM/YYYY') !== 'YYYY' && (
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500">Day / month / year spacing</label>
                  <input type="number" min="0" step="1" value={selectedCol.dateSegmentSpacing || 0} className={input}
                    onChange={(e) => updateColumn(selectedCol.id, { dateSegmentSpacing: Number(e.target.value) || 0 })} />
                </div>
              )}
            </div>
          )}

          {/* Options */}
          {(selectedCol.type === 'radio' || selectedCol.type === 'checkbox' || selectedCol.type === 'select') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[9px] text-slate-500">Options</label>
                <button
                  onClick={() => updateColumn(selectedCol.id, {
                    options: [...(selectedCol.options || []), {
                      id: generateUUID(), x: 0, y: 0, width: 0, height: 0,
                      value: `Option ${(selectedCol.options?.length || 0) + 1}`,
                    } as FieldOption],
                  })}
                  className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-0.5"><Plus size={10} /> Add</button>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {(selectedCol.options || []).map((opt) => (
                  <div key={opt.id} className="flex items-center gap-1">
                    <input type="text" value={opt.value} placeholder="Value" className={input}
                      onChange={(e) => updateColumn(selectedCol.id, {
                        options: selectedCol.options?.map((o) => o.id === opt.id ? { ...o, value: e.target.value } : o),
                      })} />
                    <input type="text" value={opt.label || ''} placeholder="Label" className={input}
                      onChange={(e) => updateColumn(selectedCol.id, {
                        options: selectedCol.options?.map((o) => o.id === opt.id ? { ...o, label: e.target.value || undefined } : o),
                      })} />
                    <button onClick={() => updateColumn(selectedCol.id, {
                      options: selectedCol.options?.filter((o) => o.id !== opt.id),
                    })} className="p-1 text-slate-400 hover:text-red-500 shrink-0"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mark style */}
          {(selectedCol.type === 'radio' || selectedCol.type === 'checkbox') && (
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Tick style</label>
              <div className="grid grid-cols-6 gap-1">
                {MARK_STYLES.map((mark) => (
                  <button key={mark.value} onClick={() => updateColumn(selectedCol.id, { markStyle: mark.value })}
                    className={`py-1 rounded border text-sm ${
                      (selectedCol.markStyle || 'checkmark') === mark.value
                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}>{mark.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Colour */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Text colour</label>
              <div className="flex items-center gap-1">
                <input type="color" value={selectedCol.color || '#000000'} className="w-6 h-6 rounded border-0 p-0 cursor-pointer"
                  onChange={(e) => updateColumn(selectedCol.id, { color: e.target.value })} />
                <button onClick={() => updateColumn(selectedCol.id, { color: undefined })}
                  className="text-[9px] text-slate-400 hover:text-red-500">Reset</button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Padding</label>
              <input type="number" min="0" value={selectedCol.padding ?? ''} placeholder="Default" className={input}
                onChange={(e) => updateColumn(selectedCol.id, { padding: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
          </div>
        </div>
      )}

      {/* ---- Appearance -------------------------------------------------- */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Palette size={13} className="text-slate-500" />
          <span className={label}>Appearance</span>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
          <input type="checkbox" checked={field.showGrid || false}
            onChange={(e) => onUpdateField(field.id, { showGrid: e.target.checked })}
            className="rounded border-slate-300 text-blue-600" />
          Draw grid lines on the PDF
        </label>

        {field.showGrid && (
          <div className="grid grid-cols-2 gap-2 pl-5">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Line colour</label>
              <input type="color" value={field.gridColor || '#000000'} className="w-6 h-6 rounded border-0 p-0 cursor-pointer"
                onChange={(e) => onUpdateField(field.id, { gridColor: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500">Thickness</label>
              <input type="number" min="0.1" step="0.1" value={field.gridWidth ?? 0.5} className={input}
                onChange={(e) => onUpdateField(field.id, { gridWidth: Number(e.target.value) })} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[9px] text-slate-500">Cell padding</label>
            <input type="number" min="0" max="20" value={field.cellPadding ?? 2} className={input}
              onChange={(e) => onUpdateField(field.id, { cellPadding: Number(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-slate-500">Row gap</label>
            <input type="number" min="0" max="20" value={field.cellGap ?? 0} className={input}
              onChange={(e) => onUpdateField(field.id, { cellGap: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      {columns.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-4 text-slate-400">
          <TableIcon size={20} />
          <p className="text-[10px]">No columns yet</p>
          <button onClick={() => addColumn('text')} className="text-[10px] text-blue-600 hover:underline">Add the first one</button>
        </div>
      )}
    </div>
  );
};

export default TableBuilder;
