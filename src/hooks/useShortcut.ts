// hooks/use-shortcut.ts
import { useKeyboardShortcuts } from '@/context/keyboard-shortcuts-context';
import { useEffect } from 'react';


export function useShortcut(action: string, callback: () => void, dependencies: any[] = []) {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();

  useEffect(() => {
    registerShortcut(action, callback);

    return () => {
      unregisterShortcut(action);
    };
  }, [action, callback, ...dependencies]);
}