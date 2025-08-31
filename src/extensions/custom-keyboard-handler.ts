// extensions/custom-keyboard-handler.ts
import { Extension } from '@tiptap/core';

export const CustomKeyboardHandler = Extension.create({
    name: 'customKeyboardHandler',

    addKeyboardShortcuts() {
        return {
            Tab: () => {
                if (this.editor.isActive('listItem')) {
                    return this.editor.commands.sinkListItem('listItem');
                }
                return this.editor.commands.insertContent('\t');
            },
            'Shift-Tab': () => {
                if (this.editor.isActive('listItem')) {
                    return this.editor.commands.liftListItem('listItem');
                }
                return false; // Deixa o browser lidar com Shift+Tab fora de listas
            },
        };
    },
});

// Adicione ao seu editorExtensions
export const editorExtensions = [
  // ... outras extensões
  CustomKeyboardHandler,
];