"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSelectorProps {
    editor: Editor | null;
    onClose: () => void;
    isOpen: boolean;
}

export function SearchSelector({ editor, onClose, isOpen }: SearchSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);
    const matches = editor?.storage.searchAndReplace?.results || [];
    const currentIndex = editor?.storage.searchAndReplace?.current || 0;

    useEffect(() => {
        if (!editor) return;

        if (searchTerm) {
            editor.commands.setSearchTerm(searchTerm);
        } else {
            editor.commands.setSearchTerm('');
        }

        return () => {
            editor.commands.setSearchTerm('');
        };
    }, [searchTerm, editor]);

    useEffect(() => {
        if (isOpen && searchRef.current) {
            setTimeout(() => {
                searchRef.current?.focus();
                searchRef.current?.select();
            }, 100);
        }
    }, [isOpen]);

    useHotkeys('ctrl+f, cmd+f', (e) => {
        e.preventDefault();
    }, { enabled: true });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed top-15 right-5 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-2 min-w-[320px]"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                        className="flex items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <input
                                ref={searchRef}
                                type="text"
                                className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Buscar no documento (Ctrl+F)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                        e.preventDefault();
                                        onClose();
                                    }
                                }}
                            />
                            <svg
                                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                            </svg>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            {matches.length > 0 ? (
                                <>
                                    <span className="text-xs text-gray-600 font-medium min-w-[50px] text-center">
                                        {currentIndex + 1} de {matches.length}
                                    </span>
                                </>
                            ) : searchTerm ? (
                                <span className="text-xs text-gray-400 italic min-w-[100px]">Nenhum resultado</span>
                            ) : null}

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center w-7 h-7 border border-gray-300 rounded bg-white text-gray-600 hover:cursor-pointer hover:text-red-600 hover:bg-gray-100 hover:border-gray-400 transition"
                                onClick={onClose}
                                title="Fechar (ESC)"
                            >
                                ✕
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}