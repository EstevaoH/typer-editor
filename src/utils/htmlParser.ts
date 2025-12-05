import { Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink } from "docx";

export interface ParsedElement {
  type: 'paragraph' | 'heading' | 'list-item' | 'code' | 'blockquote';
  level?: number;
  content: { text: string; bold?: boolean; italic?: boolean; underline?: boolean; code?: boolean; link?: string }[];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  language?: string; // For code blocks
  isOrdered?: boolean; // For list items
}

export const parseHtmlToStructure = (html: string): ParsedElement[] => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const elements: ParsedElement[] = [];

  const parseTextNode = (node: Node, inherited: { bold?: boolean; italic?: boolean; underline?: boolean; code?: boolean } = {}) => {
    const result: { text: string; bold?: boolean; italic?: boolean; underline?: boolean; code?: boolean; link?: string }[] = [];
    
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        result.push({ text, ...inherited });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const styles = { ...inherited };
      
      // Check for formatting
      if (element.tagName === 'STRONG' || element.tagName === 'B' || 
          element.style.fontWeight === 'bold' || parseInt(element.style.fontWeight) >= 600) {
        styles.bold = true;
      }
      if (element.tagName === 'EM' || element.tagName === 'I' || 
          element.style.fontStyle === 'italic') {
        styles.italic = true;
      }
      if (element.tagName === 'U' || element.style.textDecoration?.includes('underline')) {
        styles.underline = true;
      }
      if (element.tagName === 'CODE') {
        styles.code = true;
      }
      
      // Handle links
      if (element.tagName === 'A') {
        const href = element.getAttribute('href');
        if (href) {
          for (const child of Array.from(element.childNodes)) {
            const childResults = parseTextNode(child, styles);
            childResults.forEach(r => {
              r.link = href;
              result.push(r);
            });
          }
          return result;
        }
      }
      
      // Handle line breaks
      if (element.tagName === 'BR') {
        result.push({ text: '\n', ...inherited });
        return result;
      }
      
      // Recursively parse children
      for (const child of Array.from(element.childNodes)) {
        result.push(...parseTextNode(child, styles));
      }
    }
    
    return result;
  };

  const parseElement = (node: Element, listContext?: { isOrdered: boolean }) => {
    const tagName = node.tagName;
    
    // Headings
    if (/^H[1-6]$/.test(tagName)) {
      const level = parseInt(tagName[1]);
      const content = parseTextNode(node);
      if (content.length > 0) {
        elements.push({ type: 'heading', level, content });
      }
    }
    // Code blocks
    else if (tagName === 'PRE') {
      const codeElement = node.querySelector('code');
      const codeText = codeElement ? codeElement.textContent || '' : node.textContent || '';
      const language = codeElement?.className.match(/language-(\w+)/)?.[1];
      
      if (codeText.trim()) {
        elements.push({ 
          type: 'code', 
          content: [{ text: codeText, code: true }],
          language 
        });
      }
    }
    // Blockquotes
    else if (tagName === 'BLOCKQUOTE') {
      const content = parseTextNode(node);
      if (content.length > 0) {
        elements.push({ type: 'blockquote', content });
      }
    }
    // Paragraphs
    else if (tagName === 'P') {
      const content = parseTextNode(node);
      if (content.length > 0) {
        const alignment = (node as HTMLElement).style.textAlign as any;
        elements.push({ 
          type: 'paragraph', 
          content,
          alignment: alignment || 'left'
        });
      }
    }
    // Lists
    else if (tagName === 'LI') {
      const content = parseTextNode(node);
      if (content.length > 0) {
        elements.push({ 
          type: 'list-item', 
          content,
          isOrdered: listContext?.isOrdered || false
        });
      }
    }
    // Divs and other containers
    else if (tagName === 'DIV' || tagName === 'SECTION' || tagName === 'ARTICLE') {
      for (const child of Array.from(node.children)) {
        parseElement(child, listContext);
      }
    }
    // UL/OL - process children
    else if (tagName === 'UL' || tagName === 'OL') {
      const isOrdered = tagName === 'OL';
      for (const child of Array.from(node.children)) {
        parseElement(child, { isOrdered });
      }
    }
  };

  // Parse all top-level elements
  for (const child of Array.from(tempDiv.children)) {
    parseElement(child);
  }

  // If no structured elements found, treat as single paragraph
  if (elements.length === 0) {
    const content = parseTextNode(tempDiv);
    if (content.length > 0) {
      elements.push({ type: 'paragraph', content });
    }
  }

  return elements;
};

export const convertParsedToDocx = (elements: ParsedElement[]): Paragraph[] => {
  return elements.map(element => {
    const children = element.content.map(item => {
      // Handle links
      if (item.link) {
        return new ExternalHyperlink({
          children: [
            new TextRun({
              text: item.text,
              bold: item.bold,
              italics: item.italic,
              underline: item.underline ? {} : undefined,
              style: "Hyperlink"
            })
          ],
          link: item.link
        });
      }
      
      return new TextRun({
        text: item.text,
        bold: item.bold,
        italics: item.italic,
        underline: item.underline ? {} : undefined,
        font: item.code ? "Courier New" : undefined,
        shading: item.code ? { fill: "F5F5F5" } : undefined,
      });
    });

    const alignment = element.alignment === 'center' ? AlignmentType.CENTER :
                     element.alignment === 'right' ? AlignmentType.RIGHT :
                     element.alignment === 'justify' ? AlignmentType.JUSTIFIED :
                     AlignmentType.LEFT;

    if (element.type === 'heading') {
      const headingLevel = [
        HeadingLevel.HEADING_1,
        HeadingLevel.HEADING_2,
        HeadingLevel.HEADING_3,
        HeadingLevel.HEADING_4,
        HeadingLevel.HEADING_5,
        HeadingLevel.HEADING_6,
      ][element.level! - 1];

      return new Paragraph({
        children,
        heading: headingLevel,
        spacing: { after: 200 },
        alignment,
      });
    } else if (element.type === 'list-item') {
      return new Paragraph({
        children,
        bullet: element.isOrdered ? undefined : { level: 0 },
        numbering: element.isOrdered ? { reference: "default-numbering", level: 0 } : undefined,
        spacing: { after: 100 },
      });
    } else if (element.type === 'code') {
      return new Paragraph({
        children,
        spacing: { before: 100, after: 100 },
        shading: { fill: "F5F5F5" },
        border: {
          top: { color: "CCCCCC", space: 1, style: "single", size: 6 },
          bottom: { color: "CCCCCC", space: 1, style: "single", size: 6 },
          left: { color: "CCCCCC", space: 1, style: "single", size: 6 },
          right: { color: "CCCCCC", space: 1, style: "single", size: 6 },
        },
      });
    } else if (element.type === 'blockquote') {
      return new Paragraph({
        children,
        spacing: { after: 200 },
        indent: { left: 720 }, // 0.5 inch
        border: {
          left: { color: "CCCCCC", space: 1, style: "single", size: 24 },
        },
      });
    } else {
      return new Paragraph({
        children,
        spacing: { after: 200 },
        alignment,
      });
    }
  });
};
