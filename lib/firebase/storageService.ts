import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from 'firebase/storage';
import { storage } from './firebase';

// Compute SHA-256 hash of file content
async function computeFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const storageService = {
  // Upload a PDF file to Firebase Storage with deduplication
  // Returns { url, hash, isExisting }
  uploadPDF: async (
    userId: string,
    file: File,
    formId: string
  ): Promise<string> => {
    if (!storage) throw new Error('Firebase Storage is not configured');

    // Compute hash of the PDF content
    const fileHash = await computeFileHash(file);
    
    // Use hash-based path for deduplication (shared across all users)
    const deduplicatedPath = `pdfs/${fileHash}.pdf`;
    const storageRef = ref(storage, deduplicatedPath);

    // Check if this PDF already exists
    try {
      await getMetadata(storageRef);
      // File exists, just return the URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch {
      // File doesn't exist, upload it
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: 'application/pdf',
        customMetadata: {
          originalName: file.name,
          uploadedBy: userId,
          formId: formId,
        },
      });

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  },

  // Get the hash of a PDF file (useful for checking duplicates before upload)
  getPDFHash: async (file: File): Promise<string> => {
    return computeFileHash(file);
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
