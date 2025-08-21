"use client"
import React, { useCallback } from 'react';
import { ReferenceDialog } from './reference-dialog';
import { LanguageSelector } from './language-selector';
import { ListSelector } from './list-selector';
import { AlignmentSelector } from './alignment-selector';
import { HeadingSelector } from './heading-selector';
import { ColorSelector } from './color-selector';
import { HignlightSelector } from './hignlight-selector';
import { VideoSelector } from './video-selector';
import { ImageSelector } from './image-selector';
import { LinkSelector } from './link-selector';
import { BoldIcon, Code2Icon, ItalicIcon, QuoteIcon, Redo2, StrikethroughIcon, UnderlineIcon, Undo2 } from 'lucide-react';

export function ToolBar({ editor }: { editor: any }) {
    if (!editor) return null;
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        try {
            new URL(url);
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
        } catch {
            alert('Por favor, insira uma URL válida (ex: https://exemplo.com)');
        }
    }, [editor]);
    const addImage = useCallback(() => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])


    return (
        <div className="flex flex-wrap h-12 items-center justify-center gap-2 p-2 bg-zinc-800 border-b border-zinc-700 sticky top-0 z-50">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor.isActive('bold') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                title="Negrito (Ctrl+B)"
            >
                <BoldIcon className="w-4 h-4" />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor.isActive('italic') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                title="Itálico (Ctrl+I)"
            >
                <ItalicIcon className="w-4 h-4" />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded ${editor.isActive('strike') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                title="Tachado (Ctrl+Shift+X)"
            >
                <StrikethroughIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded ${editor.isActive('underline') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                title="Sublinhado (Ctrl+U)"
            >
                <UnderlineIcon className="w-4 h-4" />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                title="Bloco de código (Ctrl+Alt+C)"
            >
                <Code2Icon className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                title="Destaque (Ctrl+Shift+B)"
            >
                <QuoteIcon className="w-4 h-4" />
            </button>

            <LinkSelector editor={editor} />
            <ImageSelector editor={editor} />
            <VideoSelector editor={editor} />
            <ReferenceDialog editor={editor} />
            <HignlightSelector editor={editor} />
            <ColorSelector editor={editor} />
            <HeadingSelector editor={editor} />
            <AlignmentSelector editor={editor} />
            <ListSelector editor={editor} />
            <LanguageSelector editor={editor} />

            <div className="control-group">
                <div className="button-group flex items-center gap-1">
                    <button
                        className={`p-2 rounded text-zinc-300 hover:bg-zinc-700 ${!editor.can().undo() ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Desfazer (Ctrl+Z)"
                    >
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                        className={`p-2 rounded text-zinc-300 hover:bg-zinc-700 ${!editor.can().redo() ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Refazer (Ctrl+Y)"
                    >
                        <Redo2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}