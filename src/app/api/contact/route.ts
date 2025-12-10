import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const { name, mail, message } = await request.json();

        // Basic validation
        if (!name || !mail || !message) {
            return NextResponse.json(
                { success: false, message: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail)) {
            return NextResponse.json(
                { success: false, message: 'Email inválido' },
                { status: 400 }
            );
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'TyperEditor <onboarding@resend.dev>',
            to: 'estevaohenril@gmail.com',
            subject: `Novo contato de ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Novo Contato do Site</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${mail}</p>
            <p><strong>Mensagem:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0;">${message}</p>
          </div>
          <p style="color: #64748b; margin-top: 20px; font-size: 14px;">
            Este email foi enviado através do formulário de contato do site.
          </p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Erro ao enviar mensagem. Tente novamente mais tarde.'
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Mensagem enviada com sucesso! Retornaremos em breve.',
            data
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Erro interno do servidor. Tente novamente.'
            },
            { status: 500 }
        );
    }
}