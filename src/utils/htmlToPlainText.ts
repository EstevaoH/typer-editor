export const htmlToFormattedText = (html: string, format: 'txt' | 'md' = 'txt'): string => {
  if (format === 'txt') {
    return htmlToPlainText(html);
  } else {
    return htmlToMarkdown(html);
  }
};

export const htmlToPlainText = (html: string): string => {
  let text = html;
 
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n\n');

  text = text.replace(/<[^>]*>/g, '');

  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
};

export const htmlToMarkdown = (html: string): string => {
  let md = html;

  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, p1) => {
    return p1.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
  });
  
  md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, p1) => {
    let counter = 1;
    //@typescript-eslint/no-unused-vars
    return p1.replace(/<li[^>]*>(.*?)<\/li>/gi, (liMatch:any, liContent:any) => {
      return `${counter++}. ${liContent}\n`;
    }) + '\n';
  });
  
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n');
  

  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, (match, p1) => {
    return '> ' + p1.trim().replace(/\n/g, '\n> ') + '\n\n';
  });
  

  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<\/div>/gi, '\n');

  md = md.replace(/<[^>]*>/g, '');
  
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");

  md = md.replace(/\n{3,}/g, '\n\n');
  
  return md.trim();
};

export const parseHtmlStyles = (html: string): { text: string, bold?: boolean, italics?: boolean }[] => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const parseNode = (node: Node): { text: string, bold?: boolean, italics?: boolean }[] => {
    const result: { text: string, bold?: boolean, italics?: boolean }[] = [];
    
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent?.trim()) {
        result.push({ text: node.textContent });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const children = Array.from(node.childNodes);
      
      const styles: { bold?: boolean, italics?: boolean } = {};
      
      if (element.tagName === 'STRONG' || element.tagName === 'B') {
        styles.bold = true;
      }
      if (element.tagName === 'EM' || element.tagName === 'I') {
        styles.italics = true;
      }
      if (element.style.fontWeight === 'bold' || parseInt(element.style.fontWeight) >= 600) {
        styles.bold = true;
      }
      if (element.style.fontStyle === 'italic') {
        styles.italics = true;
      }

      for (const child of children) {
        const childResults = parseNode(child);
        for (const childResult of childResults) {
          result.push({ ...childResult, ...styles });
        }
      }
    }
    
    return result;
  };
  
  return parseNode(tempDiv);
};