"use client"
import React, { useState } from 'react';
import { ReferenceDialog } from './reference-dialog';

import { ListSelector } from './list-selector';
import { AlignmentSelector } from './alignment-selector';
import { HeadingSelector } from './heading-selector';
import { ColorSelector } from './color-selector';
import { HignlightSelector } from './hignlight-selector';
import { VideoSelector } from './video-selector';
import { ImageSelector } from './image-selector';
import { LinkSelector } from './link-selector';
import { BoldIcon, Code2Icon, ItalicIcon, Keyboard, QuoteIcon, Redo2, Search, StrikethroughIcon, UnderlineIcon, Undo2 } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface ToolBarProps {
    editor: Editor | null;
}

export function ToolBar({ editor }: ToolBarProps) {

    if (!editor) return null;
    return (
        <div className="flex h-12 items-center justify-center gap-2 p-2 bg-zinc-800 border-b border-zinc-700 sticky top-0 z-50">
            <div
                className="flex h-12 w-full items-center gap-2 p-2 overflow-x-auto scrollbar-hide md:justify-center"
            >
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded cursor-pointer ${editor.isActive('bold') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                    title="Negrito (Ctrl+B)"
                >
                    <BoldIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded cursor-pointer ${editor.isActive('italic') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                    title="Itálico (Ctrl+I)"
                >
                    <ItalicIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded cursor-pointer ${editor.isActive('strike') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                    title="Tachado (Ctrl+Shift+X)"
                >
                    <StrikethroughIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded cursor-pointer ${editor.isActive('underline') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                    title="Sublinhado (Ctrl+U)"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded cursor-pointer ${editor.isActive('codeBlock') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
                    title="Bloco de código (Ctrl+Alt+C)"
                >
                    <Code2Icon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded cursor-pointer ${editor.isActive('blockquote') ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
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
                <div className="control-group">
                    <div className="button-group flex items-center gap-1">
                        <button
                            className={`p-2 rounded cursor-pointer text-zinc-300 hover:bg-zinc-700 ${!editor.can().undo() ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            title="Desfazer (Ctrl+Z)"
                        >
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button
                            className={`p-2 rounded  text-zinc-300 hover:bg-zinc-700 ${!editor.can().redo() ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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

        </div>
    );
}