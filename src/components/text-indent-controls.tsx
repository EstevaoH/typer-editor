"use client";

import { Editor } from "@tiptap/react";
import { IndentDecrease, IndentIncrease } from "lucide-react";

interface TextIndentControlsProps {
    editor: Editor;
}

export function TextIndentControls({ editor }: TextIndentControlsProps) {
    const increaseIndent = () => {
        // Get current indent level
        const { from, to } = editor.state.selection;
        const node = editor.state.doc.nodeAt(from);

        if (node) {
            const currentIndent = node.attrs.indent || 0;
            const newIndent = Math.min(currentIndent + 1, 8); // Max 8 levels

            editor
                .chain()
                .focus()
                .updateAttributes(node.type.name, { indent: newIndent })
                .run();
        }
    };

    const decreaseIndent = () => {
        const { from } = editor.state.selection;
        const node = editor.state.doc.nodeAt(from);

        if (node) {
            const currentIndent = node.attrs.indent || 0;
            const newIndent = Math.max(currentIndent - 1, 0);

            editor
                .chain()
                .focus()
                .updateAttributes(node.type.name, { indent: newIndent })
                .run();
        }
    };

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={decreaseIndent}
                className="p-2 rounded cursor-pointer text-zinc-300 hover:bg-zinc-700"
                title="Diminuir Recuo (Shift+Tab)"
            >
                <IndentDecrease className="w-4 h-4" />
            </button>
            <button
                onClick={increaseIndent}
                className="p-2 rounded cursor-pointer text-zinc-300 hover:bg-zinc-700"
                title="Aumentar Recuo (Tab)"
            >
                <IndentIncrease className="w-4 h-4" />
            </button>
        </div>
    );
}
