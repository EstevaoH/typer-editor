'use client'
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { v4 as uuidv4 } from 'uuid';
import { htmlToFormattedText, htmlToPlainText, parseHtmlStyles } from '@/utils/htmlToPlainText';
import jsPDF from 'jspdf';



interface Document {
  id: string
  title: string
  content: string
  updatedAt: string
  isPrivate?: boolean
  isFavorite: boolean
  isShared?: boolean // Nova propriedade
  sharedWith?: string[]
}
type DownloadFormat = 'txt' | 'md' | 'docx' | 'pdf';

interface DocumentsContextType {
  documents: Document[]
  currentDocument: Document | null
  isLoading: boolean
  createDocument: (title?: string) => void
  updateDocument: (updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  saveDocument: (title: string) => void
  setCurrentDocumentId: (id: string | null) => void
  downloadDocument: (id: string, format?: DownloadFormat) => void
  toggleFavorite: (id: string) => void
  handleFirstInput: () => void
  updateDocumentPrivacy: (id: string, isPrivate: boolean) => void
  updateDocumentSharing: (id: string, isShared: boolean, sharedWith?: string[]) => void
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasHandledFirstInput, setHasHandledFirstInput] = useState(false)

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
      isPrivate: false,
      isShared: true,
      isFavorite: false,
      updatedAt: new Date().toISOString()
    }
    setDocuments(prev => [newDoc, ...prev])
    setCurrentDocId(newDoc.id)
    setHasHandledFirstInput(true)
  }, [])

  const handleFirstInput = useCallback(() => {
    if (documents.length === 0 && !hasHandledFirstInput) {
      createDocument('Documento sem título');
      setHasHandledFirstInput(true);
    }
  }, [documents.length, hasHandledFirstInput, createDocument]);


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

    if (currentDocId === id) {
      const remainingDocs = documents.filter(doc => doc.id !== id)
      setCurrentDocId(remainingDocs.length > 0 ? remainingDocs[0].id : null)
    }
    if (documents.length === 1) {
      setHasHandledFirstInput(false)
    }
  }, [currentDocId, documents])

  const toggleFavorite = useCallback((id: string) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
    ));
  }, []);

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
  const convertToPdf = (content: string, title: string): Blob => {
    const doc = new jsPDF();
    const plainText = htmlToPlainText(content);
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - (margin * 2);

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(title, maxWidth);
    let yPosition = margin;

    if (yPosition + (titleLines.length * 10) > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    doc.text(titleLines, margin, yPosition);
    yPosition += (titleLines.length * 10) + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const contentLines = doc.splitTextToSize(plainText, maxWidth);
    let currentLine = 0;

    while (currentLine < contentLines.length) {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      const linesForThisPage = [];
      let lineHeight = 7;

      while (currentLine < contentLines.length &&
        yPosition + lineHeight <= pageHeight - margin) {
        linesForThisPage.push(contentLines[currentLine]);
        yPosition += lineHeight;
        currentLine++;
      }

      if (linesForThisPage.length > 0) {
        doc.text(linesForThisPage, margin, yPosition - (linesForThisPage.length * lineHeight));
      }
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 30, pageHeight - 10);
    }

    return doc.output('blob');
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

      case 'pdf':
        blob = convertToPdf(document.content, document.title);
        filename = `${document.title}.pdf`;
        mimeType = 'application/pdf';
        break;

      case 'md':
        const mdContent = htmlToFormattedText(document.content, 'md');
        blob = new Blob([mdContent], { type: 'text/markdown' });
        filename = `${document.title}.md`;
        mimeType = 'text/markdown';
        break;

      default:
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
      fallbackDownload(blob, filename);
    }
  }, [documents])

  const fallbackDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);

    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const tempLink = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        tempLink.href = objectUrl;
        tempLink.download = filename;

        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });

        tempLink.dispatchEvent(clickEvent);
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
          URL.revokeObjectURL(url);
        }, 100);
      });
  };
  const updateDocumentPrivacy = (id: string, isPrivate: boolean) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id ? { ...doc, isPrivate, updatedAt: new Date().toISOString() } : doc
    ))

    const updatedDocs = documents.map(doc =>
      doc.id === id ? { ...doc, isPrivate, updatedAt: new Date().toISOString() } : doc
    )
    localStorage.setItem('documents', JSON.stringify(updatedDocs))
  }

  const updateDocumentSharing = (id: string, isShared: boolean, sharedWith: string[] = []) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id ? {
        ...doc,
        isShared,
        sharedWith,
        updatedAt: new Date().toISOString()
      } : doc
    ))

    const updatedDocs = documents.map(doc =>
      doc.id === id ? {
        ...doc,
        isShared,
        sharedWith,
        updatedAt: new Date()
      } : doc
    )
    localStorage.setItem('documents', JSON.stringify(updatedDocs))
  }


  const value = {
    documents,
    currentDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    saveDocument,
    setCurrentDocumentId: setCurrentDocId,
    downloadDocument,
    isLoading,
    toggleFavorite,
    handleFirstInput,
    updateDocumentPrivacy,
    updateDocumentSharing

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