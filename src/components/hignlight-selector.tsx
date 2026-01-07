"use client";

import { HighlighterIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Editor } from "@tiptap/react";
import { useState } from "react";

export function HignlightSelector({ editor }: { editor: Editor | null }) {
    const [customColor, setCustomColor] = useState("#facc15");

    const presetColors = [
        { color: "#fef08a", name: "Amarelo Claro" },
        { color: "#facc15", name: "Amarelo" },
        { color: "#fca5a5", name: "Vermelho Claro" },
        { color: "#f87171", name: "Vermelho" },
        { color: "#86efac", name: "Verde Claro" },
        { color: "#34d399", name: "Verde" },
        { color: "#7dd3fc", name: "Azul Claro" },
        { color: "#60a5fa", name: "Azul" },
        { color: "#c4b5fd", name: "Roxo Claro" },
        { color: "#a78bfa", name: "Roxo" },
        { color: "#f9a8d4", name: "Rosa Claro" },
        { color: "#f472b6", name: "Rosa" },
        { color: "#fdba74", name: "Laranja Claro" },
        { color: "#fb923c", name: "Laranja" },
        { color: "#d4d4d8", name: "Cinza Claro" },
        { color: "#a1a1aa", name: "Cinza" },
    ];

    if (!editor) return null;

    const currentHighlight = editor.getAttributes("highlight").color;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 cursor-pointer rounded relative ${editor.isActive("highlight")
                            ? "bg-zinc-600 text-white"
                            : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                    title="Marcador de texto"
                >
                    <HighlighterIcon className="w-4 h-4" />
                    <span
                        className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
                        style={{
                            backgroundColor: currentHighlight || "transparent",
                        }}
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 bg-zinc-900 border border-zinc-700 rounded-lg">
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-zinc-400 mb-2 block">
                            Seletor de Cor
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={customColor}
                                onChange={(e) => {
                                    setCustomColor(e.target.value);
                                    editor.chain().focus().toggleHighlight({ color: e.target.value }).run();
                                }}
                                className="w-full h-10 rounded cursor-pointer bg-zinc-800 border border-zinc-700"
                            />
                            <div
                                className="w-10 h-10 rounded border-2 border-zinc-700"
                                style={{ backgroundColor: customColor }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400 mb-2 block">
                            Cores Predefinidas
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {presetColors.map(({ color, name }) => {
                                const isActive = currentHighlight === color;
                                return (
                                    <button
                                        key={color}
                                        title={name}
                                        onClick={() =>
                                            editor.chain().focus().toggleHighlight({ color }).run()
                                        }
                                        className={`w-12 h-8 rounded border-2 ${isActive
                                                ? "border-white scale-105 shadow-lg"
                                                : "border-zinc-600"
                                            } hover:scale-105 transition-transform`}
                                        style={{ backgroundColor: color }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={() => editor.chain().focus().unsetHighlight().run()}
                        className="w-full px-3 py-2 text-xs rounded bg-red-900/30 text-red-400 hover:bg-red-900/50 transition border border-red-900/50"
                    >
                        Remover Marcador
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}