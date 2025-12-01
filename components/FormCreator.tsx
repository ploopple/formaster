'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Plus, Type, Square, Minus, CheckSquare,
  AlignLeft, AlignCenter, AlignRight, Trash2, Copy,
  Move, FileText, LayoutTemplate, Calendar, PenTool,
  Hash, List, Circle, Image, AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter, ArrowUp, ArrowDown,
  Lock, Unlock, Grid3X3, Undo2, Redo2, Clipboard, Layers,
  TextCursorInput, AlignStartVertical, AlignEndVertical,
  AlignCenterVertical, AlignStartHorizontal, AlignEndHorizontal,
  AlignCenterHorizontal
} from 'lucide-react';
import { PAGE_SIZES, PageSizeKey, FormElement } from '../services/pdfGenerator';

interface FormCreatorProps {
  elements: FormElement[];
  onElementsChange: (elements: FormElement[]) => void;
  pageCount: number;
  onPageCountChange: (count: number) => void;
  pageSize: PageSizeKey;
  onPageSizeChange: (size: PageSizeKey) => void;
  currentPage: number;
  onCurrentPageChange: (page: number) => void;
}

// Element type definition
interface ElementTypeItem {
  type: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  color: string;
  description: string;
}

interface ElementCategory {
  name: string;
  items: ElementTypeItem[];
}

// Element categories for better organization
const ELEMENT_CATEGORIES: ElementCategory[] = [
  {
    name: 'Text',
    items: [
      { type: 'text-label', icon: Type, label: 'Text Label', color: 'bg-blue-500', description: 'Static text' },
      { type: 'text-field', icon: TextCursorInput, label: 'Text Input', color: 'bg-green-500', description: 'Single line input' },
      { type: 'textarea-field', icon: Square, label: 'Text Area', color: 'bg-green-600', description: 'Multi-line input' },
      { type: 'number-field', icon: Hash, label: 'Number', color: 'bg-cyan-500', description: 'Numeric input' },
    ],
  },
  {
    name: 'Selection',
    items: [
      { type: 'checkbox', icon: CheckSquare, label: 'Checkbox', color: 'bg-purple-500', description: 'Yes/No option' },
      { type: 'radio-group', icon: Circle, label: 'Radio Group', color: 'bg-purple-600', description: 'Single choice' },
      { type: 'select-field', icon: List, label: 'Dropdown', color: 'bg-indigo-500', description: 'Select from list' },
    ],
  },
  {
    name: 'Special',
    items: [
      { type: 'date-field', icon: Calendar, label: 'Date', color: 'bg-amber-500', description: 'Date picker' },
      { type: 'signature-field', icon: PenTool, label: 'Signature', color: 'bg-pink-500', description: 'Signature area' },
      { type: 'image', icon: Image, label: 'Image', color: 'bg-teal-500', description: 'Upload image' },
    ],
  },
  {
    name: 'Shapes',
    items: [
      { type: 'line', icon: Minus, label: 'Line', color: 'bg-gray-500', description: 'Horizontal line' },
      { type: 'divider', icon: Minus, label: 'Divider', color: 'bg-gray-400', description: 'Section divider' },
      { type: 'rectangle', icon: Square, label: 'Rectangle', color: 'bg-orange-500', description: 'Box/Border' },
      { type: 'circle', icon: Circle, label: 'Circle', color: 'bg-rose-500', description: 'Circle shape' },
    ],
  },
];

// Flatten for backward compatibility
const ELEMENT_TYPES = ELEMENT_CATEGORIES.flatMap(cat => cat.items);

// Quick start templates
const FORM_TEMPLATES = [
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'Name, email, phone fields',
    icon: '📧',
    elements: [
      { id: '1', type: 'text-label' as const, x: 5, y: 3, width: 90, height: 4, page: 1, text: 'Contact Information', fontSize: 18, fontWeight: 'bold' as const, color: '#1e293b' },
      { id: '2', type: 'divider' as const, x: 5, y: 8, width: 90, height: 0.5, page: 1, color: '#e2e8f0' },
      { id: '3', type: 'text-label' as const, x: 5, y: 12, width: 20, height: 3, page: 1, text: 'Full Name:', fontSize: 12, color: '#475569' },
      { id: '4', type: 'text-field' as const, x: 5, y: 16, width: 40, height: 5, page: 1, fieldName: 'full_name', placeholder: 'Enter your name', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '5', type: 'text-label' as const, x: 5, y: 24, width: 20, height: 3, page: 1, text: 'Email:', fontSize: 12, color: '#475569' },
      { id: '6', type: 'text-field' as const, x: 5, y: 28, width: 40, height: 5, page: 1, fieldName: 'email', placeholder: 'Enter your email', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '7', type: 'text-label' as const, x: 5, y: 36, width: 20, height: 3, page: 1, text: 'Phone:', fontSize: 12, color: '#475569' },
      { id: '8', type: 'text-field' as const, x: 5, y: 40, width: 40, height: 5, page: 1, fieldName: 'phone', placeholder: 'Enter your phone', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '9', type: 'text-label' as const, x: 5, y: 48, width: 20, height: 3, page: 1, text: 'Message:', fontSize: 12, color: '#475569' },
      { id: '10', type: 'textarea-field' as const, x: 5, y: 52, width: 60, height: 15, page: 1, fieldName: 'message', placeholder: 'Your message...', borderColor: '#cbd5e1', borderRadius: 4 },
    ],
  },
  {
    id: 'registration',
    name: 'Registration Form',
    description: 'Personal details with checkboxes',
    icon: '📝',
    elements: [
      { id: '1', type: 'text-label' as const, x: 5, y: 3, width: 90, height: 4, page: 1, text: 'Registration Form', fontSize: 20, fontWeight: 'bold' as const, color: '#1e293b' },
      { id: '2', type: 'divider' as const, x: 5, y: 8, width: 90, height: 0.5, page: 1, color: '#e2e8f0' },
      { id: '3', type: 'text-label' as const, x: 5, y: 12, width: 20, height: 3, page: 1, text: 'First Name:', fontSize: 12, color: '#475569' },
      { id: '4', type: 'text-field' as const, x: 5, y: 16, width: 35, height: 5, page: 1, fieldName: 'first_name', placeholder: 'First name', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '5', type: 'text-label' as const, x: 50, y: 12, width: 20, height: 3, page: 1, text: 'Last Name:', fontSize: 12, color: '#475569' },
      { id: '6', type: 'text-field' as const, x: 50, y: 16, width: 35, height: 5, page: 1, fieldName: 'last_name', placeholder: 'Last name', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '7', type: 'text-label' as const, x: 5, y: 25, width: 20, height: 3, page: 1, text: 'Date of Birth:', fontSize: 12, color: '#475569' },
      { id: '8', type: 'date-field' as const, x: 5, y: 29, width: 25, height: 5, page: 1, fieldName: 'dob', dateFormat: 'DD/MM/YYYY', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '9', type: 'text-label' as const, x: 50, y: 25, width: 20, height: 3, page: 1, text: 'Gender:', fontSize: 12, color: '#475569' },
      { id: '10', type: 'select-field' as const, x: 50, y: 29, width: 25, height: 5, page: 1, fieldName: 'gender', selectOptions: ['Male', 'Female', 'Other'], borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '11', type: 'checkbox' as const, x: 5, y: 40, width: 3, height: 3, page: 1, borderColor: '#64748b' },
      { id: '12', type: 'text-label' as const, x: 10, y: 40, width: 50, height: 3, page: 1, text: 'I agree to the terms and conditions', fontSize: 11, color: '#475569' },
    ],
  },
  {
    id: 'application',
    name: 'Job Application',
    description: 'Resume & cover letter',
    icon: '💼',
    elements: [
      { id: '1', type: 'text-label' as const, x: 5, y: 3, width: 90, height: 5, page: 1, text: 'Job Application Form', fontSize: 22, fontWeight: 'bold' as const, color: '#1e293b' },
      { id: '2', type: 'divider' as const, x: 5, y: 9, width: 90, height: 0.5, page: 1, color: '#3b82f6' },
      { id: '3', type: 'text-label' as const, x: 5, y: 13, width: 90, height: 3, page: 1, text: 'Personal Information', fontSize: 14, fontWeight: 'bold' as const, color: '#3b82f6' },
      { id: '4', type: 'text-label' as const, x: 5, y: 18, width: 15, height: 3, page: 1, text: 'Full Name:', fontSize: 11, color: '#475569' },
      { id: '5', type: 'text-field' as const, x: 5, y: 22, width: 40, height: 5, page: 1, fieldName: 'full_name', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '6', type: 'text-label' as const, x: 50, y: 18, width: 15, height: 3, page: 1, text: 'Email:', fontSize: 11, color: '#475569' },
      { id: '7', type: 'text-field' as const, x: 50, y: 22, width: 40, height: 5, page: 1, fieldName: 'email', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '8', type: 'text-label' as const, x: 5, y: 30, width: 90, height: 3, page: 1, text: 'Position Applied For', fontSize: 14, fontWeight: 'bold' as const, color: '#3b82f6' },
      { id: '9', type: 'text-field' as const, x: 5, y: 35, width: 50, height: 5, page: 1, fieldName: 'position', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '10', type: 'text-label' as const, x: 5, y: 43, width: 90, height: 3, page: 1, text: 'Cover Letter', fontSize: 14, fontWeight: 'bold' as const, color: '#3b82f6' },
      { id: '11', type: 'textarea-field' as const, x: 5, y: 48, width: 85, height: 20, page: 1, fieldName: 'cover_letter', placeholder: 'Tell us why you are the best candidate...', borderColor: '#cbd5e1', borderRadius: 4 },
      { id: '12', type: 'text-label' as const, x: 5, y: 72, width: 90, height: 3, page: 1, text: 'Signature', fontSize: 14, fontWeight: 'bold' as const, color: '#3b82f6' },
      { id: '13', type: 'signature-field' as const, x: 5, y: 77, width: 40, height: 12, page: 1, fieldName: 'signature', borderColor: '#94a3b8' },
      { id: '14', type: 'text-label' as const, x: 50, y: 72, width: 20, height: 3, page: 1, text: 'Date:', fontSize: 11, color: '#475569' },
      { id: '15', type: 'date-field' as const, x: 50, y: 77, width: 25, height: 5, page: 1, fieldName: 'date', borderColor: '#cbd5e1', borderRadius: 4 },
    ],
  },
  {
    id: 'survey',
    name: 'Survey Form',
    description: 'Questions with radio & checkboxes',
    icon: '📊',
    elements: [
      { id: '1', type: 'text-label' as const, x: 5, y: 3, width: 90, height: 5, page: 1, text: 'Customer Satisfaction Survey', fontSize: 20, fontWeight: 'bold' as const, color: '#1e293b' },
      { id: '2', type: 'divider' as const, x: 5, y: 9, width: 90, height: 0.5, page: 1, color: '#10b981' },
      { id: '3', type: 'text-label' as const, x: 5, y: 14, width: 90, height: 3, page: 1, text: '1. How satisfied are you with our service?', fontSize: 12, color: '#1e293b' },
      { id: '4', type: 'radio-group' as const, x: 5, y: 19, width: 50, height: 15, page: 1, fieldName: 'satisfaction', options: [
        { id: 'r1', label: 'Very Satisfied', x: 0, y: 0, value: '5' },
        { id: 'r2', label: 'Satisfied', x: 0, y: 33, value: '4' },
        { id: 'r3', label: 'Neutral', x: 0, y: 66, value: '3' },
      ], borderColor: '#10b981' },
      { id: '5', type: 'text-label' as const, x: 5, y: 38, width: 90, height: 3, page: 1, text: '2. What features do you use most? (Select all that apply)', fontSize: 12, color: '#1e293b' },
      { id: '6', type: 'checkbox' as const, x: 5, y: 43, width: 3, height: 3, page: 1, borderColor: '#10b981' },
      { id: '7', type: 'text-label' as const, x: 10, y: 43, width: 30, height: 3, page: 1, text: 'Feature A', fontSize: 11, color: '#475569' },
      { id: '8', type: 'checkbox' as const, x: 5, y: 49, width: 3, height: 3, page: 1, borderColor: '#10b981' },
      { id: '9', type: 'text-label' as const, x: 10, y: 49, width: 30, height: 3, page: 1, text: 'Feature B', fontSize: 11, color: '#475569' },
      { id: '10', type: 'text-label' as const, x: 5, y: 58, width: 90, height: 3, page: 1, text: '3. Additional comments:', fontSize: 12, color: '#1e293b' },
      { id: '11', type: 'textarea-field' as const, x: 5, y: 63, width: 85, height: 15, page: 1, fieldName: 'comments', borderColor: '#cbd5e1', borderRadius: 4 },
    ],
  },
  {
    id: 'blank',
    name: 'Blank Form',
    description: 'Start from scratch',
    icon: '📄',
    elements: [],
  },
];

const FormCreator: React.FC<FormCreatorProps> = ({
  elements,
  onElementsChange,
  pageCount,
  onPageCountChange,
  pageSize,
  onPageSizeChange,
  currentPage,
  onCurrentPageChange,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]); // Multi-select
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0, elemW: 0, elemH: 0 });
  const [showTemplates, setShowTemplates] = useState(elements.length === 0);

  // Advanced features state
  const [gridSize, setGridSize] = useState(5); // 5% grid
  const [showGrid, setShowGrid] = useState(true); // Grid visible = snap enabled
  const [clipboard, setClipboard] = useState<FormElement | null>(null);
  const [history, setHistory] = useState<FormElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Text');

  const selectedElement = elements.find(e => e.id === selectedElementId);
  const pageElements = elements.filter(e => e.page === currentPage).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  const size = PAGE_SIZES[pageSize];
  const aspectRatio = size.width / size.height;

  // Snap value to grid - only snaps when grid is visible
  const snapValue = useCallback((value: number) => {
    if (!showGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [showGrid, gridSize]);

  // Save to history for undo/redo
  const saveToHistory = useCallback((newElements: FormElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    // Keep only last 50 states
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onElementsChange(history[historyIndex - 1]);
    }
  }, [history, historyIndex, onElementsChange]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onElementsChange(history[historyIndex + 1]);
    }
  }, [history, historyIndex, onElementsChange]);

  // Copy/Paste
  const copyElement = useCallback(() => {
    if (selectedElement) {
      setClipboard({ ...selectedElement });
    }
  }, [selectedElement]);

  const pasteElement = useCallback(() => {
    if (clipboard) {
      const newElem = {
        ...clipboard,
        id: crypto.randomUUID(),
        x: clipboard.x + 2,
        y: clipboard.y + 2,
        page: currentPage,
      };
      const newElements = [...elements, newElem];
      onElementsChange(newElements);
      saveToHistory(newElements);
      setSelectedElementId(newElem.id);
    }
  }, [clipboard, currentPage, elements, onElementsChange, saveToHistory]);

  // Layer management
  const bringToFront = useCallback(() => {
    if (!selectedElementId) return;
    const maxZ = Math.max(...elements.map(e => e.zIndex || 0));
    const newElements = elements.map(e =>
      e.id === selectedElementId ? { ...e, zIndex: maxZ + 1 } : e
    );
    onElementsChange(newElements);
    saveToHistory(newElements);
  }, [selectedElementId, elements, onElementsChange, saveToHistory]);

  const sendToBack = useCallback(() => {
    if (!selectedElementId) return;
    const minZ = Math.min(...elements.map(e => e.zIndex || 0));
    const newElements = elements.map(e =>
      e.id === selectedElementId ? { ...e, zIndex: minZ - 1 } : e
    );
    onElementsChange(newElements);
    saveToHistory(newElements);
  }, [selectedElementId, elements, onElementsChange, saveToHistory]);

  // Alignment tools
  const alignElements = useCallback((alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedElementIds.length < 2) return;
    const selected = elements.filter(e => selectedElementIds.includes(e.id));
    let newElements = [...elements];

    switch (alignment) {
      case 'left':
        const minX = Math.min(...selected.map(e => e.x));
        newElements = newElements.map(e =>
          selectedElementIds.includes(e.id) ? { ...e, x: minX } : e
        );
        break;
      case 'right':
        const maxRight = Math.max(...selected.map(e => e.x + e.width));
        newElements = newElements.map(e =>
          selectedElementIds.includes(e.id) ? { ...e, x: maxRight - e.width } : e
        );
        break;
      case 'center':
        const avgX = selected.reduce((sum, e) => sum + e.x + e.width / 2, 0) / selected.length;
        newElements = newElements.map(e =>
          selectedElementIds.includes(e.id) ? { ...e, x: avgX - e.width / 2 } : e
        );
        break;
      case 'top':
        const minY = Math.min(...selected.map(e => e.y));
        newElements = newElements.map(e =>
          selectedElementIds.includes(e.id) ? { ...e, y: minY } : e
        );
        break;
      case 'bottom':
        const maxBottom = Math.max(...selected.map(e => e.y + e.height));
        newElements = newElements.map(e =>
          selectedElementIds.includes(e.id) ? { ...e, y: maxBottom - e.height } : e
        );
        break;
      case 'middle':
        const avgY = selected.reduce((sum, e) => sum + e.y + e.height / 2, 0) / selected.length;
        newElements = newElements.map(e =>
          selectedElementIds.includes(e.id) ? { ...e, y: avgY - e.height / 2 } : e
        );
        break;
    }

    onElementsChange(newElements);
    saveToHistory(newElements);
  }, [selectedElementIds, elements, onElementsChange, saveToHistory]);

  const addElement = useCallback((type: FormElement['type']) => {
    // Default dimensions based on type
    const dimensions: Record<string, { width: number; height: number }> = {
      'text-label': { width: 25, height: 4 },
      'text-field': { width: 30, height: 5 },
      'textarea-field': { width: 40, height: 15 },
      'number-field': { width: 15, height: 5 },
      'checkbox': { width: 4, height: 4 },
      'radio-group': { width: 30, height: 10 },
      'select-field': { width: 25, height: 5 },
      'date-field': { width: 20, height: 5 },
      'signature-field': { width: 30, height: 12 },
      'image': { width: 20, height: 15 },
      'line': { width: 40, height: 0.5 },
      'divider': { width: 90, height: 2 },
      'rectangle': { width: 20, height: 15 },
      'circle': { width: 10, height: 10 },
    };

    const dim = dimensions[type] || { width: 20, height: 6 };
    const maxZ = Math.max(0, ...elements.map(e => e.zIndex || 0));

    const newElement: FormElement = {
      id: crypto.randomUUID(),
      type,
      x: snapValue(10),
      y: snapValue(10),
      width: dim.width,
      height: dim.height,
      page: currentPage,
      zIndex: maxZ + 1,
      text: type === 'text-label' ? 'Label Text' : undefined,
      fontSize: type === 'text-label' ? 14 : 12,
      fontWeight: 'normal',
      textAlign: 'left',
      color: '#000000',
      borderColor: type === 'signature-field' ? '#94a3b8' : '#cbd5e1',
      borderWidth: 1,
      borderRadius: type === 'text-field' || type === 'select-field' ? 4 : 0,
      placeholder: getPlaceholder(type),
      backgroundColor: type === 'signature-field' ? '#f8fafc' : '#ffffff',
      dateFormat: type === 'date-field' ? 'DD/MM/YYYY' : undefined,
      selectOptions: type === 'select-field' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
      options: type === 'radio-group' ? [
        { id: crypto.randomUUID(), label: 'Option 1', x: 0, y: 0, value: 'opt1' },
        { id: crypto.randomUUID(), label: 'Option 2', x: 0, y: 50, value: 'opt2' },
      ] : undefined,
    };

    const newElements = [...elements, newElement];
    onElementsChange(newElements);
    saveToHistory(newElements);
    setSelectedElementId(newElement.id);
    setShowTemplates(false);
  }, [elements, currentPage, onElementsChange, snapValue, saveToHistory]);

  // Helper for placeholders
  function getPlaceholder(type: string): string | undefined {
    const placeholders: Record<string, string> = {
      'text-field': 'Enter text...',
      'textarea-field': 'Enter your message...',
      'number-field': '0',
      'date-field': 'DD/MM/YYYY',
      'select-field': 'Select an option...',
      'signature-field': 'Sign here',
    };
    return placeholders[type];
  }

  const updateElement = useCallback((id: string, updates: Partial<FormElement>, saveHistory = false) => {
    const newElements = elements.map(e => e.id === id ? { ...e, ...updates } : e);
    onElementsChange(newElements);
    if (saveHistory) saveToHistory(newElements);
  }, [elements, onElementsChange, saveToHistory]);

  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter(e => e.id !== id);
    onElementsChange(newElements);
    saveToHistory(newElements);
    if (selectedElementId === id) setSelectedElementId(null);
  }, [elements, selectedElementId, onElementsChange, saveToHistory]);

  const duplicateElement = useCallback((id: string) => {
    const elem = elements.find(e => e.id === id);
    if (elem) {
      const maxZ = Math.max(0, ...elements.map(e => e.zIndex || 0));
      const newElem = { ...elem, id: crypto.randomUUID(), x: elem.x + 2, y: elem.y + 2, zIndex: maxZ + 1 };
      const newElements = [...elements, newElem];
      onElementsChange(newElements);
      saveToHistory(newElements);
      setSelectedElementId(newElem.id);
    }
  }, [elements, onElementsChange, saveToHistory]);

  // Lock/unlock element
  const toggleLock = useCallback((id: string) => {
    const elem = elements.find(e => e.id === id);
    if (elem) {
      updateElement(id, { locked: !elem.locked }, true);
    }
  }, [elements, updateElement]);

  // Mouse handlers for drag and resize
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Deselect when clicking on the canvas background (white PDF area)
    // This triggers when clicking on the canvas itself, not on elements
    const target = e.target as HTMLElement;
    // Check if we clicked on the canvas or the grid overlay (not on an element)
    if (target === canvasRef.current || target.classList.contains('pointer-events-none')) {
      setSelectedElementId(null);
    }
  }, []);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    const elem = elements.find(el => el.id === elementId);
    if (!elem) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elemX: elem.x,
      elemY: elem.y,
      elemW: elem.width,
      elemH: elem.height,
    });
  }, [elements]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (!selectedElement) return;

    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elemX: selectedElement.x,
      elemY: selectedElement.y,
      elemW: selectedElement.width,
      elemH: selectedElement.height,
    });
  }, [selectedElement]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      if (isDragging && selectedElementId) {
        const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

        // Apply snap to grid when grid is visible
        const newX = snapValue(Math.max(0, Math.min(100 - dragStart.elemW, dragStart.elemX + deltaX)));
        const newY = snapValue(Math.max(0, Math.min(100 - dragStart.elemH, dragStart.elemY + deltaY)));

        updateElement(selectedElementId, { x: newX, y: newY });
      }

      if (isResizing && selectedElementId && resizeHandle) {
        const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

        let newX = dragStart.elemX;
        let newY = dragStart.elemY;
        let newW = dragStart.elemW;
        let newH = dragStart.elemH;

        if (resizeHandle.includes('e')) newW = Math.max(2, dragStart.elemW + deltaX);
        if (resizeHandle.includes('w')) {
          newW = Math.max(2, dragStart.elemW - deltaX);
          newX = dragStart.elemX + deltaX;
        }
        if (resizeHandle.includes('s')) newH = Math.max(1, dragStart.elemH + deltaY);
        if (resizeHandle.includes('n')) {
          newH = Math.max(1, dragStart.elemH - deltaY);
          newY = dragStart.elemY + deltaY;
        }

        // Apply snap to grid when grid is visible
        updateElement(selectedElementId, {
          x: snapValue(newX),
          y: snapValue(newY),
          width: snapValue(newW),
          height: snapValue(newH)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, selectedElementId, dragStart, resizeHandle, updateElement, snapValue]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      // Global shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault();
        copyElement();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        pasteElement();
        return;
      }
      if (e.key === 'g') {
        setShowGrid(!showGrid);
        return;
      }

      if (selectedElementId) {
        const elem = elements.find(el => el.id === selectedElementId);
        if (!elem || elem.locked) return;

        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          deleteElement(selectedElementId);
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
          e.preventDefault();
          duplicateElement(selectedElementId);
        }
        if (e.key === 'Escape') {
          setSelectedElementId(null);
        }
        // Arrow keys for nudging - use grid size when grid is visible
        const step = showGrid ? gridSize : (e.shiftKey ? 5 : 1);
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          updateElement(selectedElementId, { y: snapValue(Math.max(0, elem.y - step)) });
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          updateElement(selectedElementId, { y: snapValue(Math.min(100 - elem.height, elem.y + step)) });
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          updateElement(selectedElementId, { x: snapValue(Math.max(0, elem.x - step)) });
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          updateElement(selectedElementId, { x: snapValue(Math.min(100 - elem.width, elem.x + step)) });
        }
        // Lock/unlock with L
        if (e.key === 'l') {
          toggleLock(selectedElementId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, deleteElement, duplicateElement, undo, redo, copyElement, pasteElement, showGrid, gridSize, snapValue, elements, updateElement, toggleLock]);

  const renderElement = (elem: FormElement) => {
    const isSelected = elem.id === selectedElementId;
    const isLocked = elem.locked;

    return (
      <div
        key={elem.id}
        className={`absolute transition-shadow ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-move'} ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-300'}`}
        style={{
          left: `${elem.x}%`,
          top: `${elem.y}%`,
          width: `${elem.width}%`,
          height: `${elem.height}%`,
          zIndex: elem.zIndex || 0,
          transform: elem.rotation ? `rotate(${elem.rotation}deg)` : undefined,
        }}
        onMouseDown={(e) => !isLocked && handleElementMouseDown(e, elem.id)}
      >
        {/* Element content */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {elem.type === 'text-label' && (
            <span
              className="w-full px-1"
              style={{
                fontSize: `${elem.fontSize || 12}px`,
                fontWeight: elem.fontWeight,
                fontStyle: elem.fontStyle,
                color: elem.color,
                textAlign: elem.textAlign,
              }}
            >
              {elem.text || 'Label'}
            </span>
          )}
          {(elem.type === 'text-field' || elem.type === 'number-field') && (
            <div
              className="w-full h-full border flex items-center px-2"
              style={{
                borderColor: elem.borderColor,
                borderWidth: elem.borderWidth,
                borderRadius: elem.borderRadius,
                backgroundColor: elem.backgroundColor || '#fff',
              }}
            >
              <span className="text-gray-400 text-xs truncate">{elem.placeholder || 'Text field'}</span>
            </div>
          )}
          {elem.type === 'textarea-field' && (
            <div
              className="w-full h-full border p-2"
              style={{
                borderColor: elem.borderColor,
                borderWidth: elem.borderWidth,
                borderRadius: elem.borderRadius,
                backgroundColor: elem.backgroundColor || '#fff',
              }}
            >
              <span className="text-gray-400 text-xs">{elem.placeholder || 'Multi-line text...'}</span>
            </div>
          )}
          {elem.type === 'date-field' && (
            <div
              className="w-full h-full border flex items-center px-2 gap-2"
              style={{
                borderColor: elem.borderColor,
                borderWidth: elem.borderWidth,
                borderRadius: elem.borderRadius,
                backgroundColor: elem.backgroundColor || '#fff',
              }}
            >
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <span className="text-gray-400 text-xs truncate">{elem.dateFormat || 'DD/MM/YYYY'}</span>
            </div>
          )}
          {elem.type === 'select-field' && (
            <div
              className="w-full h-full border flex items-center justify-between px-2"
              style={{
                borderColor: elem.borderColor,
                borderWidth: elem.borderWidth,
                borderRadius: elem.borderRadius,
                backgroundColor: elem.backgroundColor || '#fff',
              }}
            >
              <span className="text-gray-400 text-xs truncate">{elem.placeholder || 'Select...'}</span>
              <List size={12} className="text-gray-400 shrink-0" />
            </div>
          )}
          {elem.type === 'signature-field' && (
            <div
              className="w-full h-full border-2 border-dashed flex flex-col items-center justify-center"
              style={{
                borderColor: elem.borderColor || '#94a3b8',
                backgroundColor: elem.backgroundColor || '#f8fafc',
                borderRadius: elem.borderRadius,
              }}
            >
              <PenTool size={20} className="text-gray-400 mb-1" />
              <span className="text-gray-400 text-xs">Sign here</span>
            </div>
          )}
          {elem.type === 'checkbox' && (
            <div
              className="border-2 rounded"
              style={{
                width: '100%',
                height: '100%',
                maxWidth: 20,
                maxHeight: 20,
                borderColor: elem.borderColor || '#666',
              }}
            />
          )}
          {elem.type === 'radio-group' && (
            <div className="w-full h-full flex flex-col justify-around p-1">
              {(elem.options || []).map((opt, i) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ borderColor: elem.borderColor || '#666' }}
                  />
                  <span className="text-xs text-gray-600">{opt.label}</span>
                </div>
              ))}
            </div>
          )}
          {(elem.type === 'line' || elem.type === 'divider') && (
            <div
              className="w-full"
              style={{
                height: elem.lineWidth || 1,
                backgroundColor: elem.color || '#e2e8f0',
                borderStyle: elem.lineStyle === 'dashed' ? 'dashed' : elem.lineStyle === 'dotted' ? 'dotted' : 'solid',
              }}
            />
          )}
          {elem.type === 'rectangle' && (
            <div
              className="w-full h-full"
              style={{
                backgroundColor: elem.backgroundColor || 'transparent',
                border: `${elem.borderWidth || 1}px solid ${elem.borderColor || '#000'}`,
                borderRadius: elem.borderRadius || 0,
                opacity: elem.opacity,
              }}
            />
          )}
          {elem.type === 'circle' && (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: elem.backgroundColor || 'transparent',
                border: `${elem.borderWidth || 1}px solid ${elem.borderColor || '#000'}`,
                opacity: elem.opacity,
              }}
            />
          )}
          {elem.type === 'image' && (
            <div
              className="w-full h-full border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: elem.borderColor || '#cbd5e1' }}
            >
              {elem.imageData ? (
                <img src={elem.imageData} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-gray-400">
                  <Image size={24} className="mx-auto mb-1" />
                  <span className="text-xs">Image</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lock indicator */}
        {isLocked && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
            <Lock size={10} className="text-white" />
          </div>
        )}

        {/* Resize handles */}
        {isSelected && !isLocked && (
          <>
            {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(handle => (
              <div
                key={handle}
                className={`absolute w-2.5 h-2.5 bg-white border border-blue-500 rounded-sm z-30`}
                style={{
                  top: handle.includes('n') ? -4 : handle.includes('s') ? 'calc(100% - 4px)' : 'calc(50% - 4px)',
                  left: handle.includes('w') ? -4 : handle.includes('e') ? 'calc(100% - 4px)' : 'calc(50% - 4px)',
                  cursor: `${handle}-resize`,
                }}
                onMouseDown={(e) => handleResizeMouseDown(e, handle)}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Element Toolbox */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Toolbar */}
        <div className="p-2 border-b border-slate-100 flex items-center gap-1 flex-wrap">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button
            onClick={copyElement}
            disabled={!selectedElement}
            className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Copy (Ctrl+C)"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={pasteElement}
            disabled={!clipboard}
            className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Paste (Ctrl+V)"
          >
            <Clipboard size={16} />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button
            onClick={bringToFront}
            disabled={!selectedElement}
            className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Bring to Front"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={sendToBack}
            disabled={!selectedElement}
            className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Send to Back"
          >
            <ArrowDown size={16} />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded ${showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'}`}
            title={showGrid ? "Hide Grid (G)" : "Show Grid (G)"}
          >
            <Grid3X3 size={16} />
          </button>
          {showGrid && (
            <select
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="text-xs border border-slate-200 rounded px-1 py-0.5 bg-white"
              title="Grid Size"
            >
              <option value="2">2%</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
            </select>
          )}
        </div>

        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Plus size={18} />
            Add Elements
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {ELEMENT_CATEGORIES.map(category => (
            <div key={category.name} className="mb-2">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide hover:bg-slate-50 rounded"
              >
                {category.name}
                <span className={`transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedCategory === category.name && (
                <div className="mt-1 space-y-1">
                  {category.items.map(({ type, icon: Icon, label, color, description }) => (
                    <button
                      key={type}
                      onClick={() => addElement(type as FormElement['type'])}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className={`w-7 h-7 ${color} rounded flex items-center justify-center text-white shrink-0`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 block">{label}</span>
                        <span className="text-[10px] text-slate-400">{description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Page Settings */}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Page Settings</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(e.target.value as PageSizeKey)}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md"
              >
                {Object.entries(PAGE_SIZES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Pages</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageCountChange(Math.max(1, pageCount - 1))}
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50"
                  disabled={pageCount <= 1}
                >
                  -
                </button>
                <span className="text-sm font-medium w-8 text-center">{pageCount}</span>
                <button
                  onClick={() => onPageCountChange(pageCount + 1)}
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>

            {pageCount > 1 && (
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Current Page</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCurrentPageChange(Math.max(1, currentPage - 1))}
                    className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50"
                    disabled={currentPage <= 1}
                  >
                    ←
                  </button>
                  <span className="text-sm font-medium">{currentPage} / {pageCount}</span>
                  <button
                    onClick={() => onCurrentPageChange(Math.min(pageCount, currentPage + 1))}
                    className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50"
                    disabled={currentPage >= pageCount}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        className="flex-1 bg-slate-100 p-6 overflow-auto flex items-start justify-center"
        onClick={(e) => {
          // Deselect when clicking outside the canvas (on the gray background)
          if (e.target === e.currentTarget) {
            setSelectedElementId(null);
          }
        }}
      >
        {showTemplates ? (
          /* Template Selection */
          <div className="max-w-3xl w-full">
            <div className="text-center mb-8">
              <LayoutTemplate size={48} className="mx-auto mb-3 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-800">Choose a Template</h2>
              <p className="text-slate-500 text-sm mt-1">Start with a template or create from scratch</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FORM_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    const newElements = template.elements.map(e => ({ ...e, id: crypto.randomUUID() }));
                    onElementsChange(newElements);
                    if (newElements.length > 0) saveToHistory(newElements);
                    setShowTemplates(false);
                  }}
                  className="bg-white rounded-xl p-5 text-left hover:shadow-lg transition-all border border-slate-200 hover:border-green-400 group"
                >
                  <div className="text-3xl mb-3">{template.icon}</div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-green-600 transition-colors">{template.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                  <div className="mt-3 text-xs text-slate-400">
                    {template.elements.length} elements
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="mt-8 text-sm text-slate-500 hover:text-slate-700 mx-auto block underline"
            >
              Skip and start with blank canvas
            </button>
          </div>
        ) : (
          <div
            ref={canvasRef}
            className="bg-white shadow-xl relative"
            style={{
              width: '100%',
              maxWidth: 600,
              aspectRatio: `${aspectRatio}`,
            }}
            onMouseDown={handleCanvasMouseDown}
          >
            {/* Grid overlay - toggleable with the grid button */}
            {showGrid && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                  backgroundSize: `${gridSize}% ${gridSize}%`,
                }}
              />
            )}
            
            {/* Elements */}
            {pageElements.map(renderElement)}
            
            {/* Empty state */}
            {pageElements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click elements on the left to add them</p>
                  <p className="text-xs mt-1">or drag to draw on the canvas</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel - Properties */}
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">
            {selectedElement ? 'Element Properties' : 'Properties'}
          </h3>
        </div>

        {selectedElement ? (
          <div className="p-4 space-y-4">
            {/* Position & Size */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Position & Size</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500">X (%)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x * 10) / 10}
                    onChange={(e) => updateElement(selectedElement.id, { x: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Y (%)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y * 10) / 10}
                    onChange={(e) => updateElement(selectedElement.id, { y: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Width (%)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.width * 10) / 10}
                    onChange={(e) => updateElement(selectedElement.id, { width: parseFloat(e.target.value) || 1 })}
                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Height (%)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.height * 10) / 10}
                    onChange={(e) => updateElement(selectedElement.id, { height: parseFloat(e.target.value) || 1 })}
                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            {/* Text Properties */}
            {(selectedElement.type === 'text-label' || selectedElement.type === 'text-field') && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Text</h4>
                
                {selectedElement.type === 'text-label' && (
                  <div>
                    <label className="text-xs text-slate-500">Content</label>
                    <input
                      type="text"
                      value={selectedElement.text || ''}
                      onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded"
                    />
                  </div>
                )}
                
                {selectedElement.type === 'text-field' && (
                  <>
                    <div>
                      <label className="text-xs text-slate-500">Field Name</label>
                      <input
                        type="text"
                        value={selectedElement.fieldName || ''}
                        onChange={(e) => updateElement(selectedElement.id, { fieldName: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded"
                        placeholder="field_name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Placeholder</label>
                      <input
                        type="text"
                        value={selectedElement.placeholder || ''}
                        onChange={(e) => updateElement(selectedElement.id, { placeholder: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Font Size</label>
                    <input
                      type="number"
                      value={selectedElement.fontSize || 12}
                      onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 12 })}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                      min="8"
                      max="72"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Weight</label>
                    <select
                      value={selectedElement.fontWeight || 'normal'}
                      onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value as 'normal' | 'bold' })}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500">Alignment</label>
                  <div className="flex gap-1">
                    {(['left', 'center', 'right'] as const).map(align => (
                      <button
                        key={align}
                        onClick={() => updateElement(selectedElement.id, { textAlign: align })}
                        className={`flex-1 p-1.5 rounded ${selectedElement.textAlign === align ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'}`}
                      >
                        {align === 'left' && <AlignLeft size={16} className="mx-auto" />}
                        {align === 'center' && <AlignCenter size={16} className="mx-auto" />}
                        {align === 'right' && <AlignRight size={16} className="mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Style Properties */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Style</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500">Color</label>
                  <input
                    type="color"
                    value={selectedElement.color || '#000000'}
                    onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                {selectedElement.type !== 'text-label' && selectedElement.type !== 'line' && (
                  <div>
                    <label className="text-xs text-slate-500">Background</label>
                    <input
                      type="color"
                      value={selectedElement.backgroundColor || '#ffffff'}
                      onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {selectedElement.type !== 'text-label' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Border Color</label>
                    <input
                      type="color"
                      value={selectedElement.borderColor || '#cccccc'}
                      onChange={(e) => updateElement(selectedElement.id, { borderColor: e.target.value })}
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Border Width</label>
                    <input
                      type="number"
                      value={selectedElement.borderWidth || 1}
                      onChange={(e) => updateElement(selectedElement.id, { borderWidth: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              )}

              {selectedElement.type === 'line' && (
                <div>
                  <label className="text-xs text-slate-500">Line Width</label>
                  <input
                    type="number"
                    value={selectedElement.lineWidth || 1}
                    onChange={(e) => updateElement(selectedElement.id, { lineWidth: parseInt(e.target.value) || 1 })}
                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    min="1"
                    max="20"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => duplicateElement(selectedElement.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Copy size={16} />
                Duplicate
              </button>
              <button
                onClick={() => deleteElement(selectedElement.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-slate-400">
            <Move size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select an element to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCreator;
