"use client";

import { Brush } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Editor } from "@tiptap/react";
import { useState } from "react";

export function ColorSelector({ editor }: { editor: Editor | null }) {
    const [customColor, setCustomColor] = useState("#000000");

    const presetColors = [
        { color: "#000000", name: "Preto" },
        { color: "#ffffff", name: "Branco" },
        { color: "#ef4444", name: "Vermelho" },
        { color: "#f97316", name: "Laranja" },
        { color: "#f59e0b", name: "Âmbar" },
        { color: "#eab308", name: "Amarelo" },
        { color: "#84cc16", name: "Lima" },
        { color: "#22c55e", name: "Verde" },
        { color: "#10b981", name: "Esmeralda" },
        { color: "#14b8a6", name: "Cerceta" },
        { color: "#06b6d4", name: "Ciano" },
        { color: "#0ea5e9", name: "Céu" },
        { color: "#3b82f6", name: "Azul" },
        { color: "#6366f1", name: "Índigo" },
        { color: "#8b5cf6", name: "Violeta" },
        { color: "#a855f7", name: "Roxo" },
        { color: "#d946ef", name: "Fúcsia" },
        { color: "#ec4899", name: "Rosa" },
        { color: "#f43f5e", name: "Rosa Forte" },
    ];

    if (!editor) return null;

    const currentColor = editor.getAttributes("textStyle").color;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 rounded cursor-pointer relative ${currentColor
                            ? "bg-zinc-600 text-white"
                            : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                    title="Cor do texto"
                >
                    <Brush className="w-4 h-4" />
                    <span
                        className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
                        style={{
                            backgroundColor: currentColor || "#ffffff",
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
                                    editor.chain().focus().setColor(e.target.value).run();
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
                        <div className="grid grid-cols-7 gap-1.5">
                            {presetColors.map(({ color, name }) => {
                                const isActive = currentColor === color;
                                return (
                                    <button
                                        key={color}
                                        title={name}
                                        onClick={() => editor.chain().focus().setColor(color).run()}
                                        className={`w-7 h-7 rounded border-2 ${isActive
                                                ? "border-white scale-110 shadow-lg"
                                                : "border-zinc-600"
                                            } hover:scale-110 transition-transform`}
                                        style={{ backgroundColor: color }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={() => editor.chain().focus().unsetColor().run()}
                        className="w-full px-3 py-2 text-xs rounded bg-red-900/30 text-red-400 hover:bg-red-900/50 transition border border-red-900/50"
                    >
                        Remover Cor
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}