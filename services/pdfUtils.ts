import { PDFDocument, rgb, StandardFonts, PDFPage, Color } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { FormField, MarkStyle, DocumentAttachment } from '../types';
import { isFieldVisible } from './formLogic';

// Helper to draw checkmark
const drawCheckmark = (page: PDFPage, x: number, y: number, width: number, height: number) => {
    const size = Math.min(width, height) * 0.6;
    const strokeWidth = 1.5;
    const color = rgb(0, 0, 0);
    
    const p1 = { x: x - size * 0.25, y: y }; 
    const p2 = { x: x - size * 0.05, y: y - size * 0.25 }; 
    const p3 = { x: x + size * 0.35, y: y + size * 0.30 };
    
    page.drawLine({ start: p1, end: p2, thickness: strokeWidth, color });
    page.drawLine({ start: p2, end: p3, thickness: strokeWidth, color });
};

// Helper to draw X mark
const drawXMark = (page: PDFPage, x: number, y: number, width: number, height: number) => {
    const size = Math.min(width, height) * 0.35;
    const strokeWidth = 1.5;
    const color = rgb(0, 0, 0);
    
    page.drawLine({ start: { x: x - size, y: y - size }, end: { x: x + size, y: y + size }, thickness: strokeWidth, color });
    page.drawLine({ start: { x: x - size, y: y + size }, end: { x: x + size, y: y - size }, thickness: strokeWidth, color });
};

// Helper to draw filled circle (dot)
const drawDot = (page: PDFPage, x: number, y: number, width: number, height: number) => {
    const radius = Math.min(width, height) * 0.25;
    page.drawCircle({ x, y, size: radius, color: rgb(0, 0, 0) });
};

// Helper to draw circle outline
const drawCircle = (page: PDFPage, x: number, y: number, width: number, height: number) => {
    const radius = Math.min(width, height) * 0.3;
    page.drawCircle({ x, y, size: radius, borderColor: rgb(0, 0, 0), borderWidth: 1.5 });
};

// Helper to draw filled square
const drawSquare = (page: PDFPage, x: number, y: number, width: number, height: number) => {
    const size = Math.min(width, height) * 0.4;
    page.drawRectangle({ x: x - size/2, y: y - size/2, width: size, height: size, color: rgb(0, 0, 0) });
};

// Draw mark based on style
const drawMark = (page: PDFPage, x: number, y: number, width: number, height: number, style: MarkStyle = 'checkmark') => {
    switch (style) {
        case 'none':
            // Don't draw anything
            break;
        case 'x':
            drawXMark(page, x, y, width, height);
            break;
        case 'circle':
            drawCircle(page, x, y, width, height);
            break;
        case 'square':
            drawSquare(page, x, y, width, height);
            break;
        case 'dot':
            drawDot(page, x, y, width, height);
            break;
        case 'checkmark':
        default:
            drawCheckmark(page, x, y, width, height);
            break;
    }
};

const getPageDimensions = (page: PDFPage) => {
    const cropBox = page.getCropBox() || page.getMediaBox();
    return {
        width: cropBox.width,
        height: cropBox.height,
        originX: cropBox.x,
        originY: cropBox.y
    };
};

const hexToRgb = (hex: string | undefined): Color | undefined => {
    if (!hex) return undefined;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? rgb(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ) : undefined;
};

// Helper to detect if text contains Hebrew characters
const containsHebrew = (text: string): boolean => {
  return /[\u0590-\u05FF]/.test(text);
};

export const saveFilledPDF = async (originalPdfBytes: ArrayBuffer, fields: FormField[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  
  // Register fontkit to enable custom font embedding
  pdfDoc.registerFontkit(fontkit);
  
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const scriptFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  
  // Load Hebrew font
  let hebrewFont: typeof font | undefined;
  try {
    const hebrewFontBytes = await fetch('/fonts/NotoSansHebrew-Regular.ttf').then(res => res.arrayBuffer());
    hebrewFont = await pdfDoc.embedFont(hebrewFontBytes);
  } catch (e) {
    console.error('Failed to load Hebrew font:', e);
  }

  for (const field of fields) {
    if (!isFieldVisible(field, fields)) continue;
    if (field.type === 'table-row') continue; 

    const pageIndex = field.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;
    const page = pages[pageIndex];
    
    const { width, height, originX, originY } = getPageDimensions(page);
    const fontSize = field.fontSize || 12;

    if (field.type === 'table') {
        let data: string[][] = [];
        try { data = JSON.parse(field.value || "[]"); } catch {}
        const customRows = fields.filter(f => f.parentFieldId === field.id && f.type === 'table-row');
        
        if (customRows.length > 0) {
            const sortedRows = customRows.sort((a, b) => (a.rowIndex || 0) - (b.rowIndex || 0));
            const rowsToBurn = sortedRows.slice(0, field.filledRows || 1);

            for (const row of rowsToBurn) {
                const rIdx = row.rowIndex || 0;
                (row.cells || []).forEach((cell, cIdx) => {
                    const cellValue = data[rIdx]?.[cIdx];
                    
                    const uiCellLeft = row.x + (cell.x / 100 * row.width);
                    const uiCellTop = row.y + (cell.y / 100 * row.height);
                    const uiCellWidth = (cell.width / 100 * row.width);
                    const uiCellHeight = (cell.height / 100 * row.height);

                    const pdfX = originX + (uiCellLeft / 100) * width;
                    const pdfH = (uiCellHeight / 100) * height;
                    const pdfW = (uiCellWidth / 100) * width;
                    const pdfY = originY + height - ((uiCellTop / 100) * height) - pdfH;
                    
                    if (cellValue) {
                        // Centered Vertical Alignment matches Flexbox 'center'
                        const textHeight = fontSize * 0.7; // Cap height approx
                        const textY = pdfY + (pdfH / 2) - (textHeight / 2); 

                        if (cell.type === 'checkbox') {
                            if (cellValue === 'true') {
                                const centerX = pdfX + (pdfW / 2);
                                const centerY = pdfY + (pdfH / 2);
                                drawMark(page, centerX, centerY, pdfW, pdfH, field.markStyle || 'checkmark');
                            }
                        } else {
                            const cellFont = (hebrewFont && containsHebrew(cellValue)) ? hebrewFont : font;
                            const textColor = hexToRgb(field.color) || rgb(0, 0, 0);
                            page.drawText(cellValue, { x: pdfX + 3, y: textY, size: fontSize, font: cellFont, color: textColor });
                        }
                    }
                });
            }
        } else {
            // Legacy Table
            const rowsToRender = field.filledRows || 1;
            const rowsCapacity = field.maxRows || 1;
            const cols = field.columns || [];
            const cellPadding = field.cellPadding || 2;
            const cellGap = field.cellGap || 0;
            const totalSlots = field.showHeaders ? rowsCapacity + 1 : rowsCapacity;
            
            const tableTopY = originY + height - ((field.y / 100) * height);
            const tableLeftX = originX + (field.x / 100) * width;
            const tableWidthAbs = (field.width / 100) * width;
            const tableHeightAbs = (field.height / 100) * height;
            const totalGapsH = Math.max(0, totalSlots - 1) * cellGap;
            const availableHeight = Math.max(0, tableHeightAbs - totalGapsH);
            const rowHeightAbs = availableHeight / totalSlots;

            for (let r = 0; r < rowsToRender; r++) {
                const visualRowIndex = field.showHeaders ? r + 1 : r;
                const rowTopY = tableTopY - (visualRowIndex * (rowHeightAbs + cellGap));
                let currentColX = tableLeftX;
                cols.forEach((col, cIdx) => {
                    const colWidthAbs = (col.width / 100) * tableWidthAbs;
                    const cellValue = data[r]?.[cIdx];
                    if (cellValue) {
                        const cellCenterY = rowTopY - (rowHeightAbs / 2);
                        if (col.type === 'checkbox' || col.type === 'radio') {
                            if (cellValue === 'true') {
                                 const centerX = currentColX + (colWidthAbs/2);
                                 drawMark(page, centerX, cellCenterY, colWidthAbs, rowHeightAbs, field.markStyle || 'checkmark');
                            }
                        } else {
                            const textHeight = fontSize * 0.7;
                            const textY = cellCenterY - (textHeight / 2);
                            const cellFont = (hebrewFont && containsHebrew(cellValue)) ? hebrewFont : font;
                            const textColor = hexToRgb(field.color) || rgb(0, 0, 0);
                            page.drawText(cellValue, { x: currentColX + cellPadding + 1, y: textY, size: fontSize, font: cellFont, color: textColor, maxWidth: colWidthAbs - (cellPadding * 2) });
                        }
                    }
                    currentColX += colWidthAbs;
                });
            }
        }

    } else if (field.type === 'signature' && field.value.startsWith('data:image')) {
        try {
            const pngImage = await pdfDoc.embedPng(field.value);
            const { width: imgW, height: imgH } = pngImage.scaleToFit((field.width / 100) * width, (field.height / 100) * height);
            const fieldX = originX + (field.x / 100) * width;
            const fieldY = originY + height - ((field.y / 100) * height) - ((field.height / 100) * height);
            
            // Draw background if exists
             if (field.backgroundColor || (field.borderWidth && field.borderWidth > 0)) {
                page.drawRectangle({
                    x: fieldX, y: fieldY,
                    width: (field.width / 100) * width,
                    height: (field.height / 100) * height,
                    color: hexToRgb(field.backgroundColor),
                    borderColor: hexToRgb(field.borderColor),
                    borderWidth: field.borderWidth || 0,
                    opacity: field.backgroundColor ? (field.opacity ?? 1) : 0,
                });
            }

            page.drawImage(pngImage, { 
                x: fieldX + ((field.width / 100) * width - imgW) / 2, 
                y: fieldY + ((field.height / 100) * height - imgH) / 2, 
                width: imgW, 
                height: imgH 
            });
        } catch (e) { console.error('Failed to embed signature', e); }

    } else {
        // GENERIC TEXT/NUMBER/DATE/SELECT RENDERING
        const x = originX + (field.x / 100) * width;
        const fieldHeightPoints = (field.height / 100) * height;
        const y = originY + height - ((field.y / 100) * height) - fieldHeightPoints;
        const fieldWidthPoints = (field.width / 100) * width;
        const padding = field.padding || 0;

         // Draw Box/Background/Border
         if (field.backgroundColor || (field.borderWidth && field.borderWidth > 0)) {
             page.drawRectangle({
                 x, y,
                 width: fieldWidthPoints,
                 height: fieldHeightPoints,
                 color: hexToRgb(field.backgroundColor),
                 borderColor: hexToRgb(field.borderColor),
                 borderWidth: field.borderWidth || 0,
                 opacity: field.backgroundColor ? (field.opacity ?? 1) : 0,
             });
         }

        if (field.value) {
            let fontToUse = field.type === 'signature' ? scriptFont : font;
            const sizeToUse = field.type === 'signature' ? fontSize * 1.5 : fontSize;
            
            // Process value based on field type
            let displayValue = field.value.toString();
            
            // For date fields: optionally remove separators
            if (field.type === 'date' && field.dateHideSeparator) {
                displayValue = displayValue.replace(/\//g, '');
            }
            
            // Use Hebrew font if text contains Hebrew characters
            if (hebrewFont && containsHebrew(displayValue)) {
                fontToUse = hebrewFont;
            }
            
            // Calculate Text Alignment X
            const textWidth = fontToUse.widthOfTextAtSize(displayValue, sizeToUse);
            let textX = x + padding; // Left default
            
            if (field.textAlign === 'center') {
                textX = x + (fieldWidthPoints / 2) - (textWidth / 2);
            } else if (field.textAlign === 'right') {
                textX = x + fieldWidthPoints - textWidth - padding;
            }

            // Calculate Vertical Alignment (Centered)
            const textHeight = sizeToUse * 0.7; 
            let textY = y + (fieldHeightPoints / 2) - (textHeight / 2);
            const textColor = hexToRgb(field.color) || rgb(0, 0, 0);
            
            if (field.type === 'textarea') {
                // Top Align for TextArea with padding
                textY = y + fieldHeightPoints - sizeToUse - padding;
                page.drawText(displayValue, {
                    x: x + padding,
                    y: textY,
                    size: sizeToUse,
                    font: fontToUse,
                    color: textColor,
                    maxWidth: fieldWidthPoints - (padding * 2),
                    lineHeight: sizeToUse * 1.35, // Match Web line-height 1.35
                });
            } else if (field.type === 'number' && field.digitPositions && field.digitPositions.length > 0) {
                // Number field with individual digit positions
                const digits = displayValue.replace(/[^0-9]/g, ''); // Extract only digits
                for (let i = 0; i < digits.length && i < field.digitPositions.length; i++) {
                    const pos = field.digitPositions[i];
                    // Position is relative to field, convert to absolute PDF coordinates
                    const digitX = x + (pos.x / 100) * fieldWidthPoints;
                    const digitY = y + fieldHeightPoints - (pos.y / 100) * fieldHeightPoints - (textHeight / 2);
                    page.drawText(digits[i], { x: digitX, y: digitY, size: sizeToUse, font: fontToUse, color: textColor });
                }
            } else if (field.letterSpacing && field.letterSpacing > 0) {
                 // Letter Spacing Logic
                 let currentX = textX;
                 for (let i = 0; i < displayValue.length; i++) {
                     const char = displayValue[i];
                     page.drawText(char, { x: currentX, y: textY, size: sizeToUse, font: fontToUse, color: textColor });
                     const charWidth = fontToUse.widthOfTextAtSize(char, sizeToUse);
                     currentX += charWidth + field.letterSpacing;
                 }
            } else {
                 // Standard Line
                 // check if the field type is radio 
                 if(field.type !== "radio") {
                     page.drawText(displayValue, { x: textX, y: textY, size: sizeToUse, font: fontToUse, color: textColor });
                 }
            }
        }
    } 
    
    // RADIO & CHECKBOX OPTIONS
    if ((field.type === 'radio' || field.type === 'checkbox') && field.options) {
         field.options.forEach(opt => {
            const optX = originX + (opt.x / 100) * width;
            const optH = (opt.height / 100) * height;
            const optW = (opt.width / 100) * width;
            const optY = originY + height - ((opt.y / 100) * height) - optH;
            
            // Draw background and border for each option
            if (field.backgroundColor || (field.borderWidth && field.borderWidth > 0)) {
                if (field.type === 'radio') {
                    // Draw circle background and border
                    const centerX = optX + optW / 2;
                    const centerY = optY + optH / 2;
                    const radius = Math.min(optW, optH) / 2;
                    
                    if (field.backgroundColor) {
                        page.drawCircle({
                            x: centerX,
                            y: centerY,
                            size: radius,
                            color: hexToRgb(field.backgroundColor),
                            opacity: field.opacity ?? 1,
                        });
                    }
                    
                    if (field.borderWidth && field.borderWidth > 0) {
                        page.drawCircle({
                            x: centerX,
                            y: centerY,
                            size: radius,
                            borderColor: hexToRgb(field.borderColor) || rgb(0, 0, 0),
                            borderWidth: field.borderWidth,
                        });
                    }
                } else {
                    // Draw rectangle background and border
                    page.drawRectangle({
                        x: optX,
                        y: optY,
                        width: optW,
                        height: optH,
                        color: hexToRgb(field.backgroundColor),
                        borderColor: hexToRgb(field.borderColor),
                        borderWidth: field.borderWidth || 0,
                        opacity: field.backgroundColor ? (field.opacity ?? 1) : 0,
                    });
                }
            }
            
            // Draw selection indicator
            const isSelected = field.type === 'radio' ? field.value === opt.value : field.value.split(',').includes(opt.value);
            if (isSelected) {
                const centerX = optX + optW / 2;
                const centerY = optY + optH / 2;
                
                // Draw mark based on field's markStyle
                drawMark(page, centerX, centerY, optW, optH, field.markStyle || 'checkmark');
            }
         });
    }
  }

  // Add document attachments as new pages
  const fieldsWithAttachments = fields.filter(f => f.attachments && f.attachments.length > 0);
  
  if (fieldsWithAttachments.length > 0) {
    const attachmentFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    for (const field of fieldsWithAttachments) {
      if (!field.attachments) continue;
      
      for (const attachment of field.attachments) {
        try {
          // Create a new page for each attachment
          const newPage = pdfDoc.addPage([595.28, 841.89]); // A4 size
          const { width: pageWidth, height: pageHeight } = newPage.getSize();
          const margin = 40;
          const contentWidth = pageWidth - (margin * 2);
          
          // Draw header with field name
          const headerText = field.documentRequirement?.label || `Attachment for: ${field.name}`;
          newPage.drawText(headerText, {
            x: margin,
            y: pageHeight - margin - 20,
            size: 14,
            font: attachmentFont,
            color: rgb(0.2, 0.2, 0.2),
          });
          
          // Draw file info
          const fileInfo = `File: ${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`;
          newPage.drawText(fileInfo, {
            x: margin,
            y: pageHeight - margin - 40,
            size: 10,
            font: regularFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          
          // Draw separator line
          newPage.drawLine({
            start: { x: margin, y: pageHeight - margin - 55 },
            end: { x: pageWidth - margin, y: pageHeight - margin - 55 },
            thickness: 0.5,
            color: rgb(0.8, 0.8, 0.8),
          });
          
          const imageStartY = pageHeight - margin - 80;
          const maxImageHeight = imageStartY - margin;
          
          // Embed the attachment
          if (attachment.type.startsWith('image/')) {
            let embeddedImage;
            
            if (attachment.type === 'image/png') {
              embeddedImage = await pdfDoc.embedPng(attachment.dataUrl);
            } else if (attachment.type === 'image/jpeg' || attachment.type === 'image/jpg') {
              embeddedImage = await pdfDoc.embedJpg(attachment.dataUrl);
            } else {
              // For other image types, try to convert via canvas
              const img = await loadImageFromDataUrl(attachment.dataUrl);
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                const pngDataUrl = canvas.toDataURL('image/png');
                embeddedImage = await pdfDoc.embedPng(pngDataUrl);
              }
            }
            
            if (embeddedImage) {
              // Scale image to fit within content area
              const { width: imgW, height: imgH } = embeddedImage.scaleToFit(contentWidth, maxImageHeight);
              
              // Center the image horizontally
              const imgX = margin + (contentWidth - imgW) / 2;
              const imgY = imageStartY - imgH;
              
              newPage.drawImage(embeddedImage, {
                x: imgX,
                y: imgY,
                width: imgW,
                height: imgH,
              });
            }
          } else if (attachment.type === 'application/pdf') {
            // For PDF attachments, copy ALL pages from the attached PDF
            try {
              const attachmentPdfBytes = await dataUrlToArrayBuffer(attachment.dataUrl);
              const attachmentPdf = await PDFDocument.load(attachmentPdfBytes);
              const totalPages = attachmentPdf.getPageCount();
              
              // Remove the placeholder page we created
              const placeholderPageIndex = pdfDoc.getPageCount() - 1;
              pdfDoc.removePage(placeholderPageIndex);
              
              // Copy all pages from the attached PDF
              const pageIndices = Array.from({ length: totalPages }, (_, i) => i);
              const copiedPages = await pdfDoc.copyPages(attachmentPdf, pageIndices);
              
              // Add each copied page with a header on the first page
              for (let i = 0; i < copiedPages.length; i++) {
                const copiedPage = copiedPages[i];
                pdfDoc.addPage(copiedPage);
                
                // Add header info only on the first page of this attachment
                if (i === 0) {
                  const { width: cpWidth, height: cpHeight } = copiedPage.getSize();
                  const headerY = cpHeight - 15;
                  
                  // Draw a small header bar at the top
                  copiedPage.drawRectangle({
                    x: 0,
                    y: cpHeight - 25,
                    width: cpWidth,
                    height: 25,
                    color: rgb(0.95, 0.95, 0.95),
                    opacity: 0.9,
                  });
                  
                  const headerLabel = field.documentRequirement?.label || field.name;
                  copiedPage.drawText(`📎 ${headerLabel} - ${attachment.name} (${totalPages} page${totalPages > 1 ? 's' : ''})`, {
                    x: 10,
                    y: headerY - 7,
                    size: 8,
                    font: regularFont,
                    color: rgb(0.3, 0.3, 0.3),
                  });
                }
              }
            } catch (pdfError) {
              // If PDF embedding fails, show a placeholder message on the existing page
              newPage.drawText('PDF Document Attached', {
                x: margin,
                y: imageStartY - 50,
                size: 16,
                font: regularFont,
                color: rgb(0.5, 0.5, 0.5),
              });
              newPage.drawText(`File: ${attachment.name}`, {
                x: margin,
                y: imageStartY - 75,
                size: 12,
                font: regularFont,
                color: rgb(0.6, 0.6, 0.6),
              });
              newPage.drawText('(Could not embed PDF - file may be corrupted or protected)', {
                x: margin,
                y: imageStartY - 95,
                size: 10,
                font: regularFont,
                color: rgb(0.7, 0.4, 0.4),
              });
              console.error('Failed to embed PDF attachment:', pdfError);
            }
          }
        } catch (e) {
          console.error('Failed to embed attachment:', attachment.name, e);
        }
      }
    }
  }

  return pdfDoc.save();
};

// Helper function to load image from data URL
const loadImageFromDataUrl = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
};

// Helper function to convert data URL to ArrayBuffer
const dataUrlToArrayBuffer = async (dataUrl: string): Promise<ArrayBuffer> => {
  const response = await fetch(dataUrl);
  return response.arrayBuffer();
};

export const downloadBlob = (data: Uint8Array, filename: string) => {
  const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};