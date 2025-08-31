import { TypeIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Editor } from "@tiptap/react";

export function HeadingSelector({ editor }: { editor: Editor | null }) {

    if (!editor) return null
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 rounded cursor-pointer ${editor.isActive('heading') ||
                        editor.isActive('paragraph')
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                    title="Formatação de texto"
                >
                    <TypeIcon className="w-4 h-4" />
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-2 bg-zinc-800 border border-zinc-700 rounded shadow-lg">
                <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`px-2 py-1 text-sm rounded flex-1 ${editor.isActive('heading', { level: 1 })
                                ? 'bg-zinc-700 text-white'
                                : 'text-zinc-300 hover:bg-zinc-700'
                                }`}
                        >
                            H1
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`px-2 py-1 text-sm rounded flex-1 ${editor.isActive('heading', { level: 2 })
                                ? 'bg-zinc-700 text-white'
                                : 'text-zinc-300 hover:bg-zinc-700'
                                }`}
                        >
                            H2
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`px-2 py-1 text-sm rounded flex-1 ${editor.isActive('heading', { level: 3 })
                                ? 'bg-zinc-700 text-white'
                                : 'text-zinc-300 hover:bg-zinc-700'
                                }`}
                        >
                            H3
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            className={`px-2 py-1 text-sm rounded flex-1 ${editor.isActive('paragraph')
                                ? 'bg-zinc-700 text-white'
                                : 'text-zinc-300 hover:bg-zinc-700'
                                }`}
                        >
                            P
                        </button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}