import { Editor } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Search, Replace, ChevronUp, ChevronDown, X, CaseSensitive, Regex, WholeWord } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

export function SearchSelector({ editor }: { editor: Editor | null }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [replaceTerm, setReplaceTerm] = useState("");
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [useRegex, setUseRegex] = useState(false);
    const [wholeWord, setWholeWord] = useState(false);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const [matches, setMatches] = useState<Array<{ from: number, to: number }>>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showReplace, setShowReplace] = useState(false);
    
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Função para buscar no conteúdo
    const handleSearch = useCallback(() => {
        if (!editor || !searchTerm.trim()) {
            clearHighlights();
            setMatches([]);
            setTotalMatches(0);
            setCurrentMatch(0);
            return;
        }

        const content = editor.getText();
        const newMatches: Array<{ from: number, to: number }> = [];

        try {
            let pattern = searchTerm;
            
            if (!useRegex) {
                pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            
            if (wholeWord && !useRegex) {
                pattern = `\\b${pattern}\\b`;
            }

            const flags = caseSensitive ? 'g' : 'gi';
            const searchRegex = new RegExp(pattern, flags);

            let match;
            while ((match = searchRegex.exec(content)) !== null) {
                newMatches.push({
                    from: match.index,
                    to: match.index + match[0].length
                });
                
                if (match[0].length === 0) {
                    searchRegex.lastIndex++;
                }
            }
        } catch (error) {
            console.log('Erro no regex, usando fallback simples:', error);
            const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase();
            const textToSearch = caseSensitive ? content : content.toLowerCase();

            let position = 0;
            while (position < textToSearch.length) {
                const foundIndex = textToSearch.indexOf(searchValue, position);
                if (foundIndex === -1) break;

                if (wholeWord && !useRegex) {
                    const isWholeWord = checkWholeWord(content, foundIndex, searchValue.length);
                    if (!isWholeWord) {
                        position = foundIndex + 1;
                        continue;
                    }
                }

                newMatches.push({
                    from: foundIndex,
                    to: foundIndex + searchValue.length
                });
                position = foundIndex + 1;
            }
        }

        setMatches(newMatches);
        setTotalMatches(newMatches.length);
        
        // Se encontrou novos matches, vai para o primeiro
        if (newMatches.length > 0) {
            setCurrentMatch(1);
            navigateToMatch(0); // Navega para o primeiro match
        } else {
            setCurrentMatch(0);
            clearHighlights();
        }
    }, [searchTerm, caseSensitive, useRegex, wholeWord, editor]);

    // Verificar se é uma palavra completa
    const checkWholeWord = (text: string, index: number, length: number): boolean => {
        const before = index > 0 ? text[index - 1] : '';
        const after = index + length < text.length ? text[index + length] : '';
        
        const wordBoundaryRegex = /[^a-zA-Z0-9_]/;
        return (index === 0 || wordBoundaryRegex.test(before)) && 
               (index + length === text.length || wordBoundaryRegex.test(after));
    };

    // Função para destacar as correspondências
    const highlightMatches = useCallback((matchesToHighlight: Array<{ from: number, to: number }>) => {
        if (!editor) return;
        
        // Primeiro remover todos os destaques
        editor.chain().unsetHighlight().run();

        if (matchesToHighlight.length === 0) return;

        // Aplicar destaques para todos os matches
        matchesToHighlight.forEach((match, index) => {
            editor.chain().setTextSelection({
                from: match.from,
                to: match.to,
            }).run();

            if (index === currentMatch - 1) {
                editor.chain().setHighlight({ color: '#ffd700' }).run(); // Amarelo forte para o atual
            } else {
                editor.chain().setHighlight({ color: 'rgba(255, 215, 0, 0.3)' }).run(); // Amarelo claro para outros
            }
        });

        // Restaurar seleção para o match atual
        if (currentMatch > 0 && currentMatch <= matchesToHighlight.length) {
            const currentMatchObj = matchesToHighlight[currentMatch - 1];
            editor.chain()
                .setTextSelection({ from: currentMatchObj.from, to: currentMatchObj.to })
                .scrollIntoView()
                .run();
        }
    }, [editor, currentMatch]);

    // Limpar destaques
    const clearHighlights = useCallback(() => {
        if (!editor) return;
        editor.chain().unsetHighlight().run();
    }, [editor]);

    // Navegar para um match específico
    const navigateToMatch = useCallback((index: number) => {
        if (!editor || matches.length === 0 || index < 0 || index >= matches.length) return;

        const match = matches[index];
        
        // Primeiro limpar e depois destacar
        clearHighlights();
        
        // Destacar todos os matches
        matches.forEach((otherMatch, otherIndex) => {
            editor.chain().setTextSelection({
                from: otherMatch.from,
                to: otherMatch.to,
            }).run();

            if (otherIndex === index) {
                editor.chain().setHighlight({ color: '#ffd700' }).run();
            } else {
                editor.chain().setHighlight({ color: 'rgba(255, 215, 0, 0.3)' }).run();
            }
        });

        // Mover cursor e scroll para o match atual
        editor.chain()
            .setTextSelection({ from: match.from, to: match.to })
            .scrollIntoView()
            .run();

        setCurrentMatch(index + 1);
    }, [editor, matches, clearHighlights]);

    // Próximo match
    const goToNextMatch = useCallback(() => {
        if (matches.length === 0) return;
        const nextIndex = currentMatch % matches.length;
        navigateToMatch(nextIndex);
    }, [matches, currentMatch, navigateToMatch]);

    // Match anterior
    const goToPrevMatch = useCallback(() => {
        if (matches.length === 0) return;
        const prevIndex = (currentMatch - 2 + matches.length) % matches.length;
        navigateToMatch(prevIndex);
    }, [matches, currentMatch, navigateToMatch]);

    // Substituir
    const handleReplace = useCallback(() => {
        if (!editor || !searchTerm.trim() || matches.length === 0) return;

        const currentSelection = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(currentSelection.from, currentSelection.to, " ");

        try {
            let pattern = searchTerm;
            if (!useRegex) {
                pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            if (wholeWord && !useRegex) {
                pattern = `\\b${pattern}\\b`;
            }

            const flags = caseSensitive ? '' : 'i';
            const searchRegex = new RegExp(pattern, flags);

            if (searchRegex.test(selectedText)) {
                editor.chain()
                    .deleteRange({ from: currentSelection.from, to: currentSelection.to })
                    .insertContent(replaceTerm)
                    .run();

                // Atualizar busca após um pequeno delay
                setTimeout(handleSearch, 100);
            }
        } catch {
            const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase();
            const compareText = caseSensitive ? selectedText : selectedText.toLowerCase();

            if (compareText === searchValue) {
                editor.chain()
                    .deleteRange({ from: currentSelection.from, to: currentSelection.to })
                    .insertContent(replaceTerm)
                    .run();
                setTimeout(handleSearch, 100);
            }
        }
    }, [searchTerm, replaceTerm, caseSensitive, useRegex, wholeWord, editor, handleSearch, matches]);

    // Substituir todos
    const handleReplaceAll = useCallback(() => {
        if (!editor || !searchTerm.trim()) return;

        const content = editor.getText();

        try {
            let pattern = searchTerm;
            if (!useRegex) {
                pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            if (wholeWord && !useRegex) {
                pattern = `\\b${pattern}\\b`;
            }

            const flags = caseSensitive ? 'g' : 'gi';
            const searchRegex = new RegExp(pattern, flags);

            const newContent = content.replace(searchRegex, replaceTerm);
            editor.chain().setContent(newContent).run();
        } catch {
            const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase();
            const textToSearch = caseSensitive ? content : content.toLowerCase();

            let newContent = content;
            let position = 0;
            let result = "";

            while (position < textToSearch.length) {
                const foundIndex = textToSearch.indexOf(searchValue, position);
                if (foundIndex === -1) {
                    result += newContent.slice(position);
                    break;
                }

                if (wholeWord && !checkWholeWord(newContent, foundIndex, searchValue.length)) {
                    position = foundIndex + 1;
                    continue;
                }

                result += newContent.slice(position, foundIndex) + replaceTerm;
                position = foundIndex + searchValue.length;
            }

            editor.chain().setContent(result).run();
        }

        clearHighlights();
        setMatches([]);
        setTotalMatches(0);
        setCurrentMatch(0);
    }, [searchTerm, replaceTerm, caseSensitive, useRegex, wholeWord, editor]);

    // Atualizar os destaques quando currentMatch ou matches mudarem
    useEffect(() => {
        if (editor && matches.length > 0) {
            highlightMatches(matches);
        }
    }, [currentMatch, matches, highlightMatches, editor]);

    // Buscar automaticamente quando os parâmetros mudarem
    useEffect(() => {
        const timeoutId = setTimeout(handleSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, caseSensitive, useRegex, wholeWord, handleSearch]);

    // Atalhos de teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                setIsOpen(true);
                setShowReplace(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
            }
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                setIsOpen(false);
                clearHighlights();
            }
            if (e.key === 'Enter' && isOpen && e.shiftKey) {
                e.preventDefault();
                goToPrevMatch();
            }
            if (e.key === 'Enter' && isOpen && !e.shiftKey) {
                e.preventDefault();
                goToNextMatch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, goToNextMatch, goToPrevMatch, clearHighlights]);

    // Focar no input quando abrir
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            clearHighlights();
        }
    }, [isOpen, clearHighlights]);

    // Retorno condicional deve vir DEPOIS de todos os hooks
    if (!editor) return null;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="p-2 rounded relative text-zinc-300 hover:bg-zinc-700 transition-colors"
                    title="Buscar no documento (Ctrl+F)"
                    onClick={() => setIsOpen(true)}
                >
                    <Search className="w-4 h-4" />
                    {totalMatches > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-xs flex items-center justify-center">
                            {totalMatches}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent 
                className="w-96 p-0 bg-zinc-900 border border-zinc-700 rounded shadow-xl"
                align="end"
                onInteractOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (!target.closest('.search-popover-content')) {
                        setIsOpen(false);
                    }
                }}
            >
                <div className="search-popover-content">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-zinc-700">
                        <div className="flex items-center gap-2 flex-1">
                            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none text-white placeholder-zinc-500 focus:outline-none flex-1 min-w-0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.shiftKey) {
                                        e.preventDefault();
                                        goToPrevMatch();
                                    }
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        goToNextMatch();
                                    }
                                }}
                            />
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => setCaseSensitive(!caseSensitive)}
                                className={`p-1 rounded ${caseSensitive ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                                title="Diferenciar maiúsculas/minúsculas"
                            >
                                <CaseSensitive className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => setUseRegex(!useRegex)}
                                className={`p-1 rounded ${useRegex ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                                title="Expressão regular"
                            >
                                <Regex className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => setWholeWord(!wholeWord)}
                                className={`p-1 rounded ${wholeWord ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                                title="Palavra completa"
                            >
                                <WholeWord className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Replace Section */}
                    {showReplace && (
                        <div className="flex items-center gap-2 p-3 border-b border-zinc-700">
                            <Replace className="w-4 h-4 text-zinc-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Substituir"
                                value={replaceTerm}
                                onChange={(e) => setReplaceTerm(e.target.value)}
                                className="bg-transparent border-none text-white placeholder-zinc-500 focus:outline-none flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleReplace();
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {totalMatches > 0 ? (
                                <span className="text-xs text-zinc-400">
                                    {currentMatch} de {totalMatches}
                                </span>
                            ) : searchTerm && (
                                <span className="text-xs text-zinc-500">Nenhum resultado</span>
                            )}
                            
                            {totalMatches > 0 && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={goToPrevMatch}
                                        disabled={totalMatches <= 1}
                                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
                                        title="Anterior (Shift+Enter)"
                                    >
                                        <ChevronUp className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={goToNextMatch}
                                        disabled={totalMatches <= 1}
                                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
                                        title="Próximo (Enter)"
                                    >
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {showReplace && (
                                <>
                                    <button
                                        onClick={handleReplace}
                                        disabled={!searchTerm || totalMatches === 0}
                                        className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Substituir
                                    </button>
                                    <button
                                        onClick={handleReplaceAll}
                                        disabled={!searchTerm || totalMatches === 0}
                                        className="px-2 py-1 text-xs rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        Todos
                                    </button>
                                </>
                            )}
                            
                            <button
                                onClick={() => setShowReplace(!showReplace)}
                                className="px-2 py-1 text-xs rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                                title={showReplace ? 'Ocultar substituição' : 'Mostrar substituição'}
                            >
                                {showReplace ? '▲' : '▼'}
                            </button>
                            
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded text-zinc-400 hover:text-zinc-200"
                                title="Fechar (Esc)"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}