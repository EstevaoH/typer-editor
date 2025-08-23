"use client"
import { useState } from 'react';
import { X, Send, Mail, User, MessageSquare } from 'lucide-react';
// import emailjs from '@emailjs/browser';

// Inicialize o EmailJS (substitua com suas credenciais)
// emailjs.init("SEU_PUBLIC_KEY"); // Você obtém isso no painel do EmailJS

export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Configure o EmailJS primeiro: https://www.emailjs.com/
    //   await emailjs.send(
    //     'SEU_SERVICE_ID', // Substitua pelo seu Service ID
    //     'SEU_TEMPLATE_ID', // Substitua pelo seu Template ID
    //     {
    //       from_name: formData.name,
    //       from_email: formData.email,
    //       message: formData.message,
    //       to_email: 'seu-email@dominio.com' // Seu email
    //     },
    //     'SEU_PUBLIC_KEY' // Seu Public Key
    //   );

      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Fechar modal automaticamente após 2 segundos
      setTimeout(() => {
        onClose();
        setIsSent(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl max-w-md w-full border border-zinc-700 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">Entre em Contato</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {isSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mensagem Enviada!</h3>
              <p className="text-zinc-400">Retornaremos em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Mensagem
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-800/50 rounded-b-xl">
          <p className="text-sm text-zinc-400 text-center">
            Ou envie diretamente para:{" "}
            <a href="mailto:seu-email@dominio.com" className="text-blue-400 hover:underline">
              seu-email@dominio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}