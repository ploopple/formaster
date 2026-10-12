import type { FieldSection, FormField } from '../types';

const DATABASE_NAME = 'drajonz-local-pdfs';
const DATABASE_VERSION = 1;
const FORMS_STORE = 'forms';
const PDF_STORE = 'savedPdfs';

export interface FormTemplateData {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fields: FormField[];
  sections: FieldSection[];
  globalDrawColor: string;
  category: string;
  country: string;
  createdAt: { seconds: number };
  updatedAt: { seconds: number };
  pdf: Blob;
}

export interface SavedPdfData {
  id: string;
  name: string;
  blob: Blob;
  savedAt: number;
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('Browser storage is unavailable'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FORMS_STORE)) db.createObjectStore(FORMS_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(PDF_STORE)) db.createObjectStore(PDF_STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open browser storage'));
  });
}

async function withStore<T>(storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const request = operation(transaction.objectStore(storeName));
    let result: T | undefined;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error || new Error('Browser storage operation failed'));
    transaction.oncomplete = () => { db.close(); resolve(result as T); };
    transaction.onerror = () => { db.close(); reject(transaction.error || new Error('Browser storage operation failed')); };
    transaction.onabort = () => { db.close(); reject(transaction.error || new Error('Browser storage operation was cancelled')); };
  });
}

const now = () => ({ seconds: Math.floor(Date.now() / 1000) });

export const localForms = {
  list: async (): Promise<FormTemplateData[]> => {
    const forms = await withStore<FormTemplateData[]>(FORMS_STORE, 'readonly', store => store.getAll());
    return forms.sort((a, b) => b.updatedAt.seconds - a.updatedAt.seconds);
  },
  get: (id: string) => withStore<FormTemplateData | undefined>(FORMS_STORE, 'readonly', store => store.get(id)),
  create: async (data: Omit<FormTemplateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<FormTemplateData> => {
    const timestamp = now();
    const form: FormTemplateData = { ...data, id: crypto.randomUUID(), createdAt: timestamp, updatedAt: timestamp };
    await withStore(FORMS_STORE, 'readwrite', store => store.add(form));
    return form;
  },
  update: async (id: string, updates: Partial<Omit<FormTemplateData, 'id' | 'createdAt'>>): Promise<FormTemplateData> => {
    const form = await localForms.get(id);
    if (!form) throw new Error('Form was not found in this browser');
    const updated = { ...form, ...updates, updatedAt: now() };
    await withStore(FORMS_STORE, 'readwrite', store => store.put(updated));
    return updated;
  },
  delete: (id: string) => withStore(FORMS_STORE, 'readwrite', store => store.delete(id)),
  savePdf: async (name: string, blob: Blob): Promise<SavedPdfData> => {
    const saved: SavedPdfData = { id: crypto.randomUUID(), name, blob, savedAt: Date.now() };
    await withStore(PDF_STORE, 'readwrite', store => store.add(saved));
    return saved;
  },
  listPdfs: async (): Promise<SavedPdfData[]> => {
    const pdfs = await withStore<SavedPdfData[]>(PDF_STORE, 'readonly', store => store.getAll());
    return pdfs.sort((a, b) => b.savedAt - a.savedAt);
  },
  deletePdf: (id: string) => withStore(PDF_STORE, 'readwrite', store => store.delete(id)),
};
