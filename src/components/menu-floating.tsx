import { FloatingMenu } from '@tiptap/react';
import { Heading1, Heading2, ImageIcon, TypeIcon, YoutubeIcon } from 'lucide-react';
import React, { useCallback } from 'react';

export function MenuFloating({ editor }: { editor: any }){
    return (
        <FloatingMenu
            className="bg-zinc-800 shadow-xl border border-zinc-700 rounded-lg overflow-hidden flex flex-col py-2 w-64"
            editor={editor}
            shouldShow={({ state }) => {
                const { $from } = state.selection
                const currentLineText = $from.nodeBefore?.textContent
                return currentLineText === '/'
            }}
        >
            <div className="px-3 py-2">
                <h3 className="text-xs font-medium text-zinc-400 mb-1">BLOCOS BÁSICOS</h3>

                <button
                    className="flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-700 transition-colors"
                >
                    <div className="w-10 h-10 flex items-center justify-center bg-zinc-700 rounded border border-zinc-600">
                        <TypeIcon className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-zinc-50">Texto</span>
                        <span className="text-xs text-zinc-400">Comece a escrever com texto simples</span>
                    </div>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className="flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-700 transition-colors"
                >
                    <div className="w-10 h-10 flex items-center justify-center bg-zinc-700 rounded border border-zinc-600">
                        <Heading1 className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-zinc-50">Título 1</span>
                        <span className="text-xs text-zinc-400">Título de seção grande</span>
                    </div>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-700 transition-colors"
                >
                    <div className="w-10 h-10 flex items-center justify-center bg-zinc-700 rounded border border-zinc-600">
                        <Heading2 className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-zinc-50">Título 2</span>
                        <span className="text-xs text-zinc-400">Título de seção médio</span>
                    </div>
                </button>
            </div>

            <div className="border-t border-zinc-700 my-1"></div>

            <div className="px-3 py-2">
                <h3 className="text-xs font-medium text-zinc-400 mb-1">MÍDIA</h3>

                <button
                    className="flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-700 transition-colors"
                >
                    <div className="w-10 h-10 flex items-center justify-center bg-zinc-700 rounded border border-zinc-600">
                        <ImageIcon className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-zinc-50">Imagem</span>
                        <span className="text-xs text-zinc-400">Envie ou insira com um link</span>
                    </div>
                </button>

                <button
                    onClick={() => {
                        const url = window.prompt('Enter YouTube URL')
                        if (url) {
                            editor.commands.setYoutubeVideo({ src: url })
                        }
                    }}
                    className="flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-700 transition-colors"
                >
                    <div className="w-10 h-10 flex items-center justify-center bg-zinc-700 rounded border border-zinc-600">
                        <YoutubeIcon className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-zinc-50">Vídeo</span>
                        <span className="text-xs text-zinc-400">Incorporar do YouTube</span>
                    </div>
                </button>
            </div>
        </FloatingMenu>
    )
}