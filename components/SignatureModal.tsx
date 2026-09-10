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

// Drawing stroke width, in CSS pixels
const STROKE_WIDTH = 2.5;

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave, canvasWidth = 500, canvasHeight = 300, strokeColor = '#000000' }) => {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      if (!rect.width || !rect.height) return;

      // Back the canvas with a higher resolution bitmap so the signature stays
      // sharp once it is scaled onto the PDF
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      // Reset context properties after resize
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Keep drawing coordinates in CSS pixels
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = STROKE_WIDTH;
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
        // clearRect works in the transformed (CSS pixel) space
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        setHasSignature(false);
      }
    }
  };

  // Crops the empty margins around the drawn strokes. Without this the exported
  // PNG is the whole (mostly blank) canvas, so the signature ends up rendered
  // tiny inside the PDF field once it is scaled to fit.
  const cropToInk = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !canvas.width || !canvas.height) return canvas.toDataURL('image/png');

    let pixels: ImageData;
    try {
      pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch {
      return canvas.toDataURL('image/png');
    }

    const { data } = pixels;
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        // Any non-transparent pixel counts as ink
        if (data[(y * canvas.width + x) * 4 + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Nothing was drawn - fall back to the full canvas
    if (maxX < 0 || maxY < 0) return canvas.toDataURL('image/png');

    // Leave a little breathing room so the round stroke caps aren't clipped
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const pad = Math.ceil(STROKE_WIDTH * dpr);
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(canvas.width - 1, maxX + pad);
    maxY = Math.min(canvas.height - 1, maxY + pad);

    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;

    const cropped = document.createElement('canvas');
    cropped.width = cropWidth;
    cropped.height = cropHeight;
    const croppedCtx = cropped.getContext('2d');
    if (!croppedCtx) return canvas.toDataURL('image/png');
    croppedCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    return cropped.toDataURL('image/png');
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(cropToInk(canvas));
      onClose();
    }
  };

  if (!isOpen) return null;

  // Calculate responsive canvas dimensions
  const responsiveWidth = isMobile ? Math.min(canvasWidth, window.innerWidth - 48) : canvasWidth;
  const responsiveHeight = isMobile ? Math.min(canvasHeight, 200) : canvasHeight;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-2xl md:rounded-xl shadow-2xl w-full md:max-w-lg flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-200 max-h-[90vh] md:max-h-none safe-area-inset-bottom">
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 text-base md:text-lg">{t.signature.title}</h3>
            {strokeColor && strokeColor !== '#000000' && (
              <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: strokeColor }} title={`Stroke color: ${strokeColor}`} />
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 active:bg-slate-300 transition-colors touch-manipulation">
            <X size={22} />
          </button>
        </div>
        
        <div className="p-3 md:p-4 bg-slate-100 flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-slate-300 overflow-hidden relative w-full" style={{ maxWidth: responsiveWidth, height: responsiveHeight }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full touch-none cursor-crosshair"
              style={{ touchAction: 'none' }}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={endDrawing}
              onPointerLeave={endDrawing}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 select-none text-sm md:text-base">
                {t.signature.drawHere}
              </div>
            )}
          </div>
        </div>

        <div className="p-3 md:p-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between bg-white gap-3">
          <button 
            onClick={clearSignature}
            className="flex items-center justify-center gap-2 px-4 py-3 md:py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl md:rounded-lg transition-colors font-medium text-base md:text-sm touch-manipulation order-2 md:order-1"
          >
            <Eraser size={18} />
            {t.signature.clear}
          </button>
          <div className="flex items-center gap-2 md:gap-3 order-1 md:order-2">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-4 py-3 md:py-2 text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-xl md:rounded-lg transition-colors font-medium text-base md:text-sm touch-manipulation"
            >
              {t.common.cancel}
            </button>
            <button 
              onClick={handleSave}
              disabled={!hasSignature}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl md:rounded-lg shadow-sm transition-all font-medium text-base md:text-sm touch-manipulation"
            >
              <Check size={18} />
              {t.signature.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};