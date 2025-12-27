export const MAX_DOCUMENTS = 10;

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  parentId?: string | null;
}

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
  folderId?: string | null;
  tags?: string[];
}

export interface Version {
  id: string;
  documentId: string;
  content: string;
  title: string;
  createdAt: string;
}

export type DownloadFormat = "txt" | "md" | "docx" | "pdf";

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'root';
}

export interface DocumentsContextType {
  MAX_DOCUMENTS: number;
  documents: Document[]; // Documents filtered by selected tag
  allDocuments: Document[]; // All documents (unfiltered) for tag counting
  folders: Folder[];
  currentDocument: Document | null;
  isLoading: boolean;
  createDocument: (title?: string, folderId?: string) => void;
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
  
  // Folder methods
  createFolder: (name: string, parentId?: string) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
  moveDocumentToFolder: (docId: string, folderId: string | null) => void;
  downloadFolder: (folderId: string) => Promise<void>;
  getBreadcrumbs: (documentId?: string | null) => BreadcrumbItem[];
  
  // Tag methods
  addTag: (documentId: string, tag: string) => void;
  removeTag: (documentId: string, tag: string) => void;
  getAllTags: () => string[];
  filterByTag: (tag: string | null) => void;
  selectedTag: string | null;
}
