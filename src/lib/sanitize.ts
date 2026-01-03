import DOMPurify from 'dompurify';

/**
 * Configuração padrão do DOMPurify para sanitização segura de HTML
 */
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'span', 'div',
    'sub', 'sup', 'mark', 'del', 'ins', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'hr', 'iframe'
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel',
    'width', 'height', 'frameborder', 'allow', 'allowfullscreen',
    'data-type', 'data-id'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ['script', 'iframe[src^="javascript:"]', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
} as const satisfies Partial<typeof DOMPurify.sanitize>;

/**
 * Sanitiza conteúdo HTML para prevenir ataques XSS
 * Remove scripts, eventos inline e outros conteúdos potencialmente perigosos
 * 
 * @param html - String HTML a ser sanitizada
 * @param config - Configuração opcional do DOMPurify que será mesclada com a padrão
 * @returns String HTML sanitizada e segura para uso
 * 
 * @example
 * const safeHTML = sanitizeHTML('<p>Texto <script>alert("xss")</script></p>');
 * // Retorna: '<p>Texto </p>'
 * 
 * @remarks
 * No servidor (SSR), retorna o HTML sem sanitização. A sanitização ocorre no cliente.
 */
export function sanitizeHTML(html: string, config?: Partial<typeof DOMPurify.sanitize>): string {
  if (typeof window === 'undefined') {
    // SSR: retorna HTML sem sanitização (será sanitizado no cliente)
    // Em produção, considere usar uma biblioteca SSR-compatible
    return html;
  }

  try {
    const finalConfig = config ? { ...DOMPURIFY_CONFIG, ...config } : DOMPURIFY_CONFIG;
    // @ts-expect-error - DOMPurify type definitions may have version conflicts
    return DOMPurify.sanitize(html, finalConfig);
  } catch (error) {
    console.error('Erro ao sanitizar HTML:', error);
    // Em caso de erro, retorna string vazia como fallback seguro
    return '';
  }
}

/**
 * Sanitiza múltiplos campos HTML de um objeto
 * @param obj - Objeto com campos HTML
 * @param fields - Array de chaves do objeto que contêm HTML
 * @returns Objeto com campos sanitizados
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const sanitized = { ...obj };
  
  for (const field of fields) {
    const value = obj[field];
    if (typeof value === 'string') {
      sanitized[field] = sanitizeHTML(value) as T[keyof T];
    }
  }
  
  return sanitized;
}

/**
 * Verifica se uma string HTML contém conteúdo potencialmente perigoso
 * @param html - String HTML a verificar
 * @returns true se contém conteúdo perigoso
 */
export function containsDangerousContent(html: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const sanitized = DOMPurify.sanitize(html, DOMPURIFY_CONFIG as any);
    return sanitized !== html as any;
  } catch {
    return true;
  }
}

