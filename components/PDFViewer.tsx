'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from '../lib/pdfjs-config';
import { FormField, AppMode, FieldOption } from '../types';
import { Trash2, Rows, Eye, EyeOff, ZoomIn, ZoomOut, Maximize, Lock, ChevronLeft, ChevronRight, Grid3X3, X, Plus, Edit2 } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { isFieldVisible } from '../services/formLogic';
import { useI18n } from '../lib/i18n/I18nContext';
import { generateUUID } from '../lib/uuid';

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
  globalDrawColor?: string;
  onOpenSidebar?: () => void; // For mobile: open sidebar to edit field properties
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
  onPageDimensionsChange,
  globalDrawColor = '#000000',
  onOpenSidebar
}) => {
  const { t } = useI18n();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [containerHeight, setContainerHeight] = useState<number>(800);
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showMobileAddField, setShowMobileAddField] = useState<boolean>(false);
  const [doubleTapPosition, setDoubleTapPosition] = useState<{ x: number; y: number } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Minimap state
  const [showMinimap, setShowMinimap] = useState(false);
  const [pageThumbnails, setPageThumbnails] = useState<Map<number, string>>(new Map());
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);
  
  // Lazy loading - track which pages are near viewport
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));
  
  // Pan & Zoom state (transform-based, survives PDF re-renders)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  
  // Stable blob URL to prevent Document remounting on every blob change
  const [stableFileUrl, setStableFileUrl] = useState<string | null>(null);
  const previousUrlRef = useRef<string | null>(null);

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

  // Track file identity to detect when a new file is passed
  const fileIdRef = useRef<number>(0);
  
  // Create stable blob URL that updates without causing Document remount
  useEffect(() => {
    if (!file) {
      setStableFileUrl(null);
      return;
    }
    
    // Increment file ID to track this specific file instance
    const currentFileId = ++fileIdRef.current;
    
    // Clear the URL first to prevent using stale URL
    setStableFileUrl(null);
    
    // Revoke previous URL to prevent memory leaks
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
    
    // Create new URL for the blob after a small delay to ensure cleanup
    const timeoutId = setTimeout(() => {
      // Only proceed if this is still the current file
      if (fileIdRef.current !== currentFileId) return;
      
      const newUrl = URL.createObjectURL(file instanceof Blob ? file : new Blob([file]));
      previousUrlRef.current = newUrl;
      setStableFileUrl(newUrl);
    }, 50);
    
    return () => {
      clearTimeout(timeoutId);
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
        previousUrlRef.current = null;
      }
    };
  }, [file]);

  // Handle middle-mouse or space+drag panning
  const handlePanStart = useCallback((e: React.PointerEvent) => {
    // Middle mouse button (button 1) or holding space
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, offsetX: panOffset.x, offsetY: panOffset.y };
    }
  }, [panOffset]);

  const handlePanMove = useCallback((e: PointerEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setPanOffset({ x: panStartRef.current.offsetX + dx, y: panStartRef.current.offsetY + dy });
  }, [isPanning]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      window.addEventListener('pointermove', handlePanMove);
      window.addEventListener('pointerup', handlePanEnd);
      return () => {
        window.removeEventListener('pointermove', handlePanMove);
        window.removeEventListener('pointerup', handlePanEnd);
      };
    }
  }, [isPanning, handlePanMove, handlePanEnd]);

  // Mouse wheel to pan (like scrolling, but using transform)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Don't interfere with drawing/dragging
    if (drawingState || dragState) return;
    
    e.preventDefault();
    setPanOffset(prev => ({
      x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
      y: prev.y - (e.shiftKey ? 0 : e.deltaY)
    }));
  }, [drawingState, dragState]);

  // Reset pan when changing pages
  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    setPanOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const updateDimensions = () => { 
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 32);
        setContainerHeight(containerRef.current.clientHeight - 32);
      }
    };
    window.addEventListener('resize', updateDimensions);
    setTimeout(updateDimensions, 100);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => { 
    if (window.innerWidth < 768) setScale(0.5);
    else if (window.innerWidth < 1024) setScale(0.7);
  }, []);
  
  // Zoom control functions
  const zoomIn = useCallback(() => setScale(s => Math.min(3.0, s + 0.25)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(0.25, s - 0.25)), []);
  const fitToPage = useCallback(() => {
    if (!containerRef.current) return;
    const containerH = containerRef.current.clientHeight - 100;
    const containerW = containerRef.current.clientWidth - 100;
    // Estimate PDF page ratio (A4 ~= 0.707)
    const estimatedPageHeight = containerWidth * 1.414;
    const scaleH = containerH / estimatedPageHeight;
    const scaleW = containerW / containerWidth;
    setScale(Math.min(scaleH, scaleW, 1.5));
    setPanOffset({ x: 0, y: 0 });
  }, [containerWidth]);
  
  const fitToWidth = useCallback(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.clientWidth - 100;
    setScale(containerW / containerWidth);
    setPanOffset({ x: 0, y: 0 });
  }, [containerWidth]);
  
  // Generate thumbnails for minimap (lazy loaded)
  const generateThumbnails = useCallback(async () => {
    if (!stableFileUrl || loadingThumbnails || pageThumbnails.size === numPages) return;
    setLoadingThumbnails(true);
    
    try {
      const pdf = await pdfjs.getDocument(stableFileUrl).promise;
      const newThumbnails = new Map(pageThumbnails);
      
      for (let i = 1; i <= Math.min(numPages, 20); i++) { // Limit to 20 pages for performance
        if (newThumbnails.has(i)) continue;
        
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.15 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
          newThumbnails.set(i, canvas.toDataURL('image/jpeg', 0.6));
        }
      }
      
      setPageThumbnails(newThumbnails);
    } catch (error) {
      console.error('Failed to generate thumbnails:', error);
    }
    
    setLoadingThumbnails(false);
  }, [stableFileUrl, numPages, loadingThumbnails, pageThumbnails]);
  
  // Load thumbnails when minimap is opened
  useEffect(() => {
    if (showMinimap && numPages > 0) {
      generateThumbnails();
    }
  }, [showMinimap, numPages, generateThumbnails]);
  
  // Update visible pages for lazy loading
  useEffect(() => {
    const newVisible = new Set<number>();
    // Always include current page and adjacent pages
    newVisible.add(pageNumber);
    if (pageNumber > 1) newVisible.add(pageNumber - 1);
    if (pageNumber < numPages) newVisible.add(pageNumber + 1);
    setVisiblePages(newVisible);
  }, [pageNumber, numPages]);

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

          const drawFieldBox = (xPct: number, yPct: number, wPct: number, hPct: number, isOption: boolean = false, isAdditional: boolean = false) => {
              const x = (xPct / 100) * canvas.width;
              const y = (yPct / 100) * canvas.height;
              const w = (wPct / 100) * canvas.width;
              const h = (hPct / 100) * canvas.height;

              // Draw semi-transparent overlay to show field boundaries
              // Additional positions use a different color (purple)
              if (isAdditional) {
                  ctx.strokeStyle = selectedFieldId === field.id ? '#8b5cf6' : '#c4b5fd';
              } else {
                  ctx.strokeStyle = selectedFieldId === field.id ? '#3b82f6' : '#93c5fd';
              }
              ctx.lineWidth = selectedFieldId === field.id ? 2 : 1;
              ctx.setLineDash([4, 4]);
              ctx.strokeRect(x, y, w, h);
              ctx.setLineDash([]);
              
              // Draw a small color indicator in the corner showing the effective text color
              if (!isOption && !isAdditional) {
                  const effectiveColor = field.useGlobalColor !== false ? globalDrawColor : (field.color || '#000000');
                  if (effectiveColor && effectiveColor !== '#000000') {
                      const indicatorSize = 6;
                      ctx.fillStyle = effectiveColor;
                      ctx.fillRect(x + w - indicatorSize - 2, y + 2, indicatorSize, indicatorSize);
                      ctx.strokeStyle = '#ffffff';
                      ctx.lineWidth = 1;
                      ctx.strokeRect(x + w - indicatorSize - 2, y + 2, indicatorSize, indicatorSize);
                  }
              }
              
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
              
              // Draw indicator for additional positions
              if (isAdditional) {
                  ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
                  ctx.fillRect(x, y, w, h);
              }
          };

          // For checkbox with useFieldAsCheckbox, draw the field box itself
          if (field.type === 'checkbox' && field.useFieldAsCheckbox) {
              drawFieldBox(field.x, field.y, field.width, field.height);
          } else if ((field.type === 'radio' || field.type === 'checkbox') && field.options) {
              field.options.forEach(opt => {
                  drawFieldBox(opt.x, opt.y, opt.width, opt.height, true);
              });
          } else {
              drawFieldBox(field.x, field.y, field.width, field.height);
          }
      });
      
      // Also draw additional positions for fields that have them on this page
      fields.forEach(field => {
          if (field.type === 'table-row' || field.type === 'table' || field.type === 'radio' || field.type === 'checkbox') return;
          if (field.hidden) return;
          if (!field.additionalPositions) return;
          
          field.additionalPositions.forEach(pos => {
              if (pos.page !== pageNumber) return;
              
              const x = (pos.x / 100) * canvas.width;
              const y = (pos.y / 100) * canvas.height;
              const w = (pos.width / 100) * canvas.width;
              const h = (pos.height / 100) * canvas.height;
              
              // Draw with purple color to indicate additional position
              ctx.strokeStyle = selectedFieldId === field.id ? '#8b5cf6' : '#c4b5fd';
              ctx.lineWidth = selectedFieldId === field.id ? 2 : 1;
              ctx.setLineDash([4, 4]);
              ctx.strokeRect(x, y, w, h);
              ctx.setLineDash([]);
              ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
              ctx.fillRect(x, y, w, h);
          });
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
                        id: generateUUID(), page: pageNumber, x, y, width, height, name: `Field ${fields.length + 1}`, value: '', previewText: '', type: 'text', fontSize: 12, letterSpacing: 0, options: [], color: globalDrawColor, useGlobalColor: true, backgroundColor: undefined, borderColor: undefined, borderWidth: 0, padding: 2
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
  }, [dragState, drawingState, onFieldUpdate, fields, pageNumber, onFieldAdd, onFieldSelect, globalDrawColor]);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [workerReady, setWorkerReady] = useState(false);

  // Ensure worker is configured on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Force reconfigure to ensure it's set
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      console.log('PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
      // Small delay to ensure worker is ready
      setTimeout(() => setWorkerReady(true), 100);
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setLoadError('Failed to load PDF. Please try again.');
  };
  
  const onPageRenderSuccess = () => {
    // Pan offset is preserved via state, no scroll restoration needed
  };

  const handleBackgroundPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== AppMode.EDITOR) return;
    
    // On mobile, detect double-tap to create field
    if (isMobile) {
      // Don't process taps if the add field modal is already open
      if (showMobileAddField) {
        return;
      }
      
      const now = Date.now();
      const lastTap = lastTapRef.current;
      
      // Check if this is a double-tap (within 300ms and 50px of last tap)
      if (lastTap && 
          now - lastTap.time < 300 && 
          Math.abs(e.clientX - lastTap.x) < 50 && 
          Math.abs(e.clientY - lastTap.y) < 50) {
        // Double-tap detected! Get position relative to PDF page
        const overlay = containerRef.current?.querySelector('.react-pdf__Page');
        const rect = overlay?.getBoundingClientRect();
        if (rect) {
          const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
          const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
          setDoubleTapPosition({ x: Math.max(0, Math.min(85, xPercent)), y: Math.max(0, Math.min(90, yPercent)) });
          setShowMobileAddField(true);
          // Clear the tap ref to prevent any further double-tap detection
          lastTapRef.current = null;
        }
        lastTapRef.current = null;
      } else {
        // First tap - record it
        lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
        onFieldSelect(null);
      }
      return;
    }
    
    setDrawingState({ isDrawing: true, startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY });
    onFieldSelect(null);
  };

  const handleItemPointerDown = (e: React.PointerEvent, field: FormField, option: FieldOption | null) => {
    if (mode !== AppMode.EDITOR) return;
    e.stopPropagation();
    onFieldSelect(field.id);
    setActiveOptionId(option ? option.id : null);
    
    // Don't allow dragging locked fields
    if (field.locked) return;
    
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
    
    // Don't allow resizing locked fields
    if (field.locked) return;
    
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
     // Get columns from parent table
     const parentTable = fields.find(f => f.id === field.parentFieldId);
     const columns = parentTable?.columns || [];
     let currentX = 0;
     return (
         <div key={field.id} onPointerDown={(e) => handleItemPointerDown(e, field, null)} onClick={(e) => e.stopPropagation()} style={{ left: `${field.x}%`, top: `${field.y}%`, width: `${field.width}%`, height: `${field.height}%` }} className={`absolute z-20 ${isHidden ? '' : 'border border-dashed border-purple-400 bg-purple-50/10'} cursor-move group ${isSelected ? 'ring-1 ring-purple-500' : ''}`}>
             <div className="absolute -top-5 left-0 text-[10px] bg-purple-500 text-white px-1 rounded flex items-center gap-1 shadow-sm pointer-events-none">Row {field.rowIndex !== undefined ? field.rowIndex + 1 : '?'} {isHidden && '(Hidden)'}</div>
             {!isHidden && columns.map((col, idx) => {
                 const cellX = currentX;
                 currentX += col.width;
                 return (
                     <div key={col.id} className="absolute border-r border-slate-600/30 flex items-center justify-center text-[9px] font-mono text-slate-500" style={{ left: `${cellX}%`, top: '0%', width: `${col.width}%`, height: '100%' }}>{col.name || `C${idx + 1}`}</div>
                 );
             })}
             {isSelected && (
                <>
                    {!isHidden && resizeHandles.map(({ h, c, pos }) => (<div key={h} onPointerDown={(e) => handleResizeStart(e, field, null, h)} className={`absolute ${isMobile ? 'w-5 h-5' : 'w-2.5 h-2.5'} bg-white border-2 border-purple-600 z-30 shadow-md rounded-sm touch-manipulation ${c} ${pos}`} />))}
                    <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onFieldUpdate(field.id, { hidden: !field.hidden }); }} className={`absolute -top-10 md:-top-8 -right-12 md:-right-10 bg-slate-500 text-white ${isMobile ? 'p-2' : 'p-1'} rounded-lg shadow hover:bg-slate-600 active:bg-slate-700 cursor-pointer z-40 touch-manipulation`}>{field.hidden ? <EyeOff size={isMobile ? 16 : 12} /> : <Eye size={isMobile ? 16 : 12} />}</button>
                </>
             )}
         </div>
     )
  };

  const renderTable = (field: FormField) => {
    const customRows = fields.filter(f => f.parentFieldId === field.id && f.type === 'table-row');
    const columns = field.columns || [];
    
    // In FILL mode with custom rows, make cells clickable for editing
    if (customRows.length > 0 && mode === AppMode.FILL) {
          const sortedRows = customRows.sort((a, b) => (a.rowIndex || 0) - (b.rowIndex || 0));
          const visibleCount = Math.min(field.filledRows || 1, sortedRows.length);
          const visibleRows = sortedRows.slice(0, visibleCount);
          return (
              <React.Fragment key={field.id}>
                {visibleRows.map((row) => {
                    const rIdx = row.rowIndex || 0;
                    let currentX = 0;
                    return (
                        <div key={row.id} className="absolute w-full h-full pointer-events-none">
                            {columns.map((col, cIdx) => {
                                const tableData = getTableData(field);
                                const cellValue = tableData[rIdx]?.[cIdx] || '';
                                const cellX = currentX;
                                currentX += col.width;
                                return (
                                    <div 
                                        key={col.id} 
                                        className="absolute z-10 pointer-events-auto cursor-pointer" 
                                        style={{ 
                                            left: `${row.x + (cellX / 100 * row.width)}%`, 
                                            top: `${row.y}%`, 
                                            width: `${(col.width / 100 * row.width)}%`, 
                                            height: `${row.height}%` 
                                        }}
                                        onClick={() => {
                                            if (col.type === 'checkbox') {
                                                updateTableCell(field, rIdx, cIdx, cellValue === 'true' ? 'false' : 'true');
                                            } else {
                                                const newValue = prompt(`Enter value for ${col.name || `Cell ${cIdx + 1}`}:`, cellValue);
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
                            {!isHidden && resizeHandles.map(({ h, c, pos }) => (<div key={h} onPointerDown={(e) => handleResizeStart(e, field, null, h)} className={`absolute ${isMobile ? 'w-5 h-5' : 'w-3 h-3'} bg-white border-2 border-blue-600 z-30 shadow-md rounded-sm touch-manipulation ${c} ${pos}`} />))}
                            <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onFieldUpdate(field.id, { hidden: !field.hidden }); }} className={`absolute -top-10 md:-top-8 -right-12 md:-right-10 bg-slate-500 text-white ${isMobile ? 'p-2' : 'p-1'} rounded-lg shadow hover:bg-slate-600 active:bg-slate-700 cursor-pointer z-40 touch-manipulation`}>{field.hidden ? <EyeOff size={isMobile ? 16 : 12} /> : <Eye size={isMobile ? 16 : 12} />}</button>
                            <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onFieldDelete(field.id); }} className={`absolute -top-10 md:-top-8 -right-2 bg-red-500 text-white ${isMobile ? 'p-2' : 'p-1'} rounded-lg shadow hover:bg-red-600 active:bg-red-700 cursor-pointer z-40 touch-manipulation`}><Trash2 size={isMobile ? 16 : 12} /></button>
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
        touchAction: mode === AppMode.EDITOR ? 'none' : 'manipulation',
        position: 'absolute',
        boxSizing: 'border-box',
        background: 'transparent',
        border: 'none',
        // Ensure minimum touch target size on mobile
        minWidth: isMobile ? '44px' : undefined,
        minHeight: isMobile ? '44px' : undefined,
    };

    let wrapperClass = `group transition-colors duration-0 z-10 `;
    if (mode === AppMode.EDITOR) {
        wrapperClass += 'cursor-move ';
        if (isSelected) {
            wrapperClass += 'z-20 '; 
        }
    } else {
        // In FILL mode, make fields clickable for interaction with better touch feedback
        wrapperClass += 'cursor-pointer active:opacity-70 ';
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
                             // Use ||| as separator to handle option values containing commas
                             const separator = '|||';
                             const current = field.value ? field.value.split(separator).filter(v => v) : [];
                             const isCurrentlyChecked = current.includes(option!.value);
                             const next = isCurrentlyChecked ? current.filter(v => v !== option!.value) : [...current, option!.value];
                             onFieldUpdate(field.id, { value: next.join(separator) });
                         }
                     } else if (field.type === 'checkbox' && field.useFieldAsCheckbox) {
                         // Toggle checkbox when using field box as checkbox
                         const isChecked = field.value === 'true';
                         onFieldUpdate(field.id, { value: isChecked ? '' : 'true' });
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
                        <div className={`absolute ${isMobile ? '-top-7' : '-top-5'} left-0 text-white ${isMobile ? 'text-xs px-2 py-0.5' : 'text-[9px] px-1'} rounded shadow pointer-events-none z-30 whitespace-nowrap flex items-center gap-1 ${field.locked ? 'bg-amber-500' : 'bg-blue-600'}`}>
                            {field.locked && <Lock size={isMobile ? 12 : 10} />}
                            {(() => {
                                const effectiveColor = field.useGlobalColor !== false ? globalDrawColor : (field.color || '#000000');
                                return effectiveColor && effectiveColor !== '#000000' ? (
                                    <span className={`${isMobile ? 'w-3 h-3' : 'w-2 h-2'} rounded-full border border-white/50`} style={{ backgroundColor: effectiveColor }} />
                                ) : null;
                            })()}
                            {field.name} {isHidden && '(Hidden)'} {field.locked && '🔒'}
                        </div>
                    )}
                    {/* Mobile drag hint */}
                    {isMobile && !isOption && !field.locked && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shadow-sm pointer-events-none z-30 whitespace-nowrap border border-blue-200">
                            Drag to move • Corners to resize
                        </div>
                    )}
                    {showHandles && !isHidden && resizeHandles.map(({ h, c, pos }) => (
                        <div key={h} onPointerDown={(e) => handleResizeStart(e, field, option, h)} className={`absolute ${isMobile ? 'w-5 h-5' : 'w-2.5 h-2.5'} bg-white border-2 border-blue-600 z-30 shadow-md rounded-sm touch-manipulation ${c} ${pos}`} />
                    ))}
                    {showHandles && (!isOption || (field.options?.length || 0) > 1) && (
                         <>
                             <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onFieldUpdate(field.id, { hidden: !field.hidden }); }} className={`absolute ${isMobile ? '-top-9 -right-12 p-2' : '-top-7 -right-10 p-1'} bg-slate-500 text-white rounded-lg shadow hover:bg-slate-600 active:bg-slate-700 cursor-pointer z-40 touch-manipulation`}>{field.hidden ? <EyeOff size={isMobile ? 14 : 10} /> : <Eye size={isMobile ? 14 : 10} />}</button>
                             <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); isOption ? onFieldUpdate(field.id, { options: (field.options||[]).filter(o => o.id !== option!.id) }) : onFieldDelete(field.id); }} className={`absolute ${isMobile ? '-top-9 -right-2 p-2' : '-top-7 -right-2 p-1'} bg-red-500 text-white rounded-lg shadow cursor-pointer z-40 hover:bg-red-600 active:bg-red-700 touch-manipulation`}><Trash2 size={isMobile ? 14 : 10} /></button>
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
      {/* Enhanced Toolbar with Zoom Controls - Mobile Optimized */}
      <div className="h-auto min-h-12 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between px-2 md:px-4 py-2 shrink-0 z-10 gap-2">
        {/* Page Navigation */}
        <div className="flex items-center space-x-1">
          <button disabled={pageNumber <= 1} onClick={() => handlePageChange(pageNumber - 1)} className="p-2 md:p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent touch-manipulation" title={t.common.previous}>
            <ChevronLeft size={isMobile ? 22 : 18} />
          </button>
          <span className="text-sm md:text-sm text-slate-600 font-medium min-w-[60px] md:min-w-[80px] text-center">{pageNumber}/{numPages}</span>
          <button disabled={pageNumber >= numPages} onClick={() => handlePageChange(pageNumber + 1)} className="p-2 md:p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent touch-manipulation" title={t.common.next}>
            <ChevronRight size={isMobile ? 22 : 18} />
          </button>
          {/* Minimap toggle for multi-page PDFs */}
          {numPages > 1 && (
            <button 
              onClick={() => setShowMinimap(!showMinimap)} 
              className={`p-2 md:p-1.5 rounded-lg transition-colors touch-manipulation ${showMinimap ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100'}`}
              title={t.pdfViewer.minimap}
            >
              <Grid3X3 size={isMobile ? 20 : 18} />
            </button>
          )}
        </div>
        
        {/* Zoom Controls - Responsive */}
        <div className="flex items-center space-x-1 bg-slate-50 rounded-lg p-1">
          <button onClick={zoomOut} className="p-2 md:p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white active:bg-blue-50 rounded-lg transition-colors touch-manipulation" title={t.pdfViewer.zoomOut}>
            <ZoomOut size={isMobile ? 20 : 16} />
          </button>
          <span className="text-xs font-mono w-10 md:w-12 text-center text-slate-600">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="p-2 md:p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white active:bg-blue-50 rounded-lg transition-colors touch-manipulation" title={t.pdfViewer.zoomIn}>
            <ZoomIn size={isMobile ? 20 : 16} />
          </button>
          <div className="w-px h-4 bg-slate-300 mx-0.5 hidden sm:block" />
          <button onClick={fitToPage} className="p-2 md:px-2 md:py-1 text-xs text-slate-600 hover:text-blue-600 hover:bg-white active:bg-blue-50 rounded-lg transition-colors touch-manipulation hidden sm:flex items-center" title={t.pdfViewer.fitToPage}>
            <span className="hidden md:inline">Fit</span>
            <Maximize size={16} className="md:hidden" />
          </button>
          <button onClick={fitToWidth} className="px-2 py-1 text-xs text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors hidden lg:block" title={t.pdfViewer.fitToWidth}>
            Width
          </button>
          <button onClick={() => { setScale(1.0); setPanOffset({ x: 0, y: 0 }); }} className="p-2 md:p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white active:bg-blue-50 rounded-lg transition-colors touch-manipulation" title={t.pdfViewer.resetView}>
            <Maximize size={isMobile ? 18 : 16} />
          </button>
        </div>
      </div>
      
      {/* Minimap Panel - Mobile Optimized */}
      {showMinimap && numPages > 1 && (
        <div className="absolute top-16 md:top-14 left-2 right-2 md:right-auto z-30 bg-white rounded-xl shadow-xl border border-slate-200 p-3 max-h-[50vh] md:max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-slate-700">{t.pdfViewer.minimap}</div>
            <button 
              onClick={() => setShowMinimap(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden touch-manipulation"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-3 gap-2" style={{ maxWidth: isMobile ? '100%' : '240px' }}>
            {Array.from({ length: Math.min(numPages, 20) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => { handlePageChange(page); setShowMinimap(false); }}
                className={`relative rounded-lg overflow-hidden border-2 transition-all active:scale-95 touch-manipulation ${pageNumber === page ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
                title={`${t.pdfViewer.goToPage} ${page}`}
              >
                {pageThumbnails.has(page) ? (
                  <img src={pageThumbnails.get(page)} alt={`Page ${page}`} className="w-full h-auto" />
                ) : (
                  <div className="w-full aspect-[3/4] bg-slate-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-400">{page}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1 font-medium">
                  {page}
                </div>
                {/* Show field count indicator */}
                {fields.filter(f => f.page === page).length > 0 && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                    {fields.filter(f => f.page === page).length}
                  </div>
                )}
              </button>
            ))}
          </div>
          {numPages > 20 && (
            <p className="text-xs text-slate-400 mt-3 text-center">Showing first 20 pages</p>
          )}
        </div>
      )}
      <div 
        className="flex-1 overflow-auto p-2 md:p-8 flex justify-center items-start md:items-center relative select-none touch-pan-x touch-pan-y" 
        ref={containerRef}
        onPointerDown={handlePanStart}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {!workerReady && (
          <div className="text-slate-600">Initializing PDF viewer...</div>
        )}
        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{loadError}</p>
          </div>
        )}
        {stableFileUrl && !loadError && workerReady && (
          <div 
            style={{ 
              transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
              transition: isPanning ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <Document 
              key="pdf-document"
              file={stableFileUrl} 
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="text-slate-600">Loading PDF...</div>}
              className="shadow-xl"
            >
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
                      // For checkbox with useFieldAsCheckbox, render the field box itself
                      if (field.type === 'checkbox' && field.useFieldAsCheckbox) return renderBox(field, null);
                      if ((field.type === 'radio' || field.type === 'checkbox') && field.options?.length) return field.options.map(opt => renderBox(field, opt));
                      return renderBox(field, null);
                    })}
                  
                  {/* Double-tap position indicator */}
                  {isMobile && doubleTapPosition && showMobileAddField && (
                    <div 
                      className="absolute w-4 h-4 -ml-2 -mt-2 z-50 pointer-events-none"
                      style={{ left: `${doubleTapPosition.x}%`, top: `${doubleTapPosition.y}%` }}
                    >
                      <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75" />
                      <div className="absolute inset-0 w-full h-full bg-green-500 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </Document>
          </div>
        )}
      </div>
      
      {/* Mobile Add Field Bottom Sheet */}
      {mode === AppMode.EDITOR && isMobile && showMobileAddField && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => { setShowMobileAddField(false); setDoubleTapPosition(null); lastTapRef.current = null; }}>
          <div 
            className="bg-white rounded-t-2xl w-full max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 safe-area-inset-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-lg">{t.pdfViewer.addField || 'Add Field'}</h3>
              <button 
                onClick={() => { setShowMobileAddField(false); setDoubleTapPosition(null); lastTapRef.current = null; }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 touch-manipulation"
              >
                <X size={22} />
              </button>
            </div>
            
            {/* Show position indicator if double-tapped */}
            {doubleTapPosition && (
              <div className="px-4 pb-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-700">Field will be placed at your tap location</span>
                </div>
              </div>
            )}
            
            <div className="p-4 pt-2 grid grid-cols-3 gap-3">
              {[
                { type: 'text', icon: '📝', label: t.sidebar?.fieldTypes?.text || 'Text' },
                { type: 'number', icon: '🔢', label: t.sidebar?.fieldTypes?.number || 'Number' },
                { type: 'date', icon: '📅', label: t.sidebar?.fieldTypes?.date || 'Date' },
                { type: 'checkbox', icon: '☑️', label: t.sidebar?.fieldTypes?.checkbox || 'Checkbox' },
                { type: 'radio', icon: '🔘', label: t.sidebar?.fieldTypes?.radio || 'Radio' },
                { type: 'select', icon: '📋', label: t.sidebar?.fieldTypes?.select || 'Select' },
                { type: 'textarea', icon: '📄', label: t.sidebar?.fieldTypes?.textarea || 'Textarea' },
                { type: 'signature', icon: '✍️', label: t.sidebar?.fieldTypes?.signature || 'Signature' },
                { type: 'table', icon: '📊', label: t.sidebar?.fieldTypes?.table || 'Table' },
              ].map(({ type, icon, label }) => (
                <button
                  key={type}
                  onClick={() => {
                    // Use double-tap position if available, otherwise use default position
                    const fieldX = doubleTapPosition ? doubleTapPosition.x : 10;
                    const fieldY = doubleTapPosition ? doubleTapPosition.y : (30 + (fields.filter(f => f.page === pageNumber).length * 8) % 40);
                    
                    const newField: FormField = {
                      id: generateUUID(),
                      page: pageNumber,
                      x: fieldX,
                      y: fieldY,
                      width: type === 'checkbox' || type === 'radio' ? 5 : type === 'table' ? 80 : 50,
                      height: type === 'textarea' ? 15 : type === 'table' ? 20 : type === 'signature' ? 10 : 5,
                      name: `${label} ${fields.length + 1}`,
                      value: '',
                      previewText: type === 'date' ? 'DD/MM/YYYY' : type === 'signature' ? 'Sign Here' : '',
                      type: type as any,
                      fontSize: 12,
                      letterSpacing: 0,
                      options: (type === 'radio' || type === 'checkbox' || type === 'select') ? [
                        { id: generateUUID(), x: fieldX, y: fieldY, width: 4, height: 3, value: 'Option 1' },
                        { id: generateUUID(), x: fieldX + 10, y: fieldY, width: 4, height: 3, value: 'Option 2' },
                      ] : [],
                      color: globalDrawColor,
                      useGlobalColor: true,
                      dateFormat: type === 'date' ? 'DD/MM/YYYY' : undefined,
                      columns: type === 'table' ? [
                        { id: generateUUID(), name: 'Col 1', type: 'text', width: 50 },
                        { id: generateUUID(), name: 'Col 2', type: 'text', width: 50 },
                      ] : undefined,
                      maxRows: type === 'table' ? 3 : undefined,
                      filledRows: type === 'table' ? 1 : undefined,
                    };
                    onFieldAdd(newField);
                    onFieldSelect(newField.id);
                    setShowMobileAddField(false);
                    setDoubleTapPosition(null); // Clear the position after use
                  }}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-blue-50 active:bg-blue-100 rounded-xl border border-slate-200 hover:border-blue-300 transition-all touch-manipulation"
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-medium text-slate-700">{label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-4 pt-0">
              <p className="text-xs text-slate-500 text-center">
                {doubleTapPosition 
                  ? (t.pdfViewer.fieldAtTapLocation || 'Field will be created at your tap location')
                  : (t.pdfViewer.doubleTapHint || 'Tip: Double-tap on the PDF to place a field at that exact spot')}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile: Edit Properties button when field is selected */}
      {mode === AppMode.EDITOR && isMobile && selectedFieldId && onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          className="fixed bottom-20 left-4 z-30 px-4 py-3 bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white rounded-full shadow-lg flex items-center gap-2 touch-manipulation transition-all active:scale-95"
          title="Edit field properties"
        >
          <Edit2 size={18} />
          <span className="text-sm font-medium">Edit</span>
        </button>
      )}
      
      {/* Floating Action Button for adding fields on mobile in Editor mode */}
      {mode === AppMode.EDITOR && isMobile && (
        <button
          onClick={() => { setDoubleTapPosition(null); setShowMobileAddField(true); }}
          className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg flex items-center justify-center touch-manipulation transition-all active:scale-95"
          title="Add new field"
        >
          <Plus size={28} />
        </button>
      )}
    </div>
  );
};

export default PDFViewer;