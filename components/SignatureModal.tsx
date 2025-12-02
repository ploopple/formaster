'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, Check, Eraser } from 'lucide-react';
import { useI18n } from '../lib/i18n/I18nContext';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  canvasWidth?: number; // Optional width for the signature canvas (default: 500)
  canvasHeight?: number; // Optional height for the signature canvas (default: 300)
  strokeColor?: string; // Color for the signature stroke (default: #000000)
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave, canvasWidth = 500, canvasHeight = 300, strokeColor = '#000000' }) => {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Resize canvas on mount/window resize
  useEffect(() => {
    if (isOpen) {
      setTimeout(resizeCanvas, 10);
      window.addEventListener('resize', resizeCanvas);
    }
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isOpen, strokeColor]);

  // Update stroke color when it changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = strokeColor;
      }
    }
  }, [strokeColor]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Reset context properties after resize
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  };

  const startDrawing = (e: React.PointerEvent) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Capture pointer to track outside canvas
    canvas.setPointerCapture(e.pointerId);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = (e: React.PointerEvent) => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) canvas.releasePointerCapture(e.pointerId);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Create a temporary canvas to crop or just send raw data
      // Sending raw data URL for now
      onSave(canvas.toDataURL('image/png'));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800">{t.signature.title}</h3>
            {strokeColor && strokeColor !== '#000000' && (
              <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: strokeColor }} title={`Stroke color: ${strokeColor}`} />
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 bg-slate-100 flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative" style={{ width: canvasWidth, height: canvasHeight, maxWidth: '100%' }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full touch-none cursor-crosshair"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={endDrawing}
              onPointerLeave={endDrawing}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 select-none">
                {t.signature.drawHere}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white gap-3">
          <button 
            onClick={clearSignature}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
          >
            <Eraser size={16} />
            {t.signature.clear}
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium text-sm"
            >
              {t.common.cancel}
            </button>
            <button 
              onClick={handleSave}
              disabled={!hasSignature}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-sm transition-all font-medium text-sm"
            >
              <Check size={16} />
              {t.signature.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};