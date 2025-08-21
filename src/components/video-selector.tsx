import { Play } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Editor } from "@tiptap/react";

export function VideoSelector({ editor }: { editor: Editor | null }) {

    if (!editor) return null
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 rounded text-zinc-300 hover:bg-zinc-700`}
                    title="Inserir vídeo (Ctrl+Shift+V)"
                >
                    <Play className="w-4 h-4" />
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-72 p-4 bg-zinc-800 border border-zinc-700 rounded shadow-lg">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-zinc-300">URL do YouTube</label>
                    <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="px-3 py-2 text-sm rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="youtube-url-input"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const input = document.getElementById('youtube-url-input') as HTMLInputElement;
                                const url = input.value.trim();

                                if (!url) {
                                    alert('Por favor, insira uma URL do YouTube');
                                    return;
                                }

                                editor.commands.setYoutubeVideo({
                                    src: url,
                                    width: 640,
                                    height: 360,
                                });
                            }}
                            className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Inserir
                        </button>

                        <button
                            onClick={() => {
                                const input = document.getElementById('youtube-url-input') as HTMLInputElement;
                                input.value = '';
                            }}
                            className="px-3 py-1.5 text-sm rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition"
                        >
                            Limpar
                        </button>
                    </div>

                    <div className="text-xs text-zinc-400 mt-1">
                        Dica: Cole o link completo do YouTube (ex: https://www.youtube.com/watch?v=...)
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}