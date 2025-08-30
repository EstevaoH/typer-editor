// components/keyboard-shortcuts.tsx (atualizado)
"use client"

import React from 'react'
import { X, Keyboard } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { motion, AnimatePresence } from 'framer-motion'

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useHotkeys('esc', onClose, { enabled: isOpen })

  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Salvar documento' },
    { keys: ['Ctrl', 'F'], description: 'Buscar no documento' },
    { keys: ['Ctrl', 'D'], description: 'Marcar/desmarcar como favorito' },
    { keys: ['Ctrl', '/'], description: 'Abrir atalhos de teclado' },
    { keys: ['Ctrl', 'B'], description: 'Negrito' },
    { keys: ['Ctrl', 'I'], description: 'Itálico' },
    { keys: ['Ctrl', 'U'], description: 'Sublinhado' },
    { keys: ['Ctrl', 'K'], description: 'Link' },
    { keys: ['Ctrl', 'Shift', '1'], description: 'Título 1' },
    { keys: ['Ctrl', 'Shift', '2'], description: 'Título 2' },
    { keys: ['Ctrl', 'Shift', '3'], description: 'Título 3' },
    { keys: ['Tab'], description: 'Indentar (no editor)' },
    { keys: ['Shift', 'Tab'], description: 'Remover indentação' },
    { keys: ['Ctrl', 'Z'], description: 'Desfazer' },
    { keys: ['Ctrl', 'Y'], description: 'Refazer' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay com animação */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal com animação */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Atalhos de Teclado</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid gap-4">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <span className="text-sm text-muted-foreground">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-xs font-mono bg-border rounded-md min-w-[2rem] text-center">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground mx-1">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/20">
                <p className="text-xs text-muted-foreground text-center">
                  Pressione ESC para fechar
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}