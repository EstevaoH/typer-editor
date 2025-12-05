import { useState } from "react";
import { StatisticsDialog } from "./statistics-dialog";

export function Footerbar({ editor, characterLimit }: { editor: any, characterLimit: number }) {
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    if (!editor) return null;

    return (
        <>
            <div className="fixed bottom-0 bottom w-full flex justify-end text-white gap-2 py-2 bg-zinc-800 border-t border-zinc-700 px-4">
                <button 
                    onClick={() => setIsStatsOpen(true)}
                    className="flex gap-4 hover:bg-zinc-700 px-2 rounded transition-colors cursor-pointer"
                    title="Ver estatísticas detalhadas"
                >
                    <div className="text-sm">{editor.storage.characterCount.words()} palavras</div>
                    <div className={`${editor.storage.characterCount.characters() === characterLimit ? 'text-red-400' : ''}`}>
                        <div className="text-sm">{editor.storage.characterCount.characters()} / {characterLimit} letras</div>
                    </div>
                </button>
            </div>

            <StatisticsDialog 
                open={isStatsOpen} 
                onOpenChange={setIsStatsOpen} 
                editor={editor} 
            />
        </>
    );
}
