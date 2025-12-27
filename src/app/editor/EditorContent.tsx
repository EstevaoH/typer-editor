"use client"
import React, { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
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
import { ChevronsLeftRightEllipsis, FilePenLine, Loader2 } from 'lucide-react';
import { SearchSelector } from '@/components/search-selector';
import { ShowDeleteConfirm } from '@/components/show-delete-confirm';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/toast-context';

import { useSettings } from "@/context/settings-context";
import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { TagSelector } from "@/components/tag-selector";
import { SaveAsTemplateDialog } from "@/components/templates/save-as-template-dialog";

// Lazy load componentes pesados para code splitting
const StatisticsDialog = lazy(() => import('@/components/statistics-dialog').then(module => ({ default: module.StatisticsDialog })));
const DocumentBreadcrumb = lazy(() => import('@/components/document-breadcrumb').then(module => ({ default: module.DocumentBreadcrumb })));

const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export function Editor() {
    const { fontFamily } = useSettings();
    const { currentDocument, updateDocument, saveDocument, toggleFavorite, handleFirstInput, createDocument, deleteDocument, } = useDocuments()
    const { isMobile } = useSidebar()

    const getFontClass = () => {
        switch (fontFamily) {
            case 'inter': return 'font-inter';
            case 'serif': return 'font-serif';
            case 'mono': return 'font-mono';
            default: return 'font-sans';
        }
    };

    const [title, setTitle] = useState(currentDocument?.title || '')
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)
    const [hasHandledFirstInput, setHasHandledFirstInput] = useState(false)
    const [showSearch, setShowSearch] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showFloatingButton, setShowFloatingButton] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSaveTemplate, setShowSaveTemplate] = useState(false);
    const [skipDeleteConfirmation, setSkipDeleteConfirmation] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const toast = useToast()

    const editor = useEditor({
        extensions: editorExtensions,
        content: currentDocument?.content || '',
        onUpdate: ({ editor }) => {
            try {
                const content = editor.getHTML();

                if (!currentDocument && !hasHandledFirstInput && content.trim() !== '') {
                    handleFirstInput();
                    setHasHandledFirstInput(true);
                }

                updateDocument({ content });
            } catch (error) {
                console.error("Erro ao atualizar documento:", error);
                toast.showToast("⚠️ Erro ao salvar alterações. Tente novamente.");
            }
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
        immediatelyRender: false,
        onCreate: () => {
            setIsLoaded(true);
        }
    });

    const handleToggleFavorite = useCallback((id: string) => {
        if (currentDocument) {
            toggleFavorite(id);
            toast.showToast(currentDocument.isFavorite ? '⭐ Desfavoritado' : '🌟 Favoritado');
        }
    }, [currentDocument, toggleFavorite, toast]);

    const handleDeleteDocument = useCallback(() => {
        if (currentDocument) {
            deleteDocument(currentDocument.id);
            setShowDeleteConfirm(false);
        }
    }, [currentDocument, deleteDocument]);

    useEffect(() => {
        const savedPreference = localStorage.getItem('skipDeleteConfirmation');
        if (savedPreference === 'true') {
            setSkipDeleteConfirmation(true);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingButton(false);
            setTimeout(() => setShowFloatingButton(true), 1000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);







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
        if (editor) {
            if (currentDocument) {
                // Only update content if it's different to avoid cursor jumps
                const currentContent = editor.getHTML();
                if (currentContent !== currentDocument.content) {
                    editor.commands.setContent(currentDocument.content || '', false);
                }
            } else {
                editor.commands.setContent('', false);
            }
        }
    }, [currentDocument, editor]);

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

    if (!isLoaded) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando editor...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ToolBar
                editor={editor}
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
            <div className="flex h-[calc(100vh-4rem)]">
                <div className="flex-1 overflow-auto pt-4 px-2 sm:px-4">
                    <div className={cn(
                        "max-w-full sm:max-w-screen mx-auto prose prose-violet dark:prose-invert tiptap",
                        getFontClass()
                    )}>
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
                                        return;
                                    }

                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        if (showSearch) {
                                            setShowSearch(false);
                                        } else if (showDeleteConfirm) {
                                            setShowDeleteConfirm(false);
                                        }
                                        return;
                                    }
                                }}
                                placeholder="Digite o título aqui..."
                                className="w-full bg-transparent text-2xl sm:text-4xl font-bold outline-none placeholder:text-muted-foreground/60 text-foreground resize-none overflow-hidden border-b pb-3 focus:border-primary transition-all duration-200 group-hover:border-border/60"
                                style={{ minHeight: '60px' }}
                                rows={1}
                                maxLength={120}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                {title.length}/120
                            </div>
                        </div>
                        <Suspense fallback={<div className="h-8" />}>
                            <DocumentBreadcrumb />
                        </Suspense>

                        {/* Tag Selector */}
                        {currentDocument && (
                            <div className="mb-4">
                                <TagSelector
                                    documentId={currentDocument.id}
                                    tags={currentDocument.tags || []}
                                />
                            </div>
                        )}

                        <div
                            ref={editorRef}
                            className={`min-h-[calc(100vh-10rem)] border-2 rounded-xl p-6 transition-all duration-300 ${isEditorFocused
                                ? 'border-primary/30 bg-background '
                                : 'border-border/50 bg-background/50 hover:border-border/70 hover:bg-background/70'
                                }`}
                            onClick={() => editor?.commands.focus()}
                            onKeyDown={(e) => {
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
                            }}
                        >
                            <EditorContent
                                editor={editor}
                                className="outline-none min-h-screen"
                            />
                            <div className="mt-4 pt-4 border-t border-border/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <FilePenLine className="w-4 h-4" />
                                        {currentDocument?.updatedAt
                                            ? `Editado ${new Date(currentDocument.updatedAt).toLocaleDateString('pt-BR')}`
                                            : 'Novo documento'
                                        }
                                    </span>

                                    {editor && (
                                        <button
                                            onClick={() => setIsStatsOpen(true)}
                                            className="flex items-center gap-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded transition-colors cursor-pointer"
                                            title="Ver estatísticas detalhadas"
                                        >
                                            <ChevronsLeftRightEllipsis className="w-4 h-4" />
                                            {editor.storage.characterCount.characters()} caracteres
                                        </button>
                                    )}

                                    {currentDocument && (
                                        <button
                                            onClick={() => setShowSaveTemplate(true)}
                                            className="flex items-center gap-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded transition-colors cursor-pointer"
                                            title="Salvar como Template"
                                        >
                                            <FilePenLine className="w-4 h-4" />
                                            Salvar como Template
                                        </button>
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
            <Suspense fallback={null}>
                <StatisticsDialog
                    open={isStatsOpen}
                    onOpenChange={setIsStatsOpen}
                    editor={editor}
                />
            </Suspense>
            {currentDocument && (
                <SaveAsTemplateDialog
                    open={showSaveTemplate}
                    onOpenChange={setShowSaveTemplate}
                    documentId={currentDocument.id}
                    initialTitle={currentDocument.title}
                />
            )}
        </>
    );
}