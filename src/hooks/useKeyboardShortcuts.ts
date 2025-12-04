import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onToggleShortcuts?: () => void;
  onCreateDocument?: () => void;
  onShare?: () => void;
  onToggleSearch?: () => void;
  onDelete?: () => void;
}

export function useKeyboardShortcuts({
  onToggleShortcuts,
  onCreateDocument,
  onShare,
  onToggleSearch,
  onDelete,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Shortcuts Modal: Ctrl + /
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        e.stopPropagation();
        onToggleShortcuts?.();
        return;
      }

      // Create New Document: Ctrl + Alt + N
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        e.stopPropagation();
        onCreateDocument?.();
        return;
      }

      // Share Document: Ctrl + Shift + E
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        e.stopPropagation();
        onShare?.();
        return;
      }

      // Toggle Search: Ctrl + F
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        e.stopPropagation();
        onToggleSearch?.();
        return;
      }

      // Delete Document: Ctrl + Shift + Delete
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onToggleShortcuts, onCreateDocument, onShare, onToggleSearch, onDelete]);
}
