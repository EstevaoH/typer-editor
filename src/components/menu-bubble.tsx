"use client";

import { BubbleMenu } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { BubbleButton } from "./bubble-button";
import {
    BoldIcon,
    ChevronDown,
    Code2Icon,
    ItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
    HighlighterIcon,
    Brush,
    Link2,
    Unlink,
    Subscript as SubscriptIcon,
    Superscript as SuperscriptIcon,
    RemoveFormatting,
} from "lucide-react";
import { useState } from "react";

export function MenuBubble({ editor }: { editor: any }) {
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);

    const highlightColors = [
        { color: "#facc15", name: "Amarelo" },
        { color: "#f87171", name: "Vermelho" },
        { color: "#34d399", name: "Verde" },
        { color: "#60a5fa", name: "Azul" },
        { color: "#f472b6", name: "Rosa" },
    ];

    const textColors = [
        { color: "#000000", name: "Preto" },
        { color: "#ef4444", name: "Vermelho" },
        { color: "#f59e0b", name: "Laranja" },
        { color: "#22c55e", name: "Verde" },
        { color: "#3b82f6", name: "Azul" },
        { color: "#8b5cf6", name: "Roxo" },
    ];

    const setLink = () => {
        if (linkUrl) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: linkUrl })
                .run();
            setLinkUrl("");
            setShowLinkInput(false);
        }
    };

    return (
        <BubbleMenu
            className="bg-zinc-900 shadow-2xl border border-zinc-700 rounded-lg overflow-hidden flex divide-x divide-zinc-700 backdrop-blur-sm"
            editor={editor}
            tippyOptions={{ duration: 100 }}
        >
            {/* Format Dropdown */}
            <Popover>
                <PopoverTrigger asChild>
                    <BubbleButton className="px-3 py-2 text-zinc-200 text-sm flex items-center gap-1.5 font-medium hover:bg-zinc-800 transition-colors">
                        <span>Formato</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </BubbleButton>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl">
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            className={`px-3 py-2 text-left text-sm rounded transition ${editor.isActive("paragraph")
                                    ? "bg-zinc-700 text-white"
                                    : "text-zinc-300 hover:bg-zinc-800"
                                }`}
                        >
                            Texto normal
                        </button>
                        {[1, 2, 3, 4].map((level) => (
                            <button
                                key={level}
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({ level }).run()
                                }
                                className={`px-3 py-2 text-left text-sm rounded transition ${editor.isActive("heading", { level })
                                        ? "bg-zinc-700 text-white"
                                        : "text-zinc-300 hover:bg-zinc-800"
                                    }`}
                            >
                                Título {level}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Basic Formatting */}
            <div className="flex items-center">
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    data-active={editor.isActive("bold")}
                    className={`p-2 transition ${editor.isActive("bold")
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-800"
                        }`}
                    title="Negrito (Ctrl+B)"
                >
                    <BoldIcon className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    data-active={editor.isActive("italic")}
                    className={`p-2 transition ${editor.isActive("italic")
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-800"
                        }`}
                    title="Itálico (Ctrl+I)"
                >
                    <ItalicIcon className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    data-active={editor.isActive("underline")}
                    className={`p-2 transition ${editor.isActive("underline")
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-800"
                        }`}
                    title="Sublinhado (Ctrl+U)"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    data-active={editor.isActive("strike")}
                    className={`p-2 transition ${editor.isActive("strike")
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-800"
                        }`}
                    title="Tachado (Ctrl+Shift+X)"
                >
                    <StrikethroughIcon className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    data-active={editor.isActive("code")}
                    className={`p-2 transition ${editor.isActive("code")
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-800"
                        }`}
                    title="Código (Ctrl+E)"
                >
                    <Code2Icon className="w-4 h-4" />
                </BubbleButton>
            </div>

            {/* Subscript/Superscript */}
            <div className="flex items-center">
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    data-active={editor.isActive("subscript")}
                    className={`p-2 transition ${editor.isActive("subscript")
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-800"
                        }`}
                    title="Subscrito"
                >
                    <SubscriptIcon className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    data-active={editor.isActive("superscript")}
                    className={`p-2 transition ${editor.isActive("superscript")
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-300 hover:bg-zinc-800"
                        }`}
                    title="Sobrescrito"
                >
                    <SuperscriptIcon className="w-4 h-4" />
                </BubbleButton>
            </div>

            {/* Text Color */}
            <Popover>
                <PopoverTrigger asChild>
                    <BubbleButton
                        className="p-2 text-zinc-300 hover:bg-zinc-800 transition relative"
                        title="Cor do texto"
                    >
                        <Brush className="w-4 h-4" />
                        <span
                            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
                            style={{
                                backgroundColor:
                                    editor.getAttributes("textStyle").color || "#ffffff",
                            }}
                        />
                    </BubbleButton>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-zinc-900 border border-zinc-700 rounded-lg">
                    <div className="flex gap-1.5">
                        {textColors.map(({ color, name }) => (
                            <button
                                key={color}
                                title={name}
                                onClick={() => editor.chain().focus().setColor(color).run()}
                                className="w-6 h-6 rounded-full border-2 border-zinc-600 hover:scale-110 transition"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Highlight */}
            <Popover>
                <PopoverTrigger asChild>
                    <BubbleButton
                        className="p-2 text-zinc-300 hover:bg-zinc-800 transition relative"
                        title="Marcador"
                    >
                        <HighlighterIcon className="w-4 h-4" />
                        <span
                            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
                            style={{
                                backgroundColor:
                                    editor.getAttributes("highlight").color || "transparent",
                            }}
                        />
                    </BubbleButton>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-zinc-900 border border-zinc-700 rounded-lg">
                    <div className="flex gap-1.5">
                        {highlightColors.map(({ color, name }) => (
                            <button
                                key={color}
                                title={name}
                                onClick={() =>
                                    editor.chain().focus().toggleHighlight({ color }).run()
                                }
                                className="w-6 h-6 rounded-full border-2 border-zinc-600 hover:scale-110 transition"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Link */}
            <div className="flex items-center">
                {!editor.isActive("link") ? (
                    <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
                        <PopoverTrigger asChild>
                            <BubbleButton
                                className="p-2 text-zinc-300 hover:bg-zinc-800 transition"
                                title="Adicionar link"
                            >
                                <Link2 className="w-4 h-4" />
                            </BubbleButton>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3 bg-zinc-900 border border-zinc-700 rounded-lg">
                            <div className="space-y-2">
                                <input
                                    type="url"
                                    placeholder="Cole o link..."
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && setLink()}
                                    className="w-full px-3 py-2 text-sm rounded bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-primary"
                                    autoFocus
                                />
                                <button
                                    onClick={setLink}
                                    className="w-full px-3 py-2 text-sm rounded bg-primary/20 text-primary hover:bg-primary/30 transition"
                                >
                                    Adicionar Link
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <BubbleButton
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        className="p-2 bg-zinc-700 text-white hover:bg-zinc-600 transition"
                        title="Remover link"
                    >
                        <Unlink className="w-4 h-4" />
                    </BubbleButton>
                )}
            </div>

            {/* Clear Formatting */}
            <BubbleButton
                onClick={() =>
                    editor.chain().focus().clearNodes().unsetAllMarks().run()
                }
                className="p-2 text-zinc-300 hover:bg-zinc-800 transition"
                title="Limpar formatação"
            >
                <RemoveFormatting className="w-4 h-4" />
            </BubbleButton>
        </BubbleMenu>
    );
}