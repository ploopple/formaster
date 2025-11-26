# Smart PDF Filler

A Next.js application for creating interactive PDF forms with a visual editor and form filling capabilities.

## Features

- **Visual PDF Editor**: Draw and position form fields directly on PDF documents
- **Form Templates**: Browse and use pre-configured form templates
- **Multiple Field Types**: Text, number, date, select, radio, checkbox, signature, and table fields
- **Conditional Logic**: Show/hide fields based on other field values
- **Validation**: Built-in field validation with error messages
- **Undo/Redo**: Full history management for editing
- **Keyboard Shortcuts**: Efficient editing with keyboard controls
- **Export**: Download filled PDFs or export form configurations as JSON

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
app/
├── page.tsx           # Home page with upload/template options
├── editor/page.tsx    # PDF editor and form filler
└── templates/page.tsx # Form templates browser

components/
├── PDFViewer.tsx      # PDF rendering and field interaction
├── Sidebar.tsx        # Field properties and form controls
├── FormsList.tsx      # Template browser
└── ...

services/
├── pdfUtils.ts        # PDF generation and manipulation
├── formLogic.ts       # Conditional field logic
└── validationService.ts # Field validation
```

## Usage

1. **Home Page** (`/`): Choose to upload a new PDF or browse templates
2. **Templates** (`/templates`): Select from pre-configured form templates
3. **Editor** (`/editor`): 
   - **Editor Mode**: Create and position form fields on the PDF
   - **Fill Mode**: Fill out the form fields and download the result

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
