# Application Routes

## Pages

### `/` - Home Page
- Landing page with two main options:
  - Browse form templates
  - Upload new PDF
- Clean, centered layout with call-to-action buttons

### `/templates` - Form Templates Browser
- Browse all available form templates
- Search functionality
- Category filtering
- Click a template to load it in the editor (fill mode)
- Back button to return home

### `/editor` - PDF Editor & Form Filler
- Two modes:
  - **Editor Mode**: Create and position form fields on PDF
  - **Fill Mode**: Fill out form fields and download result
- Features:
  - Visual field editor with drag & drop
  - Field properties sidebar
  - Undo/Redo support
  - Keyboard shortcuts
  - Field validation
  - Export as JSON
  - Download filled PDF
- Query params:
  - `?mode=fill` - Opens in fill mode (used when coming from templates)

## Navigation Flow

```
Home (/)
├── Browse Templates → /templates
│   └── Select Template → /editor?mode=fill
└── Upload PDF → /editor (editor mode)
```

## Session Storage

The app uses `sessionStorage` to pass form template data from `/templates` to `/editor`:
- Key: `selectedForm`
- Value: JSON stringified `FormTemplate` object
- Automatically cleared after loading in editor
