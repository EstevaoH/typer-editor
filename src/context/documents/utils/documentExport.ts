import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import jsPDF from "jspdf";
import {
  htmlToFormattedText,
  htmlToPlainText,
} from "@/utils/htmlToPlainText";
import { parseHtmlToStructure, convertParsedToDocx } from "@/utils/htmlParser";
import { sanitizeHTML } from "@/lib/sanitize";
import type { Document, DownloadFormat } from "../types";

/**
 * Sanitiza o nome do arquivo removendo caracteres inválidos para sistemas de arquivos
 * @param filename - Nome do arquivo a ser sanitizado
 * @returns Nome do arquivo sanitizado e seguro para uso
 * 
 * @example
 * sanitizeFilename("Meu Documento<>:|\"?.txt") // "Meu_Documento_.txt"
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove invalid characters for Windows/Mac/Linux
  let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
  // Replace multiple spaces/underscores with single underscore
  sanitized = sanitized.replace(/[\s_]+/g, '_');
  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');
  // Limit length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }
  return sanitized || 'documento';
};

/**
 * Converte conteúdo HTML em formato DOCX
 * @param content - Conteúdo HTML a ser convertido
 * @param title - Título do documento
 * @returns Promise que resolve com um Blob do arquivo DOCX
 * 
 * @throws {Error} Se houver erro na conversão
 */
export const convertToDocx = async (content: string, title: string) => {
  // Sanitize content before processing
  const sanitizedContent = sanitizeHTML(content);
  // Parse HTML to structured elements
  const elements = parseHtmlToStructure(sanitizedContent);
  
  // Convert to DOCX paragraphs
  const docxParagraphs = convertParsedToDocx(elements);

  // Add title at the beginning
  const titleParagraph = new Paragraph({
    text: title,
    heading: HeadingLevel.TITLE,
    spacing: { after: 400 },
    alignment: AlignmentType.CENTER,
  });

  const doc = new DocxDocument({
    title: title,
    sections: [
      {
        properties: {},
        children: [titleParagraph, ...docxParagraphs],
      },
    ],
  });

  return await Packer.toBlob(doc);
};

/**
 * Converte conteúdo HTML em formato PDF
 * @param content - Conteúdo HTML a ser convertido
 * @param title - Título do documento
 * @returns Blob do arquivo PDF
 */
export const convertToPdf = (content: string, title: string): Blob => {
  const doc = new jsPDF();
  // Sanitize content before processing
  const sanitizedContent = sanitizeHTML(content);
  const elements = parseHtmlToStructure(sanitizedContent);
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Helper to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin - 15) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(title, maxWidth);
  checkNewPage(titleLines.length * 10);
  doc.text(titleLines, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += titleLines.length * 10 + 15;

  // Process each element
  elements.forEach(element => {
    if (element.type === 'heading') {
      const fontSize = 18 - (element.level! - 1) * 2; // H1=18, H2=16, etc.
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "bold");
      
      const text = element.content.map(c => c.text).join('');
      const lines = doc.splitTextToSize(text, maxWidth);
      checkNewPage(lines.length * (fontSize / 2) + 5);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize / 2) + 8;
      
    } else if (element.type === 'code') {
      doc.setFontSize(10);
      doc.setFont("courier", "normal");
      
      const codeText = element.content.map(c => c.text).join('');
      const lines = doc.splitTextToSize(codeText, maxWidth - 10);
      checkNewPage(lines.length * 5 + 10);
      
      // Draw background
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition - 3, maxWidth, lines.length * 5 + 6, 'F');
      
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 5 + 10;
      
    } else if (element.type === 'blockquote') {
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      
      const text = element.content.map(c => c.text).join('');
      const lines = doc.splitTextToSize(text, maxWidth - 15);
      checkNewPage(lines.length * 6 + 5);
      
      // Draw left border
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(2);
      doc.line(margin + 5, yPosition - 2, margin + 5, yPosition + lines.length * 6);
      
      doc.text(lines, margin + 15, yPosition);
      yPosition += lines.length * 6 + 8;
      
    } else if (element.type === 'list-item') {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      const text = element.content.map(c => c.text).join('');
      const bullet = element.isOrdered ? '1.' : '•';
      const lines = doc.splitTextToSize(text, maxWidth - 15);
      checkNewPage(lines.length * 6);
      
      doc.text(bullet, margin + 5, yPosition);
      doc.text(lines, margin + 15, yPosition);
      yPosition += lines.length * 6 + 3;
      
    } else {
      // Paragraph
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      const text = element.content.map(c => c.text).join('');
      if (text.trim()) {
        const lines = doc.splitTextToSize(text, maxWidth);
        checkNewPage(lines.length * 7);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 7 + 5;
      }
    }
  });

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - margin - 30,
      pageHeight - 10
    );
  }

  return doc.output("blob");
};

export const fallbackDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const tempLink = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);

      tempLink.href = objectUrl;
      tempLink.download = filename;

      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      tempLink.dispatchEvent(clickEvent);
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        URL.revokeObjectURL(url);
      }, 100);
    });
};

/**
 * Faz download de um documento no formato especificado
 * @param documents - Array de documentos onde procurar o documento
 * @param id - ID do documento a ser exportado
 * @param format - Formato de exportação (txt, md, docx, pdf). Padrão: txt
 * @returns Promise que resolve com objeto contendo sucesso e possível erro
 * 
 * @example
 * const result = await downloadDocument(documents, 'doc-123', 'pdf');
 * if (result.success) {
 *   console.log('Download concluído');
 * }
 */
export const downloadDocument = async (
  documents: Document[],
  id: string,
  format: DownloadFormat = "txt"
): Promise<{ success: boolean; error?: string }> => {
  try {
    const document = documents.find((doc) => doc.id === id);
    if (!document) {
      return { success: false, error: "Documento não encontrado" };
    }

    let blob: Blob;
    let filename: string;
    let mimeType: string;

    const sanitizedTitle = sanitizeFilename(document.title);

    try {
      switch (format) {
        case "docx":
          // Content is already sanitized in convertToDocx
          blob = await convertToDocx(document.content, document.title);
          filename = `${sanitizedTitle}.docx`;
          mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;

        case "pdf":
          // Content is already sanitized in convertToPdf
          blob = convertToPdf(document.content, document.title);
          filename = `${sanitizedTitle}.pdf`;
          mimeType = "application/pdf";
          break;

        case "md":
          const sanitizedMdContent = sanitizeHTML(document.content);
          const mdContent = htmlToFormattedText(sanitizedMdContent, "md");
          blob = new Blob([mdContent], { type: "text/markdown" });
          filename = `${sanitizedTitle}.md`;
          mimeType = "text/markdown";
          break;

        default:
          const sanitizedTxtContent = sanitizeHTML(document.content);
          const txtContent = htmlToFormattedText(sanitizedTxtContent, "txt");
          blob = new Blob([txtContent], { type: "text/plain" });
          filename = `${sanitizedTitle}.txt`;
          mimeType = "text/plain";
      }
    } catch (conversionError) {
      console.error("Erro na conversão:", conversionError);
      return { success: false, error: `Erro ao converter para ${format.toUpperCase()}` };
    }

    if ("showSaveFilePicker" in window) {
      try {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: `${format.toUpperCase()} Files`,
              accept: { [mimeType]: [`.${format}`] },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return { success: true };
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name === 'AbortError') {
          return { success: false, error: "Download cancelado" };
        }
        console.error("Erro ao salvar arquivo:", error);
        // Fall back to regular download
        fallbackDownload(blob, filename);
        return { success: true };
      }
    } else {
      fallbackDownload(blob, filename);
      return { success: true };
    }
  } catch (error) {
    console.error("Erro no download:", error);
    return { success: false, error: "Erro inesperado ao fazer download" };
  }
};
