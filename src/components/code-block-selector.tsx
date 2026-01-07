"use client";

import { Code2Icon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Editor } from "@tiptap/react";
import { useState } from "react";

export function CodeBlockSelector({ editor }: { editor: Editor | null }) {
    const [searchTerm, setSearchTerm] = useState("");

    const languages = [
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "csharp", label: "C#" },
        { value: "cpp", label: "C++" },
        { value: "c", label: "C" },
        { value: "php", label: "PHP" },
        { value: "ruby", label: "Ruby" },
        { value: "go", label: "Go" },
        { value: "rust", label: "Rust" },
        { value: "swift", label: "Swift" },
        { value: "kotlin", label: "Kotlin" },
        { value: "html", label: "HTML" },
        { value: "css", label: "CSS" },
        { value: "scss", label: "SCSS" },
        { value: "json", label: "JSON" },
        { value: "xml", label: "XML" },
        { value: "yaml", label: "YAML" },
        { value: "markdown", label: "Markdown" },
        { value: "sql", label: "SQL" },
        { value: "bash", label: "Bash" },
        { value: "shell", label: "Shell" },
        { value: "powershell", label: "PowerShell" },
        { value: "docker", label: "Dockerfile" },
        { value: "nginx", label: "Nginx" },
        { value: "apache", label: "Apache" },
        { value: "graphql", label: "GraphQL" },
        { value: "dart", label: "Dart" },
        { value: "r", label: "R" },
        { value: "matlab", label: "MATLAB" },
        { value: "lua", label: "Lua" },
        { value: "perl", label: "Perl" },
        { value: "scala", label: "Scala" },
        { value: "haskell", label: "Haskell" },
        { value: "elixir", label: "Elixir" },
        { value: "clojure", label: "Clojure" },
        { value: "erlang", label: "Erlang" },
        { value: "fsharp", label: "F#" },
        { value: "ocaml", label: "OCaml" },
        { value: "plaintext", label: "Texto Simples" },
    ];

    if (!editor) return null;

    const filteredLanguages = languages.filter((lang) =>
        lang.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentLanguage = editor.getAttributes("codeBlock").language || "plaintext";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`p-2 rounded cursor-pointer ${editor.isActive("codeBlock")
                            ? "bg-zinc-600 text-white"
                            : "text-zinc-300 hover:bg-zinc-700"
                        }`}
                    title="Bloco de código"
                >
                    <Code2Icon className="w-4 h-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 bg-zinc-900 border border-zinc-700 rounded-lg">
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-zinc-400 mb-2 block">
                            Bloco de Código
                        </label>

                        {!editor.isActive("codeBlock") ? (
                            <button
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                className="w-full px-3 py-2 text-sm rounded bg-primary/20 text-primary hover:bg-primary/30 transition border border-primary/50"
                            >
                                Inserir Bloco de Código
                            </button>
                        ) : (
                            <>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        placeholder="Buscar linguagem..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
                                    {filteredLanguages.map((lang) => {
                                        const isActive = currentLanguage === lang.value;
                                        return (
                                            <button
                                                key={lang.value}
                                                onClick={() => {
                                                    editor
                                                        .chain()
                                                        .focus()
                                                        .updateAttributes("codeBlock", { language: lang.value })
                                                        .run();
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded transition ${isActive
                                                        ? "bg-primary/20 text-primary border border-primary/50"
                                                        : "hover:bg-zinc-800 text-zinc-300"
                                                    }`}
                                            >
                                                {lang.label}
                                                {isActive && (
                                                    <span className="float-right text-xs">✓</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                    {filteredLanguages.length === 0 && (
                                        <div className="text-center py-4 text-sm text-zinc-500">
                                            Nenhuma linguagem encontrada
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                    className="w-full mt-2 px-3 py-2 text-xs rounded bg-red-900/30 text-red-400 hover:bg-red-900/50 transition border border-red-900/50"
                                >
                                    Remover Bloco de Código
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
