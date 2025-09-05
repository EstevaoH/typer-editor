export function Footerbar({ editor, characterLimit }: { editor: any, characterLimit: number }) {
    if (!editor) return null;

    return (
        <>
            <div className="fixed bottom-0 bottom w-full flex justify-end text-white gap-2 py-2 bg-zinc-800 border-t border-zinc-700">
                <div className="text-sm">{editor.storage.characterCount.words()} palavras</div>
                <div className={`${editor.storage.characterCount.characters() === characterLimit ? 'text-red-400' : ''}`}>
                    <div className="text-sm">{editor.storage.characterCount.characters()} / {characterLimit} letras</div>
                </div>
                <br />

            </div>
        </>
    );
}
