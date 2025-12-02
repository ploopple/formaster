import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export interface PageSettings {
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  backgroundColor?: string;
}

export interface FormElement {
  id: string;
  type: 'text-label' | 'text-field' | 'checkbox' | 'radio-group' | 'line' | 'rectangle' | 'image' | 'date-field' | 'signature-field' | 'number-field' | 'textarea-field' | 'select-field' | 'divider' | 'circle';
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  page: number;
  zIndex?: number; // Layer order
  locked?: boolean; // Prevent editing
  // Text properties
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  color?: string;
  // Field properties
  fieldName?: string;
  placeholder?: string;
  required?: boolean;
  // Shape properties
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  // Radio/Checkbox
  options?: { id: string; label: string; x: number; y: number; value?: string }[];
  // Line properties
  lineWidth?: number;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  // Date field
  dateFormat?: string;
  // Select field
  selectOptions?: string[];
  // Image
  imageData?: string; // base64
  // Rotation
  rotation?: number;
}

export const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89, label: 'A4 (210 × 297 mm)' },
  LETTER: { width: 612, height: 792, label: 'Letter (8.5 × 11 in)' },
  LEGAL: { width: 612, height: 1008, label: 'Legal (8.5 × 14 in)' },
  A3: { width: 841.89, height: 1190.55, label: 'A3 (297 × 420 mm)' },
  A5: { width: 419.53, height: 595.28, label: 'A5 (148 × 210 mm)' },
};

export type PageSizeKey = keyof typeof PAGE_SIZES;

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ) : rgb(0, 0, 0);
};

export const generateBlankPDF = async (
  pageCount: number = 1,
  pageSize: PageSizeKey = 'A4',
  elements: FormElement[] = [],
  pageSettings?: Partial<PageSettings>
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  
  const size = PAGE_SIZES[pageSize];
  const settings: PageSettings = {
    width: size.width,
    height: size.height,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 40,
    ...pageSettings,
  };

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Create pages
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage([settings.width, settings.height]);
    
    // Draw background if specified
    if (settings.backgroundColor) {
      page.drawRectangle({
        x: 0,
        y: 0,
        width: settings.width,
        height: settings.height,
        color: hexToRgb(settings.backgroundColor),
      });
    }
  }

  // Draw elements on their respective pages
  const pages = pdfDoc.getPages();
  
  // Sort elements by z-index so lower z-index elements are drawn first (appear behind)
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  for (const element of sortedElements) {
    const pageIndex = element.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;
    
    const page = pages[pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();
    
    // Convert percentage to absolute coordinates
    const x = (element.x / 100) * pageWidth;
    const y = pageHeight - ((element.y / 100) * pageHeight) - ((element.height / 100) * pageHeight);
    const width = (element.width / 100) * pageWidth;
    const height = (element.height / 100) * pageHeight;
    
    const currentFont = element.fontWeight === 'bold' ? boldFont : font;
    const fontSize = element.fontSize || 12;
    const textColor = element.color ? hexToRgb(element.color) : rgb(0, 0, 0);

    switch (element.type) {
      case 'text-label':
        if (element.text) {
          let textX = x;
          const textWidth = currentFont.widthOfTextAtSize(element.text, fontSize);
          
          if (element.textAlign === 'center') {
            textX = x + (width - textWidth) / 2;
          } else if (element.textAlign === 'right') {
            textX = x + width - textWidth;
          }
          
          page.drawText(element.text, {
            x: textX,
            y: y + height / 2 - fontSize / 3,
            size: fontSize,
            font: currentFont,
            color: textColor,
          });
        }
        break;

      case 'text-field':
        // Draw field background
        page.drawRectangle({
          x,
          y,
          width,
          height,
          color: element.backgroundColor ? hexToRgb(element.backgroundColor) : rgb(1, 1, 1),
          borderColor: element.borderColor ? hexToRgb(element.borderColor) : rgb(0.7, 0.7, 0.7),
          borderWidth: element.borderWidth || 1,
        });
        
        // Draw placeholder text if provided
        if (element.placeholder) {
          page.drawText(element.placeholder, {
            x: x + 4,
            y: y + height / 2 - fontSize / 3,
            size: fontSize,
            font: font,
            color: rgb(0.6, 0.6, 0.6),
          });
        }
        break;

      case 'checkbox':
        // Draw checkbox square
        page.drawRectangle({
          x,
          y,
          width: Math.min(width, height),
          height: Math.min(width, height),
          borderColor: element.borderColor ? hexToRgb(element.borderColor) : rgb(0, 0, 0),
          borderWidth: element.borderWidth || 1,
        });
        break;

      case 'radio-group':
        // Draw radio circles for each option
        if (element.options) {
          for (const option of element.options) {
            const optX = x + (option.x / 100) * width;
            const optY = y + height - (option.y / 100) * height;
            const radius = Math.min(width, height) * 0.15;
            
            page.drawCircle({
              x: optX + radius,
              y: optY - radius,
              size: radius,
              borderColor: element.borderColor ? hexToRgb(element.borderColor) : rgb(0, 0, 0),
              borderWidth: element.borderWidth || 1,
            });
            
            // Draw label
            if (option.label) {
              page.drawText(option.label, {
                x: optX + radius * 2.5,
                y: optY - radius - fontSize / 3,
                size: fontSize,
                font: font,
                color: textColor,
              });
            }
          }
        }
        break;

      case 'line':
        page.drawLine({
          start: { x, y: y + height / 2 },
          end: { x: x + width, y: y + height / 2 },
          thickness: element.lineWidth || 1,
          color: element.color ? hexToRgb(element.color) : rgb(0, 0, 0),
        });
        break;

      case 'rectangle':
        page.drawRectangle({
          x,
          y,
          width,
          height,
          color: element.backgroundColor ? hexToRgb(element.backgroundColor) : undefined,
          borderColor: element.borderColor ? hexToRgb(element.borderColor) : rgb(0, 0, 0),
          borderWidth: element.borderWidth || 1,
        });
        break;

      case 'circle':
        const radius = Math.min(width, height) / 2;
        page.drawCircle({
          x: x + width / 2,
          y: y + height / 2,
          size: radius,
          color: element.backgroundColor ? hexToRgb(element.backgroundColor) : undefined,
          borderColor: element.borderColor ? hexToRgb(element.borderColor) : rgb(0, 0, 0),
          borderWidth: element.borderWidth || 1,
        });
        break;

      case 'image':
        if (element.imageData) {
          try {
            // Extract base64 data from data URL
            const base64Data = element.imageData.split(',')[1];
            const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            
            // Determine image type and embed
            let image;
            if (element.imageData.includes('image/png')) {
              image = await pdfDoc.embedPng(imageBytes);
            } else if (element.imageData.includes('image/jpeg') || element.imageData.includes('image/jpg')) {
              image = await pdfDoc.embedJpg(imageBytes);
            } else {
              // Try PNG first, then JPG
              try {
                image = await pdfDoc.embedPng(imageBytes);
              } catch {
                image = await pdfDoc.embedJpg(imageBytes);
              }
            }
            
            // Draw the image
            page.drawImage(image, {
              x,
              y,
              width,
              height,
            });
          } catch (error) {
            console.error('Failed to embed image:', error);
            // Draw placeholder rectangle if image fails
            page.drawRectangle({
              x,
              y,
              width,
              height,
              borderColor: rgb(0.8, 0.8, 0.8),
              borderWidth: 1,
            });
          }
        }
        break;
    }
  }

  return pdfDoc.save();
};

// Generate a simple form template PDF
export const generateFormTemplatePDF = async (
  title: string,
  fields: { label: string; type: 'text' | 'checkbox' | 'date' | 'signature' }[],
  pageSize: PageSizeKey = 'A4'
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const size = PAGE_SIZES[pageSize];
  const page = pdfDoc.addPage([size.width, size.height]);
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const margin = 50;
  const { width, height } = page.getSize();
  let currentY = height - margin;
  
  // Draw title
  page.drawText(title, {
    x: margin,
    y: currentY,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  currentY -= 50;
  
  // Draw fields
  const fieldHeight = 25;
  const labelWidth = 150;
  const inputWidth = width - margin * 2 - labelWidth - 20;
  
  for (const field of fields) {
    if (currentY < margin + 50) {
      // Add new page if needed
      break;
    }
    
    // Draw label
    page.drawText(field.label + ':', {
      x: margin,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    const inputX = margin + labelWidth;
    
    if (field.type === 'checkbox') {
      // Draw checkbox
      page.drawRectangle({
        x: inputX,
        y: currentY - 5,
        width: 15,
        height: 15,
        borderColor: rgb(0.5, 0.5, 0.5),
        borderWidth: 1,
      });
    } else if (field.type === 'signature') {
      // Draw signature line
      page.drawLine({
        start: { x: inputX, y: currentY - 5 },
        end: { x: inputX + inputWidth, y: currentY - 5 },
        thickness: 1,
        color: rgb(0.5, 0.5, 0.5),
      });
      page.drawText('Sign here', {
        x: inputX,
        y: currentY - 20,
        size: 8,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
      });
    } else {
      // Draw text input box
      page.drawRectangle({
        x: inputX,
        y: currentY - 10,
        width: inputWidth,
        height: fieldHeight,
        borderColor: rgb(0.7, 0.7, 0.7),
        borderWidth: 1,
      });
    }
    
    currentY -= 45;
  }
  
  return pdfDoc.save();
};