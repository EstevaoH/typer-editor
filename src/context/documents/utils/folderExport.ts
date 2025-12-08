import JSZip from "jszip";
import { Document, Folder } from "../types";

export interface DownloadFolderResult {
  success: boolean;
  error?: string;
}

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-z0-9\u00C0-\u024F\s-]/gi, "").trim().substring(0, 50);
};

export const downloadFolder = async (
  folder: Folder,
  documents: Document[]
): Promise<DownloadFolderResult> => {
  try {
    const zip = new JSZip();
    
    // Sort documents to ensure deterministic order (optional but nice)
    const folderDocs = documents.sort((a, b) => 
      (a.title || "Untitled").localeCompare(b.title || "Untitled")
    );

    if (folderDocs.length === 0) {
      // Create an empty folder entry if no documents
      zip.folder(sanitizeFilename(folder.name));
    } else {
      folderDocs.forEach((doc) => {
        const docTitle = doc.title || "Untitled";
        const safeTitle = sanitizeFilename(docTitle);
        // Default to .md for now as it supports rich text content better in raw format
        // Ideally we might want to convert HTML to Markdown here, but for now raw content or simple text
        // Let's assume the content is HTML and save as .html for better fidelity, or .txt if plain
        // Given the editor uses Tiptap (HTML), .html is safest for preserving structure.
        // However, user might expect .txt or .md. Let's stick to .html for full fidelity or .md if we had a converter.
        // For simplicity and compatibility with the storage format, let's use .html
        // But requested feature implies "documents", users often expect text.
        // Let's check what downloadDocument does. It supports txt, md, html.
        // We'll default to HTML for full content preservation in this batch export.
        
        // Actually, let's allow saving as Markdown if possible, but without a converter involved in this file,
        // let's stick to a safe default. Let's try to be smart:
        // formatting: <html>...</html> -> .html
        
        zip.file(`${safeTitle}.html`, doc.content || "");
      });
    }

    const content = await zip.generateAsync({ type: "blob" });
    
    // Trigger download
    const url = window.URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeFilename(folder.name)}.zip`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Error zipping folder:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create zip file" 
    };
  }
};
