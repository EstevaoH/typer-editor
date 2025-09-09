interface ContactTemplateProps {
    name: string;
    mail: string;
    message: string;
}

export function getContactHTML({ name, mail, message }: ContactTemplateProps): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
                .message { background: white; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; margin: 10px 0; }
                .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Novo Contato do Site</h1>
            </div>
            <div class="content">
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${mail}</p>
                <p><strong>Mensagem:</strong></p>
                <div class="message">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="footer">
                <p>Este email foi enviado através do formulário de contato do site.</p>
            </div>
        </body>
        </html>
    `;
}

export function getContactText({ name, mail, message }: ContactTemplateProps): string {
    return `
NOVO CONTATO DO SITE
====================

Nome: ${name}
Email: ${mail}
Mensagem:
${message}

Este email foi enviado através do formulário de contato do site.
    `.trim();
}