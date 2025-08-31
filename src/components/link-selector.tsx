import { Editor } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Link2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export function LinkSelector({ editor }: { editor: Editor | null }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, []);

    if (!editor) return null;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 rounded relative cursor-pointer ${editor.isActive('link')
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                    title="Inserir/editar link (Ctrl+K)"
                >
                    <Link2Icon className="w-4 h-4" />
                    {editor.isActive('link') && (
                        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-3 bg-zinc-800 border border-zinc-700 rounded shadow-lg">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-zinc-300">URL do Link</label>
                    <input
                        type="url"
                        placeholder="https://exemplo.com"
                        defaultValue={editor.getAttributes('link').href || ''}
                        className="px-3 py-2 text-sm rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="link-url-input"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                const url = input.value.trim();

                                if (!url) {
                                    editor.chain().focus().extendMarkRange('link').unsetLink().run();
                                    setIsOpen(false);
                                    return;
                                }

                                try {
                                    new URL(url);
                                    editor
                                        .chain()
                                        .focus()
                                        .extendMarkRange('link')
                                        .setLink({ href: url })
                                        .run();
                                    setIsOpen(false);
                                } catch {
                                    alert('Por favor, insira uma URL válida (ex: https://exemplo.com)');
                                }
                            } else if (e.key === 'Escape') {
                                e.preventDefault();
                                setIsOpen(false);
                            }
                        }}
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const input = document.getElementById('link-url-input') as HTMLInputElement;
                                const url = input.value.trim();

                                if (!url) {
                                    editor.chain().focus().extendMarkRange('link').unsetLink().run();
                                    setIsOpen(false);
                                    return;
                                }

                                try {
                                    new URL(url);
                                    editor
                                        .chain()
                                        .focus()
                                        .extendMarkRange('link')
                                        .setLink({ href: url })
                                        .run();
                                    setIsOpen(false);
                                } catch {
                                    alert('Por favor, insira uma URL válida (ex: https://exemplo.com)');
                                }
                            }}
                            className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Aplicar
                        </button>
                        <button
                            onClick={() => {
                                const input = document.getElementById('link-url-input') as HTMLInputElement;
                                input.value = '';
                            }}
                            className="px-3 py-1.5 text-sm rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition"
                        >
                            Limpar
                        </button>

                        {editor.isActive('link') && (
                            <button
                                onClick={() => {
                                    editor.chain().focus().extendMarkRange('link').unsetLink().run();
                                    setIsOpen(false);
                                }}
                                className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Remover
                            </button>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}