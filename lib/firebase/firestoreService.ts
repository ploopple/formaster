import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { FormField, FieldSection } from '../../types';

// Collection names
const FORM_TEMPLATES_COLLECTION = 'formTemplates';
const FORM_STATES_COLLECTION = 'formStates';

// Helper to recursively remove undefined values from objects/arrays
// Firestore doesn't accept undefined values
function removeUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefined(item)) as T;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

export interface FormTemplateData {
  id: string;
  title: string;
  description: string;
  fileName: string;
  pdfUrl?: string; // URL to stored PDF if uploaded
  fields: FormField[];
  sections?: FieldSection[];
  globalDrawColor?: string;
  category?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ownerId: string; // User who created the form
  ownerEmail?: string;
  isPublic: boolean; // Whether others can fill this form
}

export interface SavedFormState {
  id: string;
  formId: string;
  userId: string;
  fields: FormField[];
  sections: FieldSection[];
  globalDrawColor: string;
  savedAt: Timestamp;
  updatedAt: Timestamp;
}

export const firestoreService = {
  // ==================== FORM TEMPLATES ====================
  
  // Create a new form template
  createFormTemplate: async (
    ownerId: string,
    ownerEmail: string,
    title: string,
    description: string,
    fileName: string,
    fields: FormField[],
    sections?: FieldSection[],
    globalDrawColor?: string,
    category?: string,
    isPublic: boolean = true
  ): Promise<string> => {
    if (!db) throw new Error('Firebase is not configured');
    const formId = doc(collection(db, FORM_TEMPLATES_COLLECTION)).id;
    const docRef = doc(db, FORM_TEMPLATES_COLLECTION, formId);
    
    await setDoc(docRef, {
      id: formId,
      title,
      description,
      fileName,
      fields,
      sections: sections || [],
      globalDrawColor: globalDrawColor || '#000000',
      category: category || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ownerId,
      ownerEmail,
      isPublic,
    });
    
    return formId;
  },

  // Update a form template (only owner can update)
  updateFormTemplate: async (
    formId: string,
    ownerId: string,
    updates: Partial<Omit<FormTemplateData, 'id' | 'createdAt' | 'ownerId'>>
  ): Promise<void> => {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, FORM_TEMPLATES_COLLECTION, formId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Form not found');
    }
    
    const formData = docSnap.data() as FormTemplateData;
    if (formData.ownerId !== ownerId) {
      throw new Error('You do not have permission to edit this form');
    }
    
    // Deep clean to remove all undefined values - Firestore doesn't accept undefined
    const cleanedUpdates = removeUndefined(updates);
    
    await updateDoc(docRef, {
      ...cleanedUpdates,
      updatedAt: serverTimestamp(),
    });
  },

  // Get a form template by ID
  getFormTemplate: async (formId: string): Promise<FormTemplateData | null> => {
    if (!db) return null;
    const docRef = doc(db, FORM_TEMPLATES_COLLECTION, formId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FormTemplateData;
    }
    return null;
  },

  // Get all public form templates
  getPublicFormTemplates: async (): Promise<FormTemplateData[]> => {
    if (!db) return [];
    const q = query(
      collection(db, FORM_TEMPLATES_COLLECTION),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FormTemplateData);
  },

  // Get form templates owned by a user
  getUserFormTemplates: async (userId: string): Promise<FormTemplateData[]> => {
    if (!db) return [];
    const q = query(
      collection(db, FORM_TEMPLATES_COLLECTION),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FormTemplateData);
  },

  // Delete a form template (only owner can delete)
  deleteFormTemplate: async (formId: string, ownerId: string): Promise<void> => {
    if (!db) throw new Error('Firebase is not configured');
    const docRef = doc(db, FORM_TEMPLATES_COLLECTION, formId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Form not found');
    }
    
    const formData = docSnap.data() as FormTemplateData;
    if (formData.ownerId !== ownerId) {
      throw new Error('You do not have permission to delete this form');
    }
    
    await deleteDoc(docRef);
  },

  // Check if user is the owner of a form
  isFormOwner: async (formId: string, userId: string): Promise<boolean> => {
    if (!db) return false;
    const docRef = doc(db, FORM_TEMPLATES_COLLECTION, formId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return false;
    const formData = docSnap.data() as FormTemplateData;
    return formData.ownerId === userId;
  },

  // ==================== FORM STATES (User's filled data) ====================
  
  // Save form state for a user (their filled values)
  saveFormState: async (
    userId: string,
    formId: string,
    fields: FormField[],
    sections: FieldSection[],
    globalDrawColor: string
  ): Promise<void> => {
    if (!db) throw new Error('Firebase is not configured');
    const docId = `${userId}_${formId}`;
    const docRef = doc(db, FORM_STATES_COLLECTION, docId);
    
    // Deep clean to remove undefined values
    const cleanedFields = removeUndefined(fields);
    const cleanedSections = removeUndefined(sections);
    
    const existingDoc = await getDoc(docRef);
    
    if (existingDoc.exists()) {
      await updateDoc(docRef, {
        fields: cleanedFields,
        sections: cleanedSections,
        globalDrawColor,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        id: docId,
        formId,
        userId,
        fields: cleanedFields,
        sections: cleanedSections,
        globalDrawColor,
        savedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  },

  // Get saved form state for a user
  getFormState: async (userId: string, formId: string): Promise<SavedFormState | null> => {
    if (!db) return null;
    const docId = `${userId}_${formId}`;
    const docRef = doc(db, FORM_STATES_COLLECTION, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as SavedFormState;
    }
    return null;
  },

  // Get all saved form states for a user
  getUserFormStates: async (userId: string): Promise<SavedFormState[]> => {
    if (!db) return [];
    const q = query(
      collection(db, FORM_STATES_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as SavedFormState);
  },

  // Delete a saved form state
  deleteFormState: async (userId: string, formId: string): Promise<void> => {
    if (!db) throw new Error('Firebase is not configured');
    const docId = `${userId}_${formId}`;
    const docRef = doc(db, FORM_STATES_COLLECTION, docId);
    await deleteDoc(docRef);
  },
};
