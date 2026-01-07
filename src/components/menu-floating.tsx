"use client";

import { FloatingMenu } from "@tiptap/react";
import {
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    TypeIcon,
    YoutubeIcon,
    List,
    ListOrdered,
    CheckSquare,
    Code2,
    Quote,
    Table,
    Link2,
} from "lucide-react";
import React, { useState } from "react";

export function MenuFloating({ editor }: { editor: any }) {
    const [searchTerm, setSearchTerm] = useState("");

    const blocks = [
        {
            category: "TEXTO",
            items: [
                {
                    icon: TypeIcon,
                    title: "Texto",
                    description: "Comece a escrever com texto simples",
                    action: () => editor.chain().focus().setParagraph().run(),
                },
                {
                    icon: Heading1,
                    title: "Título 1",
                    description: "Título de seção grande",
                    action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                },
                {
                    icon: Heading2,
                    title: "Título 2",
                    description: "Título de seção médio",
                    action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                },
                {
                    icon: Heading3,
                    title: "Título 3",
                    description: "Título de seção pequeno",
                    action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                },
            ],
        },
        {
            category: "LISTAS",
            items: [
                {
                    icon: List,
                    title: "Lista com marcadores",
                    description: "Crie uma lista simples",
                    action: () => editor.chain().focus().toggleBulletList().run(),
                },
                {
                    icon: ListOrdered,
                    title: "Lista numerada",
                    description: "Crie uma lista numerada",
                    action: () => editor.chain().focus().toggleOrderedList().run(),
                },
                {
                    icon: CheckSquare,
                    title: "Lista de tarefas",
                    description: "Acompanhe tarefas com checkboxes",
                    action: () => editor.chain().focus().toggleTaskList().run(),
                },
            ],
        },
        {
            category: "MÍDIA",
            items: [
                {
                    icon: ImageIcon,
                    title: "Imagem",
                    description: "Envie ou insira com um link",
                    action: () => {
                        const url = window.prompt("Cole o link da imagem:");
                        if (url) {
                            editor.chain().focus().setImage({ src: url }).run();
                        }
                    },
                },
                {
                    icon: YoutubeIcon,
                    title: "Vídeo",
                    description: "Incorporar do YouTube",
                    action: () => {
                        const url = window.prompt("Cole o link do YouTube:");
                        if (url) {
                            editor.commands.setYoutubeVideo({ src: url });
                        }
                    },
                },
                {
                    icon: Link2,
                    title: "Link",
                    description: "Adicionar um link",
                    action: () => {
                        const url = window.prompt("Cole o link:");
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    },
                },
            ],
        },
        {
            category: "BLOCOS",
            items: [
                {
                    icon: Code2,
                    title: "Bloco de código",
                    description: "Código com syntax highlighting",
                    action: () => editor.chain().focus().toggleCodeBlock().run(),
                },
                {
                    icon: Quote,
                    title: "Citação",
                    description: "Capturar uma citação",
                    action: () => editor.chain().focus().toggleBlockquote().run(),
                },
            ],
        },
    ];

    const allItems = blocks.flatMap((block) =>
        block.items.map((item) => ({ ...item, category: block.category }))
    );

    const filteredItems = searchTerm
        ? allItems.filter(
            (item) =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : allItems;

    const groupedFilteredItems = searchTerm
        ? [{ category: "RESULTADOS", items: filteredItems }]
        : blocks.filter((block) =>
            block.items.some((item) =>
                filteredItems.some((filtered) => filtered.title === item.title)
            )
        );

    return (
        <FloatingMenu
            className="bg-zinc-900 shadow-2xl border border-zinc-700 rounded-lg overflow-hidden flex flex-col w-80 max-h-96 backdrop-blur-sm"
            editor={editor}
            shouldShow={({ state, editor }) => {
                const { $from, empty } = state.selection;

                // Don't show if selection is not empty
                if (!empty) return false;

                // Get the text before cursor
                const textBefore = $from.nodeBefore?.textContent || '';

                // Show only if the last character is exactly "/"
                return textBefore === '/';
            }}
            tippyOptions={{ duration: 100, placement: "bottom-start" }}
        >
            {/* Search */}
            <div className="p-3 border-b border-zinc-800">
                <input
                    type="text"
                    placeholder="Buscar blocos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-primary"
                    autoFocus
                />
            </div>

            {/* Blocks */}
            <div className="overflow-y-auto custom-scrollbar">
                {groupedFilteredItems.length === 0 ? (
                    <div className="p-6 text-center text-sm text-zinc-500">
                        Nenhum bloco encontrado
                    </div>
                ) : (
                    groupedFilteredItems.map((block, blockIndex) => (
                        <div key={blockIndex} className="py-2">
                            <h3 className="px-3 py-1 text-xs font-medium text-zinc-400">
                                {block.category}
                            </h3>
                            {block.items.map((item, itemIndex) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={itemIndex}
                                        onClick={() => {
                                            item.action();
                                            setSearchTerm("");
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-zinc-800 transition-colors"
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded border border-zinc-700">
                                            <Icon className="w-5 h-5 text-zinc-300" />
                                        </div>
                                        <div className="flex flex-col text-left flex-1">
                                            <span className="text-sm font-medium text-zinc-50">
                                                {item.title}
                                            </span>
                                            <span className="text-xs text-zinc-400">
                                                {item.description}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>

            {/* Footer hint */}
            <div className="px-3 py-2 border-t border-zinc-800 bg-zinc-900/50">
                <p className="text-xs text-zinc-500">
                    Digite <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">/</kbd> para abrir este menu
                </p>
            </div>
        </FloatingMenu>
    );
}