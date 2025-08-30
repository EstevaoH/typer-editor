"use client"

import React from 'react'
import { Keyboard, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingShortcutButtonProps {
  onClick: () => void
  isVisible: boolean
}

export function FloatingShortcutButton({ onClick, isVisible }: FloatingShortcutButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          title="Atalhos de teclado (Ctrl+/)"
        >
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Keyboard className="w-6 h-6" />
          </motion.div>

          <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full border border-border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Ctrl+/
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}