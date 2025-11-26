import React, { useState, useRef, useEffect } from 'react';
import { FormField, TableColumn, TableCell } from '../types';
import { Plus, Minus, Check, ChevronDown } from 'lucide-react';

interface InlineTableEditorProps {
  field: FormField;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  customRows?: FormField[];
}

const InlineTableEditor: React.FC<InlineTableEditorProps> = ({ field, onUpdateField, customRows = [] }) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  const getTableData = (): string[][] => {
    try {
      const data = JSON.parse(field.value || '[]');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const data = getTableData();
    while (data.length <= rowIdx) data.push([]);
    while (data[rowIdx].length <= colIdx) data[rowIdx].push('');
    data[rowIdx][colIdx] = value;
    onUpdateField(field.id, { value: JSON.stringify(data) });
  };

  const addRow = () => {
    const currentRows = field.filledRows || 1;
    const maxRows = field.maxRows || 10;
    if (currentRows < maxRows) {
      onUpdateField(field.id, { filledRows: currentRows + 1 });
    }
  };

  const removeRow = () => {
    const currentRows = field.filledRows || 1;
    if (currentRows > 1) {
      const data = getTableData();
      data.pop();
      onUpdateField(field.id, { 
        filledRows: currentRows - 1,
        value: JSON.stringify(data)
      });
    }
  };

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [editingCell]);

  // Helper to render cell input - defined BEFORE any early returns
  const renderCellInput = (
    colOrCell: TableColumn | TableCell,
    value: string,
    rowIdx: number,
    colIdx: number,
    isEditing: boolean
  ) => {
    const type = colOrCell.type;
    const options = colOrCell.options || [];

    if (type === 'checkbox') {
      return (
        <button
          onClick={() => updateCell(rowIdx, colIdx, value === 'true' ? 'false' : 'true')}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            value === 'true'
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-slate-300 hover:border-blue-400'
          }`}
        >
          {value === 'true' && <Check size={14} />}
        </button>
      );
    }

    if (type === 'select') {
      return (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white appearance-none cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none pr-8"
          >
            <option value="">Select...</option>
            {options.filter(opt => opt.trim()).map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      );
    }

    if (type === 'date') {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
      );
    }

    // Text or number input
    return (
      <input
        ref={isEditing ? inputRef as React.RefObject<HTMLInputElement> : undefined}
        type={type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
        onFocus={() => setEditingCell({ row: rowIdx, col: colIdx })}
        onBlur={() => setEditingCell(null)}
        placeholder={`Enter ${(colOrCell as TableColumn).header || 'value'}...`}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
      />
    );
  };

  // Render for custom rows
  if (customRows.length > 0) {
    const sortedRows = [...customRows].sort((a, b) => (a.rowIndex || 0) - (b.rowIndex || 0));
    const visibleCount = Math.min(field.filledRows || 1, sortedRows.length);
    const visibleRows = sortedRows.slice(0, visibleCount);
    const tableData = getTableData();

    return (
      <div className="space-y-3">
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
          {visibleRows.map((row) => {
            const rIdx = row.rowIndex || 0;
            return (
              <div key={row.id} className="border-b border-slate-100 last:border-0">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">Row {rIdx + 1}</span>
                </div>
                <div className="p-3 space-y-3">
                  {(row.cells || []).map((cell, cIdx) => {
                    const cellValue = tableData[rIdx]?.[cIdx] || '';
                    const isEditing = editingCell?.row === rIdx && editingCell?.col === cIdx;

                    return (
                      <div key={cell.id} className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">
                          {cell.header || `Field ${cIdx + 1}`}
                        </label>
                        {renderCellInput(cell, cellValue, rIdx, cIdx, isEditing)}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Row controls */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {visibleCount} of {sortedRows.length} rows
          </span>
          <div className="flex gap-2">
            {visibleCount > 1 && (
              <button
                onClick={removeRow}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
              >
                <Minus size={14} /> Remove Row
              </button>
            )}
            {visibleCount < sortedRows.length && (
              <button
                onClick={addRow}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <Plus size={14} /> Add Row
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render for standard table columns
  const columns = field.columns || [];
  const rowsToRender = field.filledRows || 1;
  const maxRows = field.maxRows || 10;
  const tableData = getTableData();

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Header */}
        {field.showHeaders && columns.length > 0 && (
          <div className="flex bg-slate-100 border-b border-slate-200">
            {columns.map((col) => (
              <div
                key={col.id}
                className="px-3 py-2 text-xs font-semibold text-slate-600 border-r border-slate-200 last:border-r-0"
                style={{ width: `${col.width}%` }}
              >
                {col.header}
              </div>
            ))}
          </div>
        )}

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: rowsToRender }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex hover:bg-slate-50 transition-colors">
              {columns.map((col, colIdx) => {
                const cellValue = tableData[rowIdx]?.[colIdx] || '';
                const isEditing = editingCell?.row === rowIdx && editingCell?.col === colIdx;

                return (
                  <div
                    key={col.id}
                    className="px-2 py-2 border-r border-slate-100 last:border-r-0"
                    style={{ width: `${col.width}%` }}
                  >
                    {col.type === 'checkbox' ? (
                      <div className="flex justify-center">
                        <button
                          onClick={() => updateCell(rowIdx, colIdx, cellValue === 'true' ? 'false' : 'true')}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            cellValue === 'true'
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-slate-300 hover:border-blue-400'
                          }`}
                        >
                          {cellValue === 'true' && <Check size={12} />}
                        </button>
                      </div>
                    ) : col.type === 'select' ? (
                      <select
                        value={cellValue}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-transparent rounded bg-transparent hover:border-slate-200 focus:border-blue-400 focus:bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="">-</option>
                        {(col.options || []).filter(opt => opt.trim()).map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : col.type === 'date' ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-transparent rounded bg-transparent hover:border-slate-200 focus:border-blue-400 focus:bg-white focus:outline-none"
                      />
                    ) : (
                      <input
                        ref={isEditing ? inputRef as React.RefObject<HTMLInputElement> : undefined}
                        type={col.type === 'number' ? 'number' : 'text'}
                        value={cellValue}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        onFocus={() => setEditingCell({ row: rowIdx, col: colIdx })}
                        onBlur={() => setEditingCell(null)}
                        placeholder="..."
                        className="w-full px-2 py-1 text-xs border border-transparent rounded bg-transparent hover:border-slate-200 focus:border-blue-400 focus:bg-white focus:outline-none transition-colors"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Row controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {rowsToRender} of {maxRows} rows
        </span>
        <div className="flex gap-2">
          {rowsToRender > 1 && (
            <button
              onClick={removeRow}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
            >
              <Minus size={14} /> Remove
            </button>
          )}
          {rowsToRender < maxRows && (
            <button
              onClick={addRow}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <Plus size={14} /> Add Row
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InlineTableEditor;
