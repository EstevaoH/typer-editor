"use client"
import React, { useEffect, useRef, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import "highlight.js/styles/atom-one-dark.css";
import { ToolBar } from '@/components/toolbar';
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align';
import ListKeymap from '@tiptap/extension-list-keymap'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import OrderedList from "@tiptap/extension-ordered-list"
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Blockquote from '@tiptap/extension-blockquote'
import Document from '@tiptap/extension-document'
import { MenuFloating } from '@/components/menu-floating';
import { MenuBubble } from '@/components/menu-bubble';
import { useDocuments } from '@/context/documents-context';
import { Placeholder } from '@tiptap/extensions'
import { editorExtensions } from '@/lib/editor-config';
import { SearchSelector } from '@/components/search-selector';

const limit = 42400
const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)


export function Editor() {
    const { currentDocument, updateDocument, saveDocument, toggleFavorite } = useDocuments()
    const [title, setTitle] = useState(currentDocument?.title || '')
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)

    const editor = useEditor({
        extensions: editorExtensions,
        content: currentDocument?.content || '',
        onUpdate: ({ editor }) => {
            updateDocument({ content: editor.getHTML() })

        },

        editorProps: {
            attributes: {
                class: "outline-none",
            },
            handleDOMEvents: {
                focus: () => {
                    setIsEditorFocused(true)
                    return false
                },
                blur: () => {
                    setIsEditorFocused(false)
                    return false
                }
            }
        },
        immediatelyRender: false
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
                setIsEditorFocused(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // No seu componente de editor principal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                // Abrir o popover de busca
                const searchButton = document.querySelector('[title="Buscar no documento (Ctrl+F)"]') as HTMLButtonElement;
                if (searchButton) {
                    searchButton.click();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                if (currentDocument) {
                    toggleFavorite(currentDocument.id);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentDocument, toggleFavorite]);

    useEffect(() => {
        setTitle(currentDocument?.title || '')
    }, [currentDocument])
    useEffect(() => {
        if (editor && currentDocument) {
            editor.commands.setContent(currentDocument.content || '', false);
        }
    }, [currentDocument?.id]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title !== currentDocument?.title) {
                if (currentDocument) {
                    updateDocument({ title });
                } else if (title.trim()) {
                    saveDocument(title);
                }
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [title, currentDocument, updateDocument, saveDocument])
    return (
        <>
            <ToolBar editor={editor} />
            <div className="flex h-[calc(100vh-4rem)]">
                <div className="flex-1 overflow-auto pt-4 pr-4">
                    <div className="max-w-screen mx-auto prose prose-violet tiptap">
                        <div className="mb-6 relative group">
                            <textarea
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    const target = e.target;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                                onBlur={() => {
                                    if (title.trim() && !currentDocument) {
                                        saveDocument(title);
                                    } else if (currentDocument && title !== currentDocument.title) {
                                        updateDocument({ title });
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        e.currentTarget.blur();
                                    }
                                    if (e.key === 'Tab' && !e.shiftKey) {
                                        e.preventDefault();
                                        editor?.commands.focus();
                                    }
                                }}
                                placeholder="Digite o título aqui..."
                                className="w-full bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground/60 text-foreground resize-none overflow-hidden border-b pb-3 focus:border-primary transition-all duration-200 group-hover:border-border/60"
                                style={{ minHeight: '60px' }}
                                rows={1}
                                maxLength={120}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                {title.length}/120
                            </div>
                        </div>

                        <div
                            ref={editorRef}
                            className={`min-h-[calc(100vh-10rem)] border-2 rounded-xl p-6 transition-all duration-300 ${isEditorFocused
                                ? 'border-primary/30 bg-background '
                                : 'border-border/50 bg-background/50 hover:border-border/70 hover:bg-background/70'
                                }`}
                            onClick={() => editor?.commands.focus()}
                        >
                            <EditorContent
                                editor={editor}
                                className="outline-none min-h-screen"
                            />
                            <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        {currentDocument?.updatedAt
                                            ? `Editado ${new Date(currentDocument.updatedAt).toLocaleDateString('pt-BR')}`
                                            : 'Novo documento'
                                        }
                                    </span>

                                    {editor && (
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            {editor.storage.characterCount.characters()} caracteres
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${editor?.isFocused ? 'animate-pulse bg-yellow-400' : 'bg-green-400'
                                        }`} />
                                    <span>{editor?.isFocused ? 'Editando...' : 'Salvo'}</span>
                                </div>
                            </div>
                        </div>
                        {editor && <MenuFloating editor={editor} />}
                        {editor && <MenuBubble editor={editor} />}
                    </div>
                </div>
            </div>
        </>
    );
}