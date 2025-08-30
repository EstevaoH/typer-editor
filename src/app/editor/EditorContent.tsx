// components/editor.tsx (atualizado)
"use client"
import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import "highlight.js/styles/atom-one-dark.css";
import { ToolBar } from '@/components/toolbar';
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'
import { MenuFloating } from '@/components/menu-floating';
import { MenuBubble } from '@/components/menu-bubble';
import { useDocuments } from '@/context/documents-context';
import { editorExtensions } from '@/lib/editor-config';
import { ChevronsLeftRightEllipsis, FilePenLine } from 'lucide-react';
import { SearchSelector } from '@/components/search-selector';
import { useHotkeys } from 'react-hotkeys-hook';
import { KeyboardShortcuts } from '@/components/key-board-shortcuts';
import { FloatingShortcutButton } from '@/components/floating-shortcut-button';

const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export function Editor() {
    const { currentDocument, updateDocument, saveDocument, toggleFavorite, handleFirstInput } = useDocuments()
    const [title, setTitle] = useState(currentDocument?.title || '')
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)
    const [hasHandledFirstInput, setHasHandledFirstInput] = useState(false)
    const [showSearch, setShowSearch] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showFloatingButton, setShowFloatingButton] = useState(true);

    // Gerenciamento centralizado de teclas
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+F - Alternar busca
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                e.stopPropagation();
                setShowSearch(prev => !prev);
                return false;
            }

            // Ctrl+/ - Abrir atalhos
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                e.stopPropagation();
                setShowShortcuts(true);
                return false;
            }

            // ESC - Fechar modais
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                
                if (showSearch) {
                    setShowSearch(false);
                } else if (showShortcuts) {
                    setShowShortcuts(false);
                }
                return false;
            }

            // Ctrl+D - Favoritar
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                if (currentDocument) {
                    toggleFavorite(currentDocument.id);
                }
                return false;
            }
        };

        // Use capture phase para pegar o evento antes do navegador
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [showSearch, showShortcuts, currentDocument, toggleFavorite]);

    // Mostrar/ocultar floating button baseado no scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingButton(false);
            setTimeout(() => setShowFloatingButton(true), 1000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const editor = useEditor({
        extensions: editorExtensions,
        content: currentDocument?.content || '',
        onUpdate: ({ editor }) => {
            const content = editor.getHTML();

            if (!currentDocument && !hasHandledFirstInput && content.trim() !== '') {
                handleFirstInput();
                setHasHandledFirstInput(true);
            }

            updateDocument({ content });
        },
        editorProps: {
            attributes: {
                class: "outline-none",
            },
            handleDOMEvents: {
                focus: () => {
                    setIsEditorFocused(true);
                    setShowFloatingButton(true);
                    return false;
                },
                blur: () => {
                    setIsEditorFocused(false);
                    return false;
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

    useEffect(() => {
        setTitle(currentDocument?.title || '')
    }, [currentDocument])

    useEffect(() => {
        if (editor && currentDocument) {
            editor.commands.setContent(currentDocument.content || '', false);
        }
    }, [currentDocument?.id]);

    useEffect(() => {
        if (currentDocument) {
            setHasHandledFirstInput(false);
        }
    }, [currentDocument]);

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
            <ToolBar
                editor={editor}
                onShowSearch={() => setShowSearch(prev => !prev)}
                onShowShortcuts={() => setShowShortcuts(true)}
            />

            {showSearch && (
                <SearchSelector
                    editor={editor}
                    onClose={() => setShowSearch(false)}
                />
            )}

            <KeyboardShortcuts
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />

            <FloatingShortcutButton
                onClick={() => setShowShortcuts(true)}
                isVisible={showFloatingButton && !showShortcuts}
            />

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

                                    // Prevenir Ctrl+F no textarea também
                                    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                                        e.preventDefault();
                                        setShowSearch(prev => !prev);
                                    }
                                    
                                    // Prevenir ESC no textarea
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        if (showSearch) {
                                            setShowSearch(false);
                                        } else if (showShortcuts) {
                                            setShowShortcuts(false);
                                        }
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
                            onKeyDown={(e) => {
                                // Prevenir Ctrl+F no editor também
                                if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                                    e.preventDefault();
                                    setShowSearch(prev => !prev);
                                }
                                
                                // Prevenir ESC no editor
                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    if (showSearch) {
                                        setShowSearch(false);
                                    } else if (showShortcuts) {
                                        setShowShortcuts(false);
                                    }
                                }
                            }}
                        >
                            <EditorContent
                                editor={editor}
                                className="outline-none min-h-screen"
                            />
                            <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <FilePenLine className="w-4 h-4" />
                                        {currentDocument?.updatedAt
                                            ? `Editado ${new Date(currentDocument.updatedAt).toLocaleDateString('pt-BR')}`
                                            : 'Novo documento'
                                        }
                                    </span>

                                    {editor && (
                                        <span className="flex items-center gap-1">
                                            <ChevronsLeftRightEllipsis className="w-4 h-4" />
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