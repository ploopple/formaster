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

### Firebase Setup (Optional)

To enable user authentication and cloud storage for form data:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google sign-in)
3. Create a Firestore database
4. Copy `.env.local.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Note**: The app works without Firebase - form data will be saved to localStorage instead.

### Firestore Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Form templates - owners can edit, anyone can read public forms
    match /formTemplates/{formId} {
      allow read: if resource.data.isPublic == true || 
                    (request.auth != null && request.auth.uid == resource.data.ownerId);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }
    
    // Form states - users can only access their own filled form data
    match /formStates/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
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
