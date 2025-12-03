export const MAX_DOCUMENTS = 10;

export interface Document {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  isPrivate?: boolean;
  isFavorite: boolean;
  isShared?: boolean;
  sharedWith: string[];
  isTutorial?: boolean;
}

export interface Version {
  id: string;
  documentId: string;
  content: string;
  title: string;
  createdAt: string;
}

export type DownloadFormat = "txt" | "md" | "docx" | "pdf";

export interface DocumentsContextType {
  MAX_DOCUMENTS: number;
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  createDocument: (title?: string) => void;
  updateDocument: (updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  saveDocument: (title: string) => void;
  setCurrentDocumentId: (id: string | null) => void;
  downloadDocument: (id: string, format?: DownloadFormat) => void;
  toggleFavorite: (id: string) => void;
  handleFirstInput: () => void;
  updateDocumentPrivacy: (id: string, isPrivate: boolean) => void;
  updateDocumentSharing: (
    id: string,
    isShared: boolean,
    sharedWith?: string[]
  ) => void;
  addToSharedWith: (id: string, emails: string[]) => void;
  removeFromSharedWith: (id: string, email: string) => void;
  skipDeleteConfirm: boolean;
  setSkipDeleteConfirm: any;
  versions: Version[];
  createVersion: (documentId: string) => void;
  restoreVersion: (versionId: string) => void;
  deleteVersion: (versionId: string) => void;
  undoDelete: () => string | null;
}
