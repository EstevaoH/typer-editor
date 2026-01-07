"use client";

import { Editor } from "@tiptap/react";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Type } from "lucide-react";

interface FontSizeSelectorProps {
    editor: Editor;
}

const FONT_SIZES = [
    { label: "Pequeno", value: "12px" },
    { label: "Normal", value: "16px" },
    { label: "Médio", value: "18px" },
    { label: "Grande", value: "24px" },
    { label: "Muito Grande", value: "32px" },
    { label: "Enorme", value: "48px" },
];

export function FontSizeSelector({ editor }: FontSizeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const setFontSize = (size: string) => {
        editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="p-2 rounded cursor-pointer text-zinc-300 hover:bg-zinc-700"
                    title="Tamanho da Fonte"
                >
                    <Type className="w-4 h-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-zinc-900 border-zinc-700 text-zinc-100 p-2">
                <div className="space-y-1">
                    {FONT_SIZES.map((size) => (
                        <button
                            key={size.value}
                            onClick={() => setFontSize(size.value)}
                            className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800 text-sm transition-colors"
                            style={{ fontSize: size.value }}
                        >
                            {size.label}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
