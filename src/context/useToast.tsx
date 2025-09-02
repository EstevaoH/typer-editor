"use client"
import { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from "framer-motion"

interface ToastContextType {
  showToast: (message: string, duration?: number) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
  defaultDuration?: number
}

export function ToastProvider({ children, defaultDuration = 6000 }: ToastProviderProps) {
  const [toast, setToast] = useState({
    isVisible: false,
    message: ''
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((message: string, duration?: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    const toastDuration = duration || defaultDuration

    if (!message) {
      console.warn('Toast message is empty')
      return
    }

    setToast({ isVisible: true, message })

    timeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
      timeoutRef.current = null
    }, toastDuration)
  }, [defaultDuration])

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setToast(prev => ({ ...prev, isVisible: false }))
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastInternal isVisible={toast.isVisible} message={toast.message} onClose={hideToast} />
    </ToastContext.Provider>
  )
}
// Componente Toast interno (não precisa ser exportado)
function ToastInternal({ message, isVisible, onClose }: {
  message: string
  isVisible: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 6000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={`toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`}
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}