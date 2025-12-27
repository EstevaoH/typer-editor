import JSZip from "jszip";
import { sanitizeHTML } from "@/lib/sanitize";
import { Document, Folder } from "../types";

export interface DownloadFolderResult {
  success: boolean;
  error?: string;
}

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-z0-9\u00C0-\u024F\s-]/gi, "").trim().substring(0, 50);
};

export const downloadFolder = async (
  rootFolderId: string,
  allFolders: Folder[],
  allDocuments: Document[]
): Promise<DownloadFolderResult> => {
  try {
    const zip = new JSZip();
    const rootFolder = allFolders.find(f => f.id === rootFolderId);
    
    if (!rootFolder) {
        throw new Error("Folder not found");
    }

    // Function to recursively add folders and files to zip
    const addToZip = (
        currentFolderId: string, 
        currentZip: JSZip
    ) => {
        // Add documents in current folder
        const folderDocs = allDocuments.filter(doc => doc.folderId === currentFolderId)
            .sort((a, b) => (a.title || "Untitled").localeCompare(b.title || "Untitled"));

        folderDocs.forEach(doc => {
            const docTitle = doc.title || "Untitled";
            const safeTitle = sanitizeFilename(docTitle);
            // Sanitize content before adding to zip
            const sanitizedContent = sanitizeHTML(doc.content || "");
            currentZip.file(`${safeTitle}.html`, sanitizedContent);
        });

        // Find subfolders
        const subfolders = allFolders.filter(f => f.parentId === currentFolderId);
        
        subfolders.forEach(subfolder => {
            const safeFolderName = sanitizeFilename(subfolder.name);
            const subFolderZip = currentZip.folder(safeFolderName);
            if (subFolderZip) {
                addToZip(subfolder.id, subFolderZip);
            }
        });
    };

    // Start recursion. We already created the zip, which represents the root of the archive.
    // The previous implementation created a folder INSIDE the zip matching the folder name.
    // Let's keep that behavior: The zip content should be inside a folder named after the root folder.
    const rootZipFolder = zip.folder(sanitizeFilename(rootFolder.name));
    
    if (rootZipFolder) {
        addToZip(rootFolderId, rootZipFolder);
    }

    const content = await zip.generateAsync({ type: "blob" });
    
    // Trigger download
    const url = window.URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeFilename(rootFolder.name)}.zip`;
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
