import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Editor } from "@tiptap/react";

export function AlignmentSelector({ editor }: { editor: Editor | null }) {

    if (!editor) return null
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 rounded ${editor.isActive({ textAlign: "center" }) ||
                        editor.isActive({ textAlign: "right" }) ||
                        editor.isActive({ textAlign: "justify" })
                        ? "bg-zinc-600 text-white"
                        : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                    title="Alinhamento de texto (Ctrl+Shift+L/R/E/J)"
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-zinc-800 border border-zinc-700 rounded">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        className={`flex items-center gap-2 p-2 rounded text-sm ${editor.isActive({ textAlign: "left" })
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-700"
                            }`}
                    >
                        <AlignLeft className="w-4 h-4" />
                        Alinhar à esquerda
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        className={`flex items-center gap-2 p-2 rounded text-sm ${editor.isActive({ textAlign: "center" })
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-700"
                            }`}
                    >
                        <AlignCenter className="w-4 h-4" />
                        Centralizar
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        className={`flex items-center gap-2 p-2 rounded text-sm ${editor.isActive({ textAlign: "right" })
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-700"
                            }`}
                    >
                        <AlignRight className="w-4 h-4" />
                        Alinhar à direita
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        className={`flex items-center gap-2 p-2 rounded text-sm ${editor.isActive({ textAlign: "justify" })
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-700"
                            }`}
                    >
                        <AlignJustify className="w-4 h-4" />
                        Justificar
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    )
}