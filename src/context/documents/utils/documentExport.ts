import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";
import jsPDF from "jspdf";
import {
  htmlToFormattedText,
  htmlToPlainText,
  parseHtmlStyles,
} from "@/utils/htmlToPlainText";
import type { Document, DownloadFormat } from "../types";

// Sanitize filename to remove invalid characters
export const sanitizeFilename = (filename: string): string => {
  // Remove invalid characters for Windows/Mac/Linux
  let sanitized = filename.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_');
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

export const convertToDocx = async (content: string, title: string) => {
  const styledTexts = parseHtmlStyles(content);

  const docxContent = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: styledTexts.map(
        (styledText) =>
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
    sections: [
      {
        properties: {},
        children: docxContent,
      },
    ],
  });

  return await Packer.toBlob(doc);
};

export const convertToPdf = (content: string, title: string): Blob => {
  const doc = new jsPDF();
  const plainText = htmlToPlainText(content);
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(title, maxWidth);
  let yPosition = margin;

  if (yPosition + titleLines.length * 10 > pageHeight - margin) {
    doc.addPage();
    yPosition = margin;
  }

  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 10 + 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  const contentLines = doc.splitTextToSize(plainText, maxWidth);
  let currentLine = 0;

  while (currentLine < contentLines.length) {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    const linesForThisPage = [];
    let lineHeight = 7;

    while (
      currentLine < contentLines.length &&
      yPosition + lineHeight <= pageHeight - margin
    ) {
      linesForThisPage.push(contentLines[currentLine]);
      yPosition += lineHeight;
      currentLine++;
    }

    if (linesForThisPage.length > 0) {
      doc.text(
        linesForThisPage,
        margin,
        yPosition - linesForThisPage.length * lineHeight
      );
    }
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
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

export const downloadDocument = async (
  documents: Document[],
  id: string,
  format: DownloadFormat = "txt"
) => {
  const document = documents.find((doc) => doc.id === id);
  if (!document) return;

  let blob: Blob;
  let filename: string;
  let mimeType: string;

  const sanitizedTitle = sanitizeFilename(document.title);

  switch (format) {
    case "docx":
      blob = await convertToDocx(document.content, document.title);
      filename = `${sanitizedTitle}.docx`;
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      break;

    case "pdf":
      blob = convertToPdf(document.content, document.title);
      filename = `${sanitizedTitle}.pdf`;
      mimeType = "application/pdf";
      break;

    case "md":
      const mdContent = htmlToFormattedText(document.content, "md");
      blob = new Blob([mdContent], { type: "text/markdown" });
      filename = `${sanitizedTitle}.md`;
      mimeType = "text/markdown";
      break;

    default:
      const txtContent = htmlToFormattedText(document.content, "txt");
      blob = new Blob([txtContent], { type: "text/plain" });
      filename = `${sanitizedTitle}.txt`;
      mimeType = "text/plain";
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
      return;
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error);
    }
  } else {
    fallbackDownload(blob, filename);
  }
};
