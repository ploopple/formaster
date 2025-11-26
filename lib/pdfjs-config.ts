'use client';

import { pdfjs } from 'react-pdf';

// Configure PDF.js worker - must happen before any PDF rendering
if (typeof window !== 'undefined') {
  // Use jsdelivr CDN which is more reliable with Next.js
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  console.log('PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
}

export { pdfjs };
