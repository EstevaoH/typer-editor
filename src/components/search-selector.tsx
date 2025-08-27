import { Editor } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Search, Replace, ChevronUp, ChevronDown, X } from "lucide-react";
import { useState, useEffect } from "react";

export function SearchSelector({ editor }: { editor: Editor | null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [matches, setMatches] = useState<Array<{from: number, to: number}>>([]);
  
  if (!editor) return null;

  // Função para buscar no conteúdo
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      clearHighlights();
      return;
    }
    
    const content = editor.getText();
    const newMatches: Array<{from: number, to: number}> = [];
    
    // Abordagem mais simples sem regex complexo
    const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    const textToSearch = caseSensitive ? content : content.toLowerCase();
    
    let position = 0;
    while (position < textToSearch.length) {
      const foundIndex = textToSearch.indexOf(searchValue, position);
      if (foundIndex === -1) break;
      
      newMatches.push({
        from: foundIndex,
        to: foundIndex + searchValue.length
      });
      
      position = foundIndex + 1;
    }
    
    setMatches(newMatches);
    setTotalMatches(newMatches.length);
    setCurrentMatch(newMatches.length > 0 ? 1 : 0);
    
    // Destacar os resultados
    highlightMatches(newMatches);
  };

  // Função para destacar as correspondências
  const highlightMatches = (matches: Array<{from: number, to: number}>) => {
    // Primeiro, remover destaques anteriores
    clearHighlights();
    
    if (matches.length === 0) return;
    
    // Salvar a posição original do cursor
    const originalPosition = editor.state.selection.anchor;
    
    // Adicionar novos destaques
    matches.forEach((match, index) => {
      editor.chain().setTextSelection({
        from: match.from,
        to: match.to,
      }).run();
      
      // Aplicar marcação
      editor.chain().setHighlight({ color: index === 0 ? '#ffd700' : '#fffacd' }).run();
    });
    
    // Mover para o primeiro match
    if (matches.length > 0) {
      editor.chain().setTextSelection({
        from: matches[0].from,
        to: matches[0].to,
      }).scrollIntoView().run();
    }
    
    setCurrentMatch(1);
  };

  // Função para limpar os destaques
  const clearHighlights = () => {
    editor.chain().focus().unsetHighlight().run();
    setMatches([]);
    setTotalMatches(0);
    setCurrentMatch(0);
  };

  // Navegar entre os resultados - FUNÇÃO CORRIGIDA
  const navigateToMatch = (index: number) => {
    if (matches.length === 0 || index < 0 || index >= matches.length) return;
    
    const match = matches[index];
    
    // Primeiro limpar todos os destaques
    clearHighlights();
    
    // Destacar todos os matches novamente, com o atual em destaque
    matches.forEach((otherMatch, otherIndex) => {
      editor.chain().setTextSelection({
        from: otherMatch.from,
        to: otherMatch.to,
      }).run();
      
      if (otherIndex === index) {
        editor.chain().setHighlight({ color: '#ffd700' }).run(); // Amarelo forte para o atual
      } else {
        editor.chain().setHighlight({ color: '#fffacd' }).run(); // Amarelo claro para os outros
      }
    });
    
    // Mover cursor e scroll para o match atual
    editor.chain().focus().setTextSelection({
      from: match.from,
      to: match.to,
    }).scrollIntoView().run();
    
    setCurrentMatch(index + 1);
  };

  // Ir para o próximo match - FUNÇÃO CORRIGIDA
  const goToNextMatch = () => {
    if (matches.length === 0) return;
    const nextIndex = currentMatch % matches.length;
    navigateToMatch(nextIndex);
  };

  // Ir para o match anterior - FUNÇÃO CORRIGIDA
  const goToPrevMatch = () => {
    if (matches.length === 0) return;
    const prevIndex = (currentMatch - 2 + matches.length) % matches.length;
    navigateToMatch(prevIndex);
  };

  // Função para substituir
  const handleReplace = () => {
    if (!searchTerm.trim() || matches.length === 0) return;
    
    const currentSelection = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(currentSelection.from, currentSelection.to, " ");
    
    // Verificar se a seleção atual corresponde ao termo de busca
    const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    const compareText = caseSensitive ? selectedText : selectedText.toLowerCase();
    
    if (compareText === searchValue) {
      editor.chain().focus().deleteRange({ 
        from: currentSelection.from, 
        to: currentSelection.to 
      }).insertContent(replaceTerm).run();
      
      // Atualizar a busca após a substituição
      setTimeout(handleSearch, 100);
    }
  };

  // Função para substituir todos
  const handleReplaceAll = () => {
    if (!searchTerm.trim()) return;
    
    const content = editor.getText();
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
      
      result += newContent.slice(position, foundIndex) + replaceTerm;
      position = foundIndex + searchValue.length;
    }
    
    editor.chain().focus().setContent(result).run();
    clearHighlights();
  };

  return (
    <Popover onOpenChange={(open) => !open && clearHighlights()}>
      <PopoverTrigger asChild>
        <button
          className={`p-2 rounded relative text-zinc-300 hover:bg-zinc-700`}
          title="Buscar no documento (Ctrl+F)"
        >
          <Search className="w-4 h-4" />
          {totalMatches > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-xs flex items-center justify-center">
              {totalMatches}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 bg-zinc-800 border border-zinc-700 rounded shadow-lg">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-zinc-300 mb-2 flex justify-between items-center">
            <span>Buscar no Documento</span>
            {totalMatches > 0 && (
              <span className="text-xs text-zinc-400">
                {currentMatch} de {totalMatches}
              </span>
            )}
          </h3>
          
          {/* Campo de busca */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Buscar por:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Digite o texto para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchTerm && (
                <button
                  onClick={clearHighlights}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Campo de substituição */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Substituir por:</label>
            <input
              type="text"
              placeholder="Digite o texto de substituição..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleReplace()}
            />
          </div>

          {/* Opções */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="case-sensitive"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="case-sensitive" className="text-xs text-zinc-400">
              Diferenciar maiúsculas/minúsculas
            </label>
          </div>

          {/* Navegação e botões de ação */}
          <div className="flex flex-wrap gap-2 pt-2">
            {totalMatches > 0 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevMatch}
                  className="p-1.5 rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition"
                  title="Anterior"
                  disabled={totalMatches <= 1}
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={goToNextMatch}
                  className="p-1.5 rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition"
                  title="Próximo"
                  disabled={totalMatches <= 1}
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <button
              onClick={handleSearch}
              className="flex-1 px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-1"
            >
              <Search className="w-3 h-3" />
              Buscar
            </button>
            
            <button
              onClick={handleReplace}
              className="flex-1 px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-1"
              disabled={!searchTerm || totalMatches === 0}
            >
              <Replace className="w-3 h-3" />
              Substituir
            </button>
            
            <button
              onClick={handleReplaceAll}
              className="flex-1 px-3 py-1.5 text-sm rounded bg-purple-600 text-white hover:bg-purple-700 transition flex items-center justify-center gap-1"
              disabled={!searchTerm || totalMatches === 0}
            >
              <Replace className="w-3 h-3" />
              Todos
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}