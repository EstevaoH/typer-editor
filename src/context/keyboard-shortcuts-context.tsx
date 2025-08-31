// contexts/keyboard-shortcuts-context.tsx
"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface KeyboardShortcutsContextType {
  registerShortcut: (hotkey: string, callback: () => void) => void;
  unregisterShortcut: (hotkey: string) => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const registeredShortcuts = React.useRef(new Map<string, () => void>());

  const registerShortcut = (hotkey: string, callback: () => void) => {
    registeredShortcuts.current.set(hotkey, callback);
  };

  const unregisterShortcut = (hotkey: string) => {
    registeredShortcuts.current.delete(hotkey);
  };

  // Registrar todos os atalhos globais
  useHotkeys('ctrl+f, cmd+f', (e) => {
    e.preventDefault();
    const callback = registeredShortcuts.current.get('search');
    callback?.();
  });

  useHotkeys('ctrl+/, cmd+/', (e) => {
    e.preventDefault();
    const callback = registeredShortcuts.current.get('shortcuts');
    callback?.();
  });

  useHotkeys('ctrl+d, cmd+d', (e) => {
    e.preventDefault();
    const callback = registeredShortcuts.current.get('favorite');
    callback?.();
  });

  useHotkeys('ctrl+shift+r, cmd+shift+r', (e) => {
    e.preventDefault();
    const callback = registeredShortcuts.current.get('reference');
    callback?.();
  });

  useHotkeys('esc', (e) => {
    e.preventDefault();
    const callback = registeredShortcuts.current.get('escape');
    callback?.();
  });

  const value: KeyboardShortcutsContextType = {
    registerShortcut,
    unregisterShortcut
  };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (context === undefined) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
}