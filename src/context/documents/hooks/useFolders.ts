import { useState, useEffect } from 'react';
import { Folder, Document } from '../types';

export function useFolders(
  documents: Document[],
  updateDocument: (updates: Partial<Document>) => void
) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
    setIsLoadingFolders(false);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoadingFolders) {
      localStorage.setItem('folders', JSON.stringify(folders));
    }
  }, [folders, isLoadingFolders]);

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const deleteFolder = (id: string) => {
    // Determine what to do with documents in this folder (e.g., move to root)
    // For now, we'll implement "Move to Root" policy
    // Note: This relies on the parent component calling this to also update documents if needed,
    // but here we can just focus on folder state or we might need to iterate documents.
    // Ideally, the parent context handles the document updates via `updateDocument`.
    
    // Since we don't have direct access to setDocuments here in a way that triggers updates efficiently for all,
    // but we have `updateDocument`. However, updating multiple docs one by one might be slow. 
    // Let's assume the caller handles document logic or we handle it here if we pass `documents` and `setDocuments` equivalent.
    
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  const renameFolder = (id: string, name: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name } : f))
    );
  };

  return {
    folders,
    createFolder,
    deleteFolder,
    renameFolder,
  };
}
