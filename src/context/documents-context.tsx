'use client'
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { v4 as uuidv4 } from 'uuid';
import { htmlToFormattedText, parseHtmlStyles } from '@/utils/htmlToPlainText';
interface Document {
  id: string
  title: string
  content: string
  updatedAt: string
}
type DownloadFormat = 'txt' | 'md' | 'docx';

interface DocumentsContextType {
  documents: Document[]
  currentDocument: Document | null
  createDocument: (title?: string) => void
  updateDocument: (updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  saveDocument: (title: string) => void
  setCurrentDocumentId: (id: string | null) => void
  downloadDocument: (id: string, format?: 'txt' | 'md' | 'docx') => void
  isLoading: boolean
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedDocs = localStorage.getItem('savedDocuments')
    if (savedDocs) {
      const parsedDocs = JSON.parse(savedDocs)
      setDocuments(JSON.parse(savedDocs))

      if (parsedDocs.length > 0 && !currentDocId) {
        setCurrentDocId(parsedDocs[0].id)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('savedDocuments', JSON.stringify(documents))

      if (documents.length > 0 && !currentDocId) {
        setCurrentDocId(documents[0].id)
      }

      if (currentDocId && !documents.find(doc => doc.id === currentDocId)) {
        setCurrentDocId(documents.length > 0 ? documents[0].id : null)
      }
    }
  }, [documents, isLoading])

  const currentDocument = documents.find(doc => doc.id === currentDocId) || null
  const createDocument = useCallback((title = 'Novo documento',) => {
    const newDoc: Document = {
      id: uuidv4(),
      title,
      content: '',
      updatedAt: new Date().toISOString()
    }
    setDocuments(prev => [newDoc, ...prev])
    setCurrentDocId(newDoc.id)
  }, [])


  const updateDocument = useCallback((updates: Partial<Document>) => {
    if (!currentDocId) return

    setDocuments(prev =>
      prev.map(doc =>
        doc.id === currentDocId
          ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
          : doc
      )
    )
  }, [currentDocId])

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))

    // Se estiver deletando o documento atual, definir o próximo como atual
    if (currentDocId === id) {
      const remainingDocs = documents.filter(doc => doc.id !== id)
      setCurrentDocId(remainingDocs.length > 0 ? remainingDocs[0].id : null)
    }
  }, [currentDocId, documents])

  const saveDocument = useCallback((title: string) => {
    if (!currentDocument) {
      createDocument(title || 'Novo documento')
    } else {
      updateDocument({ title })
    }
  }, [currentDocument, createDocument, updateDocument])

  const convertToDocx = async (content: string, title: string) => {
    const styledTexts = parseHtmlStyles(content);

    const docxContent = [
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: styledTexts.map(styledText =>
          new TextRun({
            text: styledText.text,
            bold: styledText.bold,
            italics: styledText.italics,
          })
        ),
      }),
    ];

    const doc = new DocxDocument({
      title: title,
      sections: [{
        properties: {},
        children: docxContent,
      }],
    });

    return await Packer.toBlob(doc);
  };

  const downloadDocument = useCallback(async (id: string, format: DownloadFormat = 'txt') => {
    const document = documents.find(doc => doc.id === id)
    if (!document) return

    let blob: Blob;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'docx':
        blob = await convertToDocx(document.content, document.title);
        filename = `${document.title}.docx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;

      case 'md':
        const mdContent = htmlToFormattedText(document.content, 'md');
        blob = new Blob([mdContent], { type: 'text/markdown' });
        filename = `${document.title}.md`;
        mimeType = 'text/markdown';
        break;

      default: // txt
        const txtContent = htmlToFormattedText(document.content, 'txt');
        blob = new Blob([txtContent], { type: 'text/plain' });
        filename = `${document.title}.txt`;
        mimeType = 'text/plain';
    }

    if ('showSaveFilePicker' in window) {
      try {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: `${format.toUpperCase()} Files`,
            accept: { [mimeType]: [`.${format}`] },
          }],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (error) {
        console.error('Erro ao salvar arquivo:', error);
      }
    } else {
      // Fallback para navegadores mais antigos
      fallbackDownload(blob, filename);
    }
  }, [documents])

  // Fallback para download usando URL.createObjectURL
  const fallbackDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);

    // Usar uma abordagem mais limpa com fetch e headers
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        // Criar um link temporário mas sem adicioná-lo ao DOM
        const tempLink = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        tempLink.href = objectUrl;
        tempLink.download = filename;

        // Usar um evento synthetic em vez de adicionar ao DOM
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });

        tempLink.dispatchEvent(clickEvent);

        // Limpar após um delay
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
          URL.revokeObjectURL(url);
        }, 100);
      });
  };

  const value = {
    documents,
    currentDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    saveDocument,
    setCurrentDocumentId: setCurrentDocId,
    downloadDocument,
    isLoading
  }

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentsContext)
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider')
  }
  return context
}