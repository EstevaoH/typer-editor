"use client"

import React, { useEffect } from 'react'
import { X, Keyboard, Bold, Indent, Italic, Link, List, ListChecks, ListOrdered, Outdent, Redo, Save, Search, Star, Underline, Undo, Command } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

const shortcutIcons: Record<string, React.ReactNode> = {
  'Salvar documento': <Save className="w-4 h-4" />,
  'Buscar no documento': <Search className="w-4 h-4" />,
  'Marcar/desmarcar como favorito': <Star className="w-4 h-4" />,
  'Abrir atalhos de teclado': <Keyboard className="w-4 h-4" />,
  'Negrito': <Bold className="w-4 h-4" />,
  'Itálico': <Italic className="w-4 h-4" />,
  'Sublinhado': <Underline className="w-4 h-4" />,
  'Link': <Link className="w-4 h-4" />,
  'Lista com marcadores': <List className="w-4 h-4" />,
  'Lista numerada': <ListOrdered className="w-4 h-4" />,
  'Lista de tarefas': <ListChecks className="w-4 h-4" />,
  'Desfazer': <Undo className="w-4 h-4" />,
  'Refazer': <Redo className="w-4 h-4" />,
  'Indentar (no editor)': <Indent className="w-4 h-4" />,
  'Remover indentação': <Outdent className="w-4 h-4" />,
  'Aumentar recuo (em listas)': <Indent className="w-4 h-4" />,
  'Diminuir recuo (em listas)': <Outdent className="w-4 h-4" />,
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcutCategories = [
    {
      title: "Geral",
      shortcuts: [
        { keys: ['Ctrl', 'S'], description: 'Salvar documento' },
        { keys: ['Ctrl', 'F'], description: 'Buscar no documento' },
        { keys: ['Ctrl', 'D'], description: 'Marcar/desmarcar como favorito' },
        { keys: ['Ctrl', '/'], description: 'Abrir atalhos de teclado' },
      ]
    },
    {
      title: "Formatação de Texto",
      shortcuts: [
        { keys: ['Ctrl', 'B'], description: 'Negrito' },
        { keys: ['Ctrl', 'I'], description: 'Itálico' },
        { keys: ['Ctrl', 'U'], description: 'Sublinhado' },
        { keys: ['Ctrl', 'K'], description: 'Link' },
      ]
    },
    {
      title: "Títulos",
      shortcuts: [
        { keys: ['Ctrl', 'Shift', '1'], description: 'Título 1' },
        { keys: ['Ctrl', 'Shift', '2'], description: 'Título 2' },
        { keys: ['Ctrl', 'Shift', '3'], description: 'Título 3' },
      ]
    },
    {
      title: "Listas",
      shortcuts: [
        { keys: ['Ctrl', 'Shift', '8'], description: 'Lista com marcadores' },
        { keys: ['Ctrl', 'Shift', '7'], description: 'Lista numerada' },
        { keys: ['Ctrl', 'Shift', '9'], description: 'Lista de tarefas' },
        { keys: ['Tab'], description: 'Aumentar recuo (em listas)' },
        { keys: ['Shift', 'Tab'], description: 'Diminuir recuo (em listas)' },
      ]
    },
    {
      title: "Edição",
      shortcuts: [
        { keys: ['Ctrl', 'Z'], description: 'Desfazer' },
        { keys: ['Ctrl', 'Y'], description: 'Refazer' },
        { keys: ['Tab'], description: 'Indentar (no editor)' },
        { keys: ['Shift', 'Tab'], description: 'Remover indentação' },
      ]
    }
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === 'Escape' && isOpen) {
        onClose();
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  const renderKey = (key: string) => {
    if (key === 'Ctrl' || key === 'Cmd') {
      return (
        <kbd className="px-2 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-700 rounded-md flex items-center gap-1 min-w-[2.2rem] justify-center">
          {navigator.platform.includes('Mac') ? <Command className="w-3 h-3" /> : 'Ctrl'}
        </kbd>
      );
    }

    return (
      <kbd className="px-2 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-700 rounded-md min-w-[2.2rem] text-center">
        {key}
      </kbd>
    );
  };

  return (
 <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Keyboard className="w-6 h-6 text-zinc-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Atalhos de Teclado</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Descubra todas as formas de ser mais produtivo</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 dark:text-zinc-400"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid gap-6">
                  {shortcutCategories.map((category, categoryIndex) => (
                    <motion.div
                      key={categoryIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.1 }}
                    >
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center">
                        {category.title}
                      </h3>
                      <div className="grid gap-2">
                        {category.shortcuts.map((shortcut, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
                                {shortcutIcons[shortcut.description] || <Keyboard className="w-4 h-4" />}
                              </div>
                              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                {shortcut.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {shortcut.keys.map((key, keyIndex) => (
                                <React.Fragment key={keyIndex}>
                                  {renderKey(key)}
                                  {keyIndex < shortcut.keys.length - 1 && (
                                    <span className="text-zinc-400 dark:text-zinc-500 mx-1 text-xs">+</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center flex items-center justify-center gap-1">
                  <kbd className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 rounded">Esc</kbd>
                  para fechar • 
                  <kbd className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 rounded ml-1 flex items-center gap-1">
                    {navigator.platform.includes('Mac') ? <Command className="w-3 h-3" /> : 'Ctrl'} + /
                  </kbd>
                  para abrir
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}