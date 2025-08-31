"use client"

import { Languages } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Editor } from "@tiptap/react"
import { useState } from "react"

interface LanguageOption {
  code: string
  name: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
]

export function LanguageSelector({ editor }: { editor: Editor | null }) {
  const [currentLanguage, setCurrentLanguage] = useState('pt')

  if (!editor) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`p-2 rounded ${
            currentLanguage !== 'pt' 
              ? "bg-zinc-600 text-white" 
              : "text-zinc-300 hover:bg-zinc-700"
          }`}
          title="Selecionar idioma de tradução"
        >
          <Languages className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-zinc-800 border border-zinc-700 rounded">
        <div className="flex flex-col gap-1">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => setCurrentLanguage(language.code)}
              className={`flex items-center gap-2 p-2 rounded text-sm ${
                currentLanguage === language.code
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {currentLanguage === language.code && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              {language.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}