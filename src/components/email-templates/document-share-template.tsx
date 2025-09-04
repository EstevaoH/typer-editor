// components/email-templates/document-share-template.tsx
export interface DocumentShareTemplateProps {
  documentTitle: string;
  documentContent: string;
  documentUrl: string;
  senderName?: string;
}
export function getDocumentShareHTML(props: DocumentShareTemplateProps): string {
  const { documentTitle, documentContent, documentUrl, senderName = 'Sistema de Documentos' } = props;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documento Compartilhado: ${documentTitle}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f5f5f5;
        }
        .header { 
            background: #f8f9fa; 
            padding: 25px; 
            text-align: center; 
            border-bottom: 4px solid #007bff;
            border-radius: 8px 8px 0 0;
        }
        .content { 
            padding: 25px; 
            background: #ffffff;
            border-left: 1px solid #e9ecef;
            border-right: 1px solid #e9ecef;
        }
        .document { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #e9ecef;
            margin: 0 0 25px 0;
        }
        .button { 
            background: #007bff; 
            color: white; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-size: 16px; 
            font-weight: bold; 
            display: inline-block; 
        }
        .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            border-radius: 0 0 8px 8px;
            border: 1px solid #e9ecef;
            border-top: none;
        }
        .security-notice {
            background: #fff3cd; 
            padding: 15px; 
            border-radius: 6px; 
            border: 1px solid #ffeaa7;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="color: #007bff; margin: 0; font-size: 24px; font-weight: bold;">
            📄 Sistema de Documentos
        </h1>
        <p style="color: #666; margin: 8px 0 0 0; font-size: 14px;">
            Compartilhamento seguro de documentos
        </p>
    </div>

    <div class="content">
        <h2 style="color: #333; margin: 0 0 20px 0;">
            Olá! 👋
        </h2>
        
        <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0;">
            <strong>${senderName}</strong> compartilhou um documento importante com você:
        </p>

        <div class="document">
            <h3 style="color: #007bff; margin: 0 0 12px 0; font-size: 18px;">
                📋 ${documentTitle}
            </h3>
            
            <div style="color: #666; line-height: 1.5; font-size: 14px; max-height: 120px; overflow: hidden;">
                ${documentContent}
            </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${documentUrl}" class="button">
                🔗 Acessar Documento Completo
            </a>
        </div>

        <div class="security-notice">
            <p style="color: #856404; margin: 0; font-size: 13px; line-height: 1.4;">
                🔒 <strong>Segurança:</strong> Este documento foi compartilhado de forma segura. 
                Não compartilhe este link com outras pessoas.
            </p>
        </div>
    </div>

    <div class="footer">
        <p style="color: #666; margin: 0 0 10px 0; font-size: 12px;">
            💡 Esta mensagem foi enviada automaticamente pelo Sistema de Documentos
        </p>
        
        <p style="color: #999; margin: 0; font-size: 11px;">
            © ${new Date().getFullYear()} Sistema de Documentos. Todos os direitos reservados.
        </p>
        
        <p style="color: #999; margin: 10px 0 0 0; font-size: 11px;">
            <a href="mailto:support@seusistema.com" style="color: #999; textDecoration: none;">
                📧 Precisa de ajuda? Contate nosso suporte
            </a>
        </p>
    </div>
</body>
</html>
  `.trim();
}

// Versão em texto simples
export function getDocumentShareText(props: DocumentShareTemplateProps): string {
  const { documentTitle, documentContent, documentUrl, senderName = 'Sistema de Documentos' } = props;

  return `
COMPARTILHAMENTO DE DOCUMENTO

Olá!

${senderName} compartilhou um documento com você:

📋 TÍTULO: ${documentTitle}

📄 CONTEÚDO:
${documentContent}

🔗 LINK: ${documentUrl}

---

🔒 SEGURANÇA: Este documento foi compartilhado de forma segura. 
Não compartilhe este link com outras pessoas.

---

💡 Esta mensagem foi enviada automaticamente pelo Sistema de Documentos.

© ${new Date().getFullYear()} Sistema de Documentos. Todos os direitos reservados.
📧 Suporte: support@seusistema.com
  `.trim();
}