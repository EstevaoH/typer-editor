// import { useState, useEffect } from "react";
// import { Editor } from "@tiptap/react";

// type Match = { from: number; to: number };

// export function useSearchAndReplace(editor: Editor | null) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [replaceTerm, setReplaceTerm] = useState("");
//   const [caseSensitive, setCaseSensitive] = useState(false);
//   const [matches, setMatches] = useState<Match[]>([]);
//   const [currentMatch, setCurrentMatch] = useState(0);

//   if (!editor) {
//     return {
//       searchTerm,
//       setSearchTerm,
//       replaceTerm,
//       setReplaceTerm,
//       caseSensitive,
//       setCaseSensitive,
//       matches,
//       currentMatch,
//       totalMatches: 0,
//       handleSearch: () => {},
//       clearHighlights: () => {},
//       goToNextMatch: () => {},
//       goToPrevMatch: () => {},
//       handleReplace: () => {},
//       handleReplaceAll: () => {},
//     };
//   }

//   // Buscar termos no editor
//   const handleSearch = () => {
//     if (!searchTerm.trim()) {
//       clearHighlights();
//       return;
//     }

//     const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase();
//     const newMatches: Match[] = [];

//     editor.state.doc.descendants((node, pos) => {
//       if (node.isText) {
//         const text = caseSensitive ? node.text! : node.text!.toLowerCase();
//         let index = text.indexOf(searchValue);

//         while (index !== -1) {
//           const from = pos + index;
//           const to = from + searchValue.length;
//           newMatches.push({ from, to });
//           index = text.indexOf(searchValue, index + 1);
//         }
//       }
//     });

//     setMatches(newMatches);
//     setCurrentMatch(newMatches.length > 0 ? 1 : 0);

//     if (newMatches.length > 0) {
//       highlightMatches(newMatches);
//       navigateToMatch(0);
//     } else {
//       clearHighlights();
//     }
//   };

//   // Destacar resultados
//   const highlightMatches = (matches: Match[]) => {
//     editor.chain().focus().unsetHighlight().run();
//     console.log(matches)

//     matches.forEach((match) => {
//       editor
//         .chain()
//         .setTextSelection(match)
//         .setHighlight({ color: "#f04" })
//         .run();
//     });
//   };

//   const clearHighlights = () => {
//     editor.chain().focus().unsetHighlight().run();
//     setMatches([]);
//     setCurrentMatch(0);
//   };

//   // Navegar
//   const navigateToMatch = (index: number) => {
//     if (matches.length === 0) return;
//     const match = matches[index];
//     editor
//       .chain()
//       .focus()
//       .setTextSelection(match)
//       .scrollIntoView()
//       .run();
//     setCurrentMatch(index + 1);
//   };

//   const goToNextMatch = () => {
//     if (matches.length === 0) return;
//     const nextIndex = currentMatch % matches.length;
//     navigateToMatch(nextIndex);
//   };

//   const goToPrevMatch = () => {
//     if (matches.length === 0) return;
//     const prevIndex = (currentMatch - 2 + matches.length) % matches.length;
//     navigateToMatch(prevIndex);
//   };

//   // Substituir atual
//   const handleReplace = () => {
//     if (!replaceTerm || matches.length === 0) return;

//     const match = matches[currentMatch - 1];
//     if (!match) return;

//     editor.chain().focus().insertContentAt(match, replaceTerm).run();

//     handleSearch();
//   };

//   // Substituir todos
//   const handleReplaceAll = () => {
//     if (!replaceTerm || matches.length === 0) return;

//     editor.chain().focus();
//     matches.forEach((match) => {
//       editor.chain().insertContentAt(match, replaceTerm).run();
//     });

//     handleSearch();
//   };

//   // Limpeza ao desmontar
//   useEffect(() => {
//     return () => {
//       try {
//         editor?.chain().unsetHighlight().run();
//       } catch {}
//     };
//   }, [editor]);

//   return {
//     searchTerm,
//     setSearchTerm,
//     replaceTerm,
//     setReplaceTerm,
//     caseSensitive,
//     setCaseSensitive,
//     matches,
//     currentMatch,
//     totalMatches: matches.length,
//     handleSearch,
//     clearHighlights,
//     goToNextMatch,
//     goToPrevMatch,
//     handleReplace,
//     handleReplaceAll,
//   };
// }
