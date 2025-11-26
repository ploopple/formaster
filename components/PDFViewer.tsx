'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FormField, AppMode, FieldOption } from '../types';
import { Trash2, Rows, Eye, EyeOff } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - use CDN for reliability
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { isFieldVisible } from '../services/formLogic';

interface PDFViewerProps {
  file: any; // File or Blob
  mode: AppMode;
  fields: FormField[];
  selectedFieldId: string | null;
  onFieldAdd: (field: FormField) => void;
  onFieldUpdate: (id: string, updates: Partial<FormField>) => void;
  onFieldSelect: (id: string | null) => void;
  onFieldDelete: (id: string) => void;

  onOpenSignature?: (fieldId: string) => void;
  onPageDimensionsChange?: (width: number, height: number) => void;
}

const resizeHandles = [
  { h: 'nw', c: 'cursor-nw-resize', pos: '-top-1.5 -left-1.5' },
  { h: 'n', c: 'cursor-n-resize', pos: '-top-1.5 left-1/2 -translate-x-1/2' },
  { h: 'ne', c: 'cursor-ne-resize', pos: '-top-1.5 -right-1.5' },
  { h: 'w', c: 'cursor-w-resize', pos: 'top-1/2 -translate-y-1/2 -left-1.5' },
  { h: 'e', c: 'cursor-e-resize', pos: 'top-1/2 -translate-y-1/2 -right-1.5' },
  { h: 'sw', c: 'cursor-sw-resize', pos: '-bottom-1.5 -left-1.5' },
  { h: 's', c: 'cursor-s-resize', pos: '-bottom-1.5 left-1/2 -translate-x-1/2' },
  { h: 'se', c: 'cursor-se-resize', pos: '-bottom-1.5 -right-1.5' },
];

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  mode,
  fields,
  selectedFieldId,
  onFieldAdd,
  onFieldUpdate,
  onFieldSelect,
  onFieldDelete,
  onOpenSignature,
  onPageDimensionsChange
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);
  
  // Scroll preservation
  const scrollTopRef = useRef(0);

  // Drawing New Field State
  const [drawingState, setDrawingState] = useState<{
    isDrawing: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Moving/Resizing Existing Field State
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    isResizing: boolean;
    fieldId: string;
    optionId: string | null; 
    resizeHandle: string | null; 
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    startWidth: number;
    startHeight: number;
    containerWidth: number;
    containerHeight: number;
  } | null>(null);

  useEffect(() => { setActiveOptionId(null); }, [selectedFieldId]);

  useEffect(() => {
    const updateWidth = () => { if (containerRef.current) setContainerWidth(containerRef.current.clientWidth - 32); };
    window.addEventListener('resize', updateWidth);
    setTimeout(updateWidth, 100);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => { if (window.innerWidth < 768) setScale(0.6); }, []);

  // --- CANVAS VISUAL RENDERING LAYER (Editor Mode Only) ---
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas || !containerWidth) return;
    
    const pdfPage = containerRef.current?.querySelector('.react-pdf__Page');
    if (!pdfPage) return;
    
    const rect = pdfPage.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Notify parent of page dimensions
    if (onPageDimensionsChange) {
      onPageDimensionsChange(rect.width, rect.height);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only draw editor overlays in EDITOR mode
    if (mode === AppMode.EDITOR) {
      const pageFields = fields.filter(f => f.page === pageNumber);

      pageFields.forEach(field => {
          if (field.type === 'table-row') return;
          if (field.hidden) return; // Skip drawing hidden fields

          const drawFieldBox = (xPct: number, yPct: number, wPct: number, hPct: number, isOption: boolean = false) => {
              const x = (xPct / 100) * canvas.width;
              const y = (yPct / 100) * canvas.height;
              const w = (wPct / 100) * canvas.width;
              const h = (hPct / 100) * canvas.height;

              // Draw semi-transparent overlay to show field boundaries
              ctx.strokeStyle = selectedFieldId === field.id ? '#3b82f6' : '#93c5fd';
              ctx.lineWidth = selectedFieldId === field.id ? 2 : 1;
              ctx.setLineDash([4, 4]);
              ctx.strokeRect(x, y, w, h);
              ctx.setLineDash([]);
              
              // Draw small indicator for radio/checkbox options
              if (isOption) {
                  ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
                  if (field.type === 'radio') {
                      ctx.beginPath();
                      ctx.arc(x + w/2, y + h/2, Math.min(w, h)/2, 0, 2 * Math.PI);
                      ctx.fill();
                  } else {
                      ctx.fillRect(x, y, w, h);
                  }
              }
          };

          if ((field.type === 'radio' || field.type === 'checkbox') && field.options) {
              field.options.forEach(opt => {
                  drawFieldBox(opt.x, opt.y, opt.width, opt.height, true);
              });
          } else {
              drawFieldBox(field.x, field.y, field.width, field.height);
          }
      });
    }

    // Draw the new field being created
    if (drawingState?.isDrawing) {
        const x = Math.min(drawingState.startX, drawingState.currentX);
        const y = Math.min(drawingState.startY, drawingState.currentY);
        const w = Math.abs(drawingState.currentX - drawingState.startX);
        const h = Math.abs(drawingState.currentY - drawingState.startY);

        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;

        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; 
        ctx.fillRect(canvasX, canvasY, w, h);
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 1;
        ctx.strokeRect(canvasX, canvasY, w, h);
    }

  }, [fields, pageNumber, scale, containerWidth, mode, drawingState, selectedFieldId]);


  // --- Interaction Logic ---
  useEffect(() => {
    if (!dragState && !drawingState) return;
    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault(); 
      const overlay = containerRef.current?.querySelector('.react-pdf__Page');
      const rect = overlay?.getBoundingClientRect();
      if (!rect) return;

      if (drawingState?.isDrawing) {
        setDrawingState(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
        return;
      }
      if (dragState) {
          const { startX, startY, startLeft, startTop, startWidth, startHeight, containerWidth, containerHeight, fieldId, optionId, resizeHandle } = dragState;
          const deltaXPixels = e.clientX - startX;
          const deltaYPixels = e.clientY - startY;
          const deltaXPercent = (deltaXPixels / containerWidth) * 100;
          const deltaYPercent = (deltaYPixels / containerHeight) * 100;
          const field = fields.find(f => f.id === fieldId);
          if (!field) return;

          let newX = startLeft, newY = startTop, newWidth = startWidth, newHeight = startHeight;
          if (dragState.isDragging) {
            newX = Math.max(0, Math.min(100 - startWidth, startLeft + deltaXPercent));
            newY = Math.max(0, Math.min(100 - startHeight, startTop + deltaYPercent));
          } else if (dragState.isResizing && resizeHandle) {
            if (resizeHandle.includes('e')) newWidth = Math.max(1, startWidth + deltaXPercent);
            if (resizeHandle.includes('s')) newHeight = Math.max(1, startHeight + deltaYPercent);
            if (resizeHandle.includes('w')) { 
                const intendedWidth = startWidth - deltaXPercent;
                if (intendedWidth > 1) {
                    newWidth = intendedWidth;
                    newX = (startLeft + startWidth) - newWidth; 
                }
            }
            if (resizeHandle.includes('n')) { 
                const intendedHeight = startHeight - deltaYPercent;
                if (intendedHeight > 1) {
                    newHeight = intendedHeight;
                    newY = (startTop + startHeight) - newHeight; 
                }
            }
          }
          if (optionId) {
            const newOptions = (field.options || []).map(opt => opt.id === optionId ? { ...opt, x: dragState.isDragging || resizeHandle?.includes('w') ? newX : opt.x, y: dragState.isDragging || resizeHandle?.includes('n') ? newY : opt.y, width: dragState.isResizing ? newWidth : opt.width, height: dragState.isResizing ? newHeight : opt.height } : opt);
            onFieldUpdate(fieldId, { options: newOptions });
          } else {
            const updates: Partial<FormField> = {};
            if (dragState.isDragging || resizeHandle?.includes('w')) updates.x = newX;
            if (dragState.isDragging || resizeHandle?.includes('n')) updates.y = newY;
            if (dragState.isResizing) { updates.width = newWidth; updates.height = newHeight; }
            onFieldUpdate(fieldId, updates);
          }
      }
    };
    const handlePointerUp = (e: PointerEvent) => {
        if (drawingState?.isDrawing) {
            const overlay = containerRef.current?.querySelector('.react-pdf__Page');
            const rect = overlay?.getBoundingClientRect();
            if (rect) {
                const rawX1 = (drawingState.startX - rect.left) / rect.width * 100;
                const rawY1 = (drawingState.startY - rect.top) / rect.height * 100;
                const rawX2 = (e.clientX - rect.left) / rect.width * 100;
                const rawY2 = (e.clientY - rect.top) / rect.height * 100;
                const x = Math.max(0, Math.min(100, Math.min(rawX1, rawX2)));
                const y = Math.max(0, Math.min(100, Math.min(rawY1, rawY2)));
                const width = Math.min(100 - x, Math.abs(rawX2 - rawX1));
                const height = Math.min(100 - y, Math.abs(rawY2 - rawY1));
                if (width > 1 && height > 1) {
                     const newField: FormField = { 
                        id: crypto.randomUUID(), page: pageNumber, x, y, width, height, name: `Field ${fields.length + 1}`, value: '', previewText: '', type: 'text', fontSize: 12, letterSpacing: 0, options: [], backgroundColor: undefined, borderColor: undefined, borderWidth: 0, padding: 2
                    };
                    onFieldAdd(newField);
                    onFieldSelect(newField.id);
                }
            }
            setDrawingState(null);
        }
        setDragState(null);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp); };
  }, [dragState, drawingState, onFieldUpdate, fields, pageNumber, onFieldAdd, onFieldSelect]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
       setNumPages(numPages);
       // We can't restore scroll here reliably because page height isn't ready
  };
  
  const onPageRenderSuccess = () => {
      // Restore scroll after page renders to prevent jumping when PDF regenerates
      if (containerRef.current && scrollTopRef.current > 0) {
          containerRef.current.scrollTop = scrollTopRef.current;
      }
  };

  const handleBackgroundPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== AppMode.EDITOR) return;
    setDrawingState({ isDrawing: true, startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY });
    onFieldSelect(null);
  };

  const handleItemPointerDown = (e: React.PointerEvent, field: FormField, option: FieldOption | null) => {
    if (mode !== AppMode.EDITOR) return;
    e.stopPropagation();
    onFieldSelect(field.id);
    setActiveOptionId(option ? option.id : null);
    const overlay = containerRef.current?.querySelector('.react-pdf__Page'); 
    const containerRect = overlay?.getBoundingClientRect() || e.currentTarget.parentElement?.getBoundingClientRect();
    if (!containerRect) return;
    setDragState({
      isDragging: true, isResizing: false, fieldId: field.id, optionId: option ? option.id : null, resizeHandle: null,
      startX: e.clientX, startY: e.clientY, startLeft: option ? option.x : field.x, startTop: option ? option.y : field.y,
      startWidth: option ? option.width : field.width, startHeight: option ? option.height : field.height,
      containerWidth: containerRect.width, containerHeight: containerRect.height
    });
  };

  const handleResizeStart = (e: React.PointerEvent, field: FormField, option: FieldOption | null, handle: string) => {
    e.stopPropagation();
    const overlay = containerRef.current?.querySelector('.react-pdf__Page');
    const containerRect = overlay?.getBoundingClientRect();
    if (!containerRect) return;
    setDragState({
      isDragging: false, isResizing: true, fieldId: field.id, optionId: option ? option.id : null, resizeHandle: handle,
      startX: e.clientX, startY: e.clientY, startLeft: option ? option.x : field.x, startTop: option ? option.y : field.y,
      startWidth: option ? option.width : field.width, startHeight: option ? option.height : field.height,
      containerWidth: containerRect.width, containerHeight: containerRect.height
    });
  };

  const getTableData = (field: FormField): string[][] => {
      try { return JSON.parse(field.value || "[]"); } catch { return []; }
  };
  
  const updateTableCell = (field: FormField, rowIdx: number, colIdx: number, cellValue: string) => {
      const data = getTableData(field);
      if (!data[rowIdx]) data[rowIdx] = [];
      data[rowIdx][colIdx] = cellValue;
      onFieldUpdate(field.id, { value: JSON.stringify(data) });
  };

  const renderTableRow = (field: FormField) => {
     if (mode !== AppMode.EDITOR) return null;
     const isSelected = selectedFieldId === field.id;
     const isHidden = field.hidden;
     return (
         <div key={field.id} onPointerDown={(e) => handleItemPointerDown(e, field, null)} onClick={(e) => e.stopPropagation()} style={{ left: `${field.x}%`, top: `${field.y}%`, width: `${field.width}%`, height: `${field.height}%` }} className={`absolute z-20 ${isHidden ? '' : 'border border-dashed border-purple-400 bg-purple-50/10'} cursor-move group ${isSelected ? 'ring-1 ring-purple-500' : ''}`}>
             <div className="absolute -top-5 left-0 text-[10px] bg-purple-500 text-white px-1 rounded flex items-center gap-1 shadow-sm pointer-events-none">Row {field.rowIndex !== undefined ? field.rowIndex + 1 : '?'} {isHidden && '(Hidden)'}</div>
             {!isHidden && (field.cells || []).map((cell, idx) => (
                 <div key={cell.id} className={`absolute border-r border-slate-600/30 flex items-center justify-center text-[9px] font-mono text-slate-500`} style={{ left: `${cell.x}%`, top: `${cell.y}%`, width: `${cell.width}%`, height: `${cell.height}%` }}>{cell.header || `C${idx + 1}`}</div>
             ))}
             {isSelected && (
                <>
                    {!isHidden && resizeHandles.map(({ h, c, pos }) => (<div key={h} onPointerDown={(e) => handleResizeStart(e, field, null, h)} className={`absolute w-2.5 h-2.5 bg-white border border-purple-600 z-30 shadow-sm ${c} ${pos}`} />))}
                    <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onFieldUpdate(field.id, { hidden: !field.hidden }); }} className="absolute -top-8 -right-10 bg-slate-500 text-white p-1 rounded shadow hover:bg-slate-600 cursor-pointer z-40">{field.hidden ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                </>
             )}
         </div>
     )
  };

  const renderTable = (field: FormField) => {
    const customRows = fields.filter(f => f.parentFieldId === field.id && f.type === 'table-row');
    
    // In FILL mode with custom rows, make cells clickable for editing
    if (customRows.length > 0 && mode === AppMode.FILL) {
          const sortedRows = customRows.sort((a, b) => (a.rowIndex || 0) - (b.rowIndex || 0));
          const visibleCount = Math.min(field.filledRows || 1, sortedRows.length);
          const visibleRows = sortedRows.slice(0, visibleCount);
          return (
              <React.Fragment key={field.id}>
                {visibleRows.map((row) => {
                    const rIdx = row.rowIndex || 0;
                    return (
                        <div key={row.id} className="absolute w-full h-full pointer-events-none">
                            {(row.cells || []).map((cell, cIdx) => {
                                const tableData = getTableData(field);
                                const cellValue = tableData[rIdx]?.[cIdx] || '';
                                return (
                                    <div 
                                        key={cell.id} 
                                        className="absolute z-10 pointer-events-auto cursor-pointer" 
                                        style={{ 
                                            left: `${row.x + (cell.x / 100 * row.width)}%`, 
                                            top: `${row.y + (cell.y / 100 * row.height)}%`, 
                                            width: `${(cell.width / 100 * row.width)}%`, 
                                            height: `${(cell.height / 100 * row.height)}%` 
                                        }}
                                        onClick={() => {
                                            if (cell.type === 'checkbox') {
                                                updateTableCell(field, rIdx, cIdx, cellValue === 'true' ? 'false' : 'true');
                                            } else {
                                                const newValue = prompt(`Enter value for ${cell.header || `Cell ${cIdx + 1}`}:`, cellValue);
                                                if (newValue !== null) {
                                                    updateTableCell(field, rIdx, cIdx, newValue);
                                                }
                                            }
                                        }}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
              </React.Fragment>
          );
    }
    
    const isSelected = selectedFieldId === field.id;
    const showHandles = mode === AppMode.EDITOR && isSelected;
    const isHidden = field.hidden;
    
    return (
        <div 
            key={field.id} 
            onPointerDown={(e) => {
                if (mode === AppMode.EDITOR) {
                    handleItemPointerDown(e, field, null);
                }
            }} 
            onClick={(e) => {
                e.stopPropagation();
                if (mode === AppMode.FILL) {
                    // Allow editing table data via prompt
                    alert('Click on individual cells to edit table data');
                }
            }} 
            style={{ 
                left: `${field.x}%`, 
                top: `${field.y}%`, 
                width: `${field.width}%`, 
                height: `${field.height}%`, 
                touchAction: 'none'
            }} 
            className={`absolute transition-colors duration-0 group ${mode === AppMode.EDITOR ? `${isHidden ? '' : 'border-2'} cursor-move ${isSelected ? 'border-blue-500 bg-blue-500/5 z-20' : isHidden ? 'z-10' : 'border-blue-300 bg-blue-100/30 hover:bg-blue-100/50 z-10'}` : 'z-10 cursor-pointer'}`}
        >
            {mode === AppMode.EDITOR && (
                <>
                    {!isHidden && <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"><Rows /></div>}
                    <div className="absolute -top-6 left-0 text-white text-[10px] px-1.5 py-0.5 rounded shadow bg-blue-600 pointer-events-none z-20">{field.name} {isHidden && '(Hidden)'}</div>
                    {showHandles && (
                        <>
                            {!isHidden && resizeHandles.map(({ h, c, pos }) => (<div key={h} onPointerDown={(e) => handleResizeStart(e, field, null, h)} className={`absolute w-3 h-3 bg-white border border-blue-600 z-30 shadow-sm ${c} ${pos}`} />))}
                            <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onFieldUpdate(field.id, { hidden: !field.hidden }); }} className="absolute -top-8 -right-10 bg-slate-500 text-white p-1 rounded shadow hover:bg-slate-600 cursor-pointer z-40">{field.hidden ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                            <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onFieldDelete(field.id); }} className="absolute -top-8 -right-2 bg-red-500 text-white p-1 rounded shadow hover:bg-red-600 cursor-pointer z-40"><Trash2 size={12} /></button>
                        </>
                    )}
                </>
            )}
        </div>
    );
  };

  const renderBox = (field: FormField, option: FieldOption | null) => {
    if (field.type === 'table') return renderTable(field);
    if (field.type === 'table-row') return renderTableRow(field);

    const isSelected = selectedFieldId === field.id;
    const isOption = !!option;
    const boxId = isOption ? option!.id : field.id;
    const x = isOption ? option!.x : field.x;
    const y = isOption ? option!.y : field.y;
    const w = isOption ? option!.width : field.width;
    const h = isOption ? option!.height : field.height;
    const isHidden = field.hidden;
    
    const showHandles = mode === AppMode.EDITOR && isSelected && (!isOption || activeOptionId === boxId);

    const boxStyle: React.CSSProperties = {
        left: `${x}%`, 
        top: `${y}%`, 
        width: `${w}%`, 
        height: `${h}%`,
        touchAction: 'none',
        position: 'absolute',
        boxSizing: 'border-box',
        background: 'transparent',
        border: 'none',
    };

    let wrapperClass = `group transition-colors duration-0 z-10 `;
    if (mode === AppMode.EDITOR) {
        wrapperClass += 'cursor-move ';
        if (isSelected) {
            wrapperClass += 'z-20 '; 
        }
    } else {
        // In FILL mode, make fields clickable for interaction
        wrapperClass += 'cursor-pointer ';
    }

    return (
        <React.Fragment key={boxId}>
        <div
            onPointerDown={(e) => {
                if (mode === AppMode.EDITOR) {
                    handleItemPointerDown(e, field, option);
                }
            }}
            onClick={(e) => {
                 e.stopPropagation();
                 if (mode === AppMode.FILL) {
                     if (isOption) {
                         if (field.type === 'radio') {
                             onFieldUpdate(field.id, { value: option!.value });
                         } else if (field.type === 'checkbox') {
                             const current = field.value ? field.value.split(',') : [];
                             onFieldUpdate(field.id, { value: current.includes(option!.value) ? current.filter(v => v !== option!.value).join(',') : [...current, option!.value].join(',') });
                         }
                     } else if (field.type === 'signature') {
                         onOpenSignature?.(field.id);
                     } else if (field.type === 'text' || field.type === 'number' || field.type === 'textarea' || field.type === 'date' || field.type === 'select') {
                         // Prompt for text input
                         const newValue = prompt(`Enter value for ${field.name}:`, field.value || '');
                         if (newValue !== null) {
                             // Apply maxLength validation
                             const finalValue = field.maxLength && newValue.length > field.maxLength 
                                 ? newValue.substring(0, field.maxLength) 
                                 : newValue;
                             onFieldUpdate(field.id, { value: finalValue });
                         }
                     }
                 }
            }}
            style={boxStyle}
            className={wrapperClass}
        >
            {mode === AppMode.EDITOR && isSelected && (
                <>
                    {(!isOption || field.options?.[0]?.id === option?.id) && (
                        <div className="absolute -top-5 left-0 text-white text-[9px] px-1 rounded shadow pointer-events-none z-30 whitespace-nowrap bg-blue-600">
                            {field.name} {isHidden && '(Hidden)'}
                        </div>
                    )}
                    {showHandles && !isHidden && resizeHandles.map(({ h, c, pos }) => (
                        <div key={h} onPointerDown={(e) => handleResizeStart(e, field, option, h)} className={`absolute w-2.5 h-2.5 bg-white border border-blue-600 z-30 shadow-sm ${c} ${pos}`} />
                    ))}
                    {showHandles && (!isOption || (field.options?.length || 0) > 1) && (
                         <>
                             <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onFieldUpdate(field.id, { hidden: !field.hidden }); }} className="absolute -top-7 -right-10 bg-slate-500 text-white p-1 rounded shadow hover:bg-slate-600 cursor-pointer z-40">{field.hidden ? <EyeOff size={10} /> : <Eye size={10} />}</button>
                             <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); isOption ? onFieldUpdate(field.id, { options: (field.options||[]).filter(o => o.id !== option!.id) }) : onFieldDelete(field.id); }} className="absolute -top-7 -right-2 bg-red-500 text-white p-1 rounded shadow cursor-pointer z-40 hover:bg-red-600"><Trash2 size={10} /></button>
                         </>
                    )}
                </>
            )}
        </div>
        </React.Fragment>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      <div className="h-14 md:h-12 bg-white border-b border-slate-200 flex items-center justify-between px-2 md:px-4 shrink-0 z-10 overflow-x-auto gap-2">
        <div className="flex items-center space-x-2 md:space-x-4">
          <button disabled={pageNumber <= 1} onClick={() => setPageNumber(p => p - 1)} className="text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 disabled:opacity-50">Previous</button>
          <span className="text-xs md:text-sm text-slate-500">Page {pageNumber} of {numPages}</span>
          <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(p => p + 1)} className="text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 disabled:opacity-50">Next</button>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2"><button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 text-sm">-</button><span className="text-xs font-mono w-8 md:w-12 text-center">{Math.round(scale * 100)}%</span><button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 text-sm">+</button></div>
      </div>
      <div 
        className="flex-1 overflow-auto p-4 md:p-8 flex justify-center relative select-none" 
        ref={containerRef}
        onScroll={(e) => scrollTopRef.current = e.currentTarget.scrollTop}
      >
        {file && (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="shadow-xl">
            <div className="relative" onPointerDown={handleBackgroundPointerDown}>
              <Page pageNumber={pageNumber} width={containerWidth * scale} renderAnnotationLayer={false} renderTextLayer={false} onRenderSuccess={onPageRenderSuccess} />
              
              <canvas 
                ref={overlayCanvasRef} 
                className="absolute inset-0 pointer-events-none z-0"
              />

              <div className="absolute inset-0 z-10">
                {fields.filter(f => f.page === pageNumber).map(field => {
                    if (mode === AppMode.FILL && !isFieldVisible(field, fields)) return null;
                    if (mode === AppMode.FILL && field.type === 'table-row') return null;
                    if ((field.type === 'radio' || field.type === 'checkbox') && field.options?.length) return field.options.map(opt => renderBox(field, opt));
                    return renderBox(field, null);
                  })}
              </div>
            </div>
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;