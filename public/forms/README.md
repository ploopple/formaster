# Forms Directory

Place your PDF files here to use them with form templates.

## Usage

1. Add your PDF files to this directory (e.g., `application.pdf`, `invoice.pdf`)
2. Update `formsData.ts` with the form configuration
3. Reference the PDF path as `/forms/your-file.pdf`

## Example

If you have a file `public/forms/application.pdf`, reference it in formsData.ts as:

```typescript
{
  id: "app-form-1",
  title: "Application Form",
  description: "Standard application form",
  fileName: "/forms/application.pdf",
  fields: [...],
  createdAt: "2024-01-01T00:00:00.000Z",
  category: "Applications"
}
```
