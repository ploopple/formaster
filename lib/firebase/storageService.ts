import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

export const storageService = {
  // Upload a PDF file to Firebase Storage
  uploadPDF: async (
    userId: string,
    file: File,
    formId: string
  ): Promise<string> => {
    if (!storage) throw new Error('Firebase Storage is not configured');

    // Create a unique path for the PDF
    const fileName = `${formId}_${file.name}`;
    const storageRef = ref(storage, `forms/${userId}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: 'application/pdf',
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  },

  // Delete a PDF from Firebase Storage
  deletePDF: async (pdfUrl: string): Promise<void> => {
    if (!storage) throw new Error('Firebase Storage is not configured');

    try {
      const storageRef = ref(storage, pdfUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting PDF:', error);
      // Don't throw - the file might not exist
    }
  },
};
