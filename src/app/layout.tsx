import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DocumentsProvider } from "@/context/documents-context";
import { ToastProvider } from "@/context/toast-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TyperEditor - Editor de Texto Online",
  description:
    "Crie, edite e compartilhe documentos diretamente no seu navegador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <DocumentsProvider>{children}</DocumentsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
