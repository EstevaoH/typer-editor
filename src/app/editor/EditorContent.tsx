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
import { KeyboardShortcuts } from '@/components/key-board-shortcuts';
import { FloatingShortcutButton } from '@/components/floating-shortcut-button';
import { ShowDeleteConfirm } from '@/components/show-delete-confirm';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/useToast';


const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export function Editor() {
    const { currentDocument, updateDocument, saveDocument, toggleFavorite, handleFirstInput, createDocument, deleteDocument } = useDocuments()
    const [title, setTitle] = useState(currentDocument?.title || '')
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)
    const [hasHandledFirstInput, setHasHandledFirstInput] = useState(false)
    const [showSearch, setShowSearch] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showFloatingButton, setShowFloatingButton] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [skipDeleteConfirmation, setSkipDeleteConfirmation] = useState(false);
    const toast = useToast()

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

    const handleToggleFavorite = (id: string) => {
        if (currentDocument) {
            toggleFavorite(id);
            toast.showToast(currentDocument.isFavorite ? '⭐ Desfavoritado' : '🌟 Favoritado');
        }
    };

    useEffect(() => {
        const savedPreference = localStorage.getItem('skipDeleteConfirmation');
        if (savedPreference === 'true') {
            setSkipDeleteConfirmation(true);
        }
    }, []);

    useEffect(() => {
        const handleKeyDownFavorite = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (currentDocument) {
                    handleToggleFavorite(currentDocument.id);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDownFavorite, true);
        return () => window.removeEventListener('keydown', handleKeyDownFavorite, true);
    }, [currentDocument, toggleFavorite, toast]);

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingButton(false);
            setTimeout(() => setShowFloatingButton(true), 1000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                setShowShortcuts(prev => !prev);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                setShowSearch(prev => !prev);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                createDocument();
                toast.showToast('📄 Novo documento criado');
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Delete') {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (currentDocument) {
                    if (skipDeleteConfirmation) {
                        deleteDocument(currentDocument.id);
                    } else {
                        setShowDeleteConfirm(true);
                    }
                }
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '8') {
                e.preventDefault();
                e.stopPropagation();
                editor?.commands.toggleBulletList();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '7') {
                e.preventDefault();
                e.stopPropagation();
                editor?.commands.toggleOrderedList();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '9') {
                e.preventDefault();
                e.stopPropagation();
                editor?.commands.toggleTaskList();
                return;
            }

            if (e.key === 'Tab' && !e.shiftKey && editor?.isActive('listItem')) {
                e.preventDefault();
                e.stopPropagation();
                editor.commands.sinkListItem('listItem');
                return;
            }

            if (e.key === 'Tab' && e.shiftKey && editor?.isActive('listItem')) {
                e.preventDefault();
                e.stopPropagation();
                editor.commands.liftListItem('listItem');
                return;
            }

            if (e.key === 'Escape') {
                if (showSearch) {
                    setShowSearch(false);
                    e.preventDefault();
                    e.stopPropagation();
                } else if (showShortcuts) {
                    setShowShortcuts(false);
                    e.preventDefault();
                    e.stopPropagation();
                } else if (showDeleteConfirm) {
                    setShowDeleteConfirm(false);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [showSearch, showShortcuts, createDocument, editor, currentDocument, showDeleteConfirm]);

    const handleDeleteDocument = () => {
        if (currentDocument) {
            deleteDocument(currentDocument.id);
            setShowDeleteConfirm(false);
        }
    };



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
    }, [currentDocument?.id, editor]);

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
                    isOpen={showSearch}
                    editor={editor}
                    onClose={() => setShowSearch(false)}
                />
            )}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <ShowDeleteConfirm
                        currentDocument={currentDocument}
                        handleDeleteDocument={handleDeleteDocument}
                        setShowDeleteConfirm={setShowDeleteConfirm}
                    />
                )}
            </AnimatePresence>
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
                                    if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        createDocument();
                                        return;
                                    }

                                    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowSearch(prev => !prev);
                                        return;
                                    }

                                    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Delete') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (currentDocument) {
                                            setShowDeleteConfirm(true);
                                        }
                                        return;
                                    }

                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        e.currentTarget.blur();
                                        return;
                                    }

                                    if (e.key === 'Tab' && !e.shiftKey) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        editor?.commands.focus();
                                        editor?.commands.focus('start');
                                        return;
                                    }

                                    if (e.key === 'Tab' && e.shiftKey) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                    }

                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        if (showSearch) {
                                            setShowSearch(false);
                                        } else if (showShortcuts) {
                                            setShowShortcuts(false);
                                        } else if (showDeleteConfirm) {
                                            setShowDeleteConfirm(false);
                                        }
                                        return;
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
                                if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    createDocument();
                                    return;
                                }
                                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Delete') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (currentDocument) {
                                        setShowDeleteConfirm(true);
                                    }
                                    return;
                                }

                                if (e.key === 'Tab') {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    if (editor?.isActive('listItem')) {
                                        if (e.shiftKey) {
                                            editor.commands.liftListItem('listItem');
                                        } else {
                                            editor.commands.sinkListItem('listItem');
                                        }
                                    } else {
                                        editor?.commands.insertContent('\t');
                                    }
                                    return;
                                }

                                if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowSearch(prev => !prev);
                                    return;
                                }

                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (showSearch) {
                                        setShowSearch(false);
                                    } else if (showShortcuts) {
                                        setShowShortcuts(false);
                                    } else if (showDeleteConfirm) {
                                        setShowDeleteConfirm(false);
                                    }
                                    return;
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