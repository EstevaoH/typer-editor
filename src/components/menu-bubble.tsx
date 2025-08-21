import { BubbleMenu } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { BubbleButton } from "./bubble-button";
import { BoldIcon, ChevronDown, Code2Icon, ItalicIcon, MessageCircleMore, StrikethroughIcon } from "lucide-react";

export function MenuBubble({ editor }: { editor: any }) {
    return (
        <BubbleMenu
            className="bg-zinc-800 shadow-xl border border-zinc-700 rounded-lg overflow-hidden flex divide-x divide-zinc-700"
            editor={editor}
        >
            <Popover>
                <PopoverTrigger asChild>
                    <BubbleButton
                        className="p-2 text-zinc-200 text-sm flex items-center gap-1.5 font-medium hover:bg-zinc-700 transition-colors"
                    >
                        <span>Formato</span>
                        <ChevronDown className="w-4 h-4" />
                    </BubbleButton>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-zinc-800 border border-zinc-700 rounded shadow-lg">
                    <div className="flex flex-col">
                        <button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            className={`px-3 py-2 text-left text-sm rounded hover:bg-zinc-700 ${editor.isActive('paragraph') ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700'} `}

                        >
                            Texto normal
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`px-3 py-2 text-left text-sm rounded hover:bg-zinc-700 ${editor.isActive('heading', { level: 1 }) ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700'} `}

                        >
                            Título 1
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`px-3 py-2 text-left text-sm rounded hover:bg-zinc-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700'} `}
                        >
                            Título 2
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`px-3 py-2 text-left text-sm rounded hover:bg-zinc-700 ${editor.isActive('heading', { level: 3 }) ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700'} `}

                        >
                            Título 3
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
            <div className="flex items-center">
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    data-active={editor.isActive('bold')}
                    className={`p-2 rounded relative ${editor.isActive('link')
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                    title="Negrito (Ctrl+B)"
                >
                    <BoldIcon className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    data-active={editor.isActive('italic')}
                    className={`p-2 rounded relative ${editor.isActive('link')
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                    title="Itálico (Ctrl+I)"
                >
                    <ItalicIcon className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    data-active={editor.isActive('strike')}
                    className={`p-2 rounded relative ${editor.isActive('link')
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                    title="Tachado (Ctrl+Shift+X)"
                >
                    <StrikethroughIcon className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    data-active={editor.isActive('code')}
                    className={`p-2 rounded relative ${editor.isActive('link')
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                    title="Código (Ctrl+E)"
                >
                    <Code2Icon className="w-4 h-4" />
                </BubbleButton>
            </div>
        </BubbleMenu>
    )
}