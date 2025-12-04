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
const FORM_STATES_COLLECTION = 'formStates';

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
  // Save form state for a user
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
    
    const existingDoc = await getDoc(docRef);
    
    if (existingDoc.exists()) {
      await updateDoc(docRef, {
        fields,
        sections,
        globalDrawColor,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        id: docId,
        formId,
        userId,
        fields,
        sections,
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
