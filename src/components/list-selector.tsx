import { Indent, List, ListChecks, ListCollapse, ListOrdered, Outdent } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Editor } from "@tiptap/react";

export function ListSelector({ editor }: { editor: Editor | null }) {

    if (!editor) return null
    
    return (
    < Popover >
        <PopoverTrigger asChild>
            <button
                className={`p-2 rounded cursor-pointer relative ${editor.isActive('bulletList') ||
                    editor.isActive('orderedList') ||
                    editor.isActive('taskList')
                    ? "bg-zinc-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-700"
                    }`}
                title="Opções de lista (Ctrl+Shift+7/8)"
            >
                <ListCollapse className="w-4 h-4" />
            </button>
        </PopoverTrigger>

        <PopoverContent
            className="w-auto p-2 bg-zinc-800 border border-zinc-700 rounded shadow-lg"
            align="start"
            sideOffset={5}
        >
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${editor.isActive('bulletList')
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    <List className="w-4 h-4" />
                    Lista com marcadores
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${editor.isActive('orderedList')
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    <ListOrdered className="w-4 h-4" />
                    Lista numerada
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${editor.isActive('taskList')
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    <ListChecks className="w-4 h-4" />
                    Lista de tarefas
                </button>

                <div className="border-t border-zinc-700 my-1"></div>
                <button
                    onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${!editor.can().sinkListItem('listItem')
                        ? "text-zinc-500 cursor-not-allowed"
                        : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    <Indent className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${!editor.can().liftListItem('listItem')
                        ? "text-zinc-500 cursor-not-allowed"
                        : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    <Outdent className="w-4 h-4" />
                    Diminuir recuo
                </button>
            </div>
        </PopoverContent>
    </Popover >
    )
}