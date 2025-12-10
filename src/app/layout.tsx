import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Roboto_Slab, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DocumentsProvider } from "@/context/documents-context";
import { ToastProvider } from "@/context/toast-context";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsProvider } from "@/context/settings-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#18181b",
};

export const metadata: Metadata = {
  title: "Typer Editor",
  description: "Editor de texto minimalista e poderoso com foco em privacidade.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Typer Editor",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${robotoSlab.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ToastProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SettingsProvider>
              <DocumentsProvider>{children}</DocumentsProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
