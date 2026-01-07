"use client";

import { Editor } from "@tiptap/react";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Table, Plus, Minus, Trash2, Columns, Rows } from "lucide-react";

interface TableSelectorProps {
    editor: Editor;
}

export function TableSelector({ editor }: TableSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const insertTable = () => {
        editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
        setIsOpen(false);
    };

    const deleteTable = () => {
        editor.chain().focus().deleteTable().run();
        setIsOpen(false);
    };

    const addColumnBefore = () => {
        editor.chain().focus().addColumnBefore().run();
    };

    const addColumnAfter = () => {
        editor.chain().focus().addColumnAfter().run();
    };

    const deleteColumn = () => {
        editor.chain().focus().deleteColumn().run();
    };

    const addRowBefore = () => {
        editor.chain().focus().addRowBefore().run();
    };

    const addRowAfter = () => {
        editor.chain().focus().addRowAfter().run();
    };

    const deleteRow = () => {
        editor.chain().focus().deleteRow().run();
    };

    const mergeCells = () => {
        editor.chain().focus().mergeCells().run();
    };

    const splitCell = () => {
        editor.chain().focus().splitCell().run();
    };

    const toggleHeaderRow = () => {
        editor.chain().focus().toggleHeaderRow().run();
    };

    const isInTable = editor.isActive("table");

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 rounded cursor-pointer ${editor.isActive("table")
                            ? "bg-zinc-600 text-white"
                            : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                    title="Tabela"
                >
                    <Table className="w-4 h-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-zinc-900 border-zinc-700 text-zinc-100">
                <div className="space-y-2">
                    <h4 className="font-medium text-sm mb-3">Tabela</h4>

                    {!isInTable ? (
                        <Button
                            onClick={insertTable}
                            className="w-full justify-start gap-2 bg-zinc-800 hover:bg-zinc-700"
                            size="sm"
                        >
                            <Plus className="w-4 h-4" />
                            Inserir Tabela (3x3)
                        </Button>
                    ) : (
                        <div className="space-y-2">
                            {/* Column Controls */}
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-400 font-medium">Colunas</p>
                                <div className="flex gap-1">
                                    <Button
                                        onClick={addColumnBefore}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                                        size="sm"
                                        title="Adicionar coluna antes"
                                    >
                                        <Columns className="w-3 h-3 mr-1" />
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        onClick={addColumnAfter}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                                        size="sm"
                                        title="Adicionar coluna depois"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        <Columns className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        onClick={deleteColumn}
                                        className="flex-1 bg-red-900/20 hover:bg-red-900/30 text-red-400"
                                        size="sm"
                                        title="Deletar coluna"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Row Controls */}
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-400 font-medium">Linhas</p>
                                <div className="flex gap-1">
                                    <Button
                                        onClick={addRowBefore}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                                        size="sm"
                                        title="Adicionar linha antes"
                                    >
                                        <Rows className="w-3 h-3 mr-1" />
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        onClick={addRowAfter}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                                        size="sm"
                                        title="Adicionar linha depois"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        <Rows className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        onClick={deleteRow}
                                        className="flex-1 bg-red-900/20 hover:bg-red-900/30 text-red-400"
                                        size="sm"
                                        title="Deletar linha"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Cell Controls */}
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-400 font-medium">Células</p>
                                <div className="flex gap-1">
                                    <Button
                                        onClick={mergeCells}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-xs"
                                        size="sm"
                                    >
                                        Mesclar
                                    </Button>
                                    <Button
                                        onClick={splitCell}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-xs"
                                        size="sm"
                                    >
                                        Dividir
                                    </Button>
                                </div>
                            </div>

                            {/* Header Toggle */}
                            <Button
                                onClick={toggleHeaderRow}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-xs"
                                size="sm"
                            >
                                Alternar Cabeçalho
                            </Button>

                            {/* Delete Table */}
                            <Button
                                onClick={deleteTable}
                                className="w-full bg-red-900/20 hover:bg-red-900/30 text-red-400"
                                size="sm"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Deletar Tabela
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
