import { Brush } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Editor } from "@tiptap/react";

export function ColorSelector({ editor }: { editor: Editor | null }) {
    const highlightColors = [
        { color: "#facc15", name: "Amarelo" },
        { color: "#f87171", name: "Vermelho" },
        { color: "#34d399", name: "Verde" },
        { color: "#60a5fa", name: "Azul" },
        { color: "#f472b6", name: "Rosa" },
    ]
    if (!editor) return null
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 rounded cursor-pointer relative ${editor.isActive('textStyle', { color: editor.getAttributes('textStyle').color })
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                    title="Cor do texto"
                >
                    <Brush className="w-4 h-4" />
                    <span
                        className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
                        style={{
                            backgroundColor: editor.getAttributes('textStyle').color || 'transparent'
                        }}
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 flex gap-2 bg-zinc-800 border border-zinc-700 rounded">
                {highlightColors.map(({ color, name }) => {
                    const isActive = editor.getAttributes('textStyle').color === color;
                    return (
                        <button
                            key={color}
                            title={name}
                            onClick={() => editor.chain().focus().setColor(color).run()}
                            className={`w-6 h-6 rounded-full border-2 ${isActive ? 'border-white scale-110' : 'border-zinc-500'
                                } hover:scale-110 transition`}
                            style={{ backgroundColor: color }}
                        />
                    );
                })}
                <button
                    onClick={() => editor.chain().focus().unsetColor().run()}
                    className="px-2 py-1 text-xs rounded bg-red-700 text-white hover:bg-red-600 transition"
                    title="Remover cor"
                >
                    Remover
                </button>
            </PopoverContent>
        </Popover>
    )
}