// "use client"

// import { useState, useEffect } from 'react'

// export function useTranslate(text: string, targetLanguage: string) {
//   const [translatedText, setTranslatedText] = useState('')
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const translateText = async () => {
//       if (!text.trim()) return
      
//       setLoading(true)
//       try {
//         const response = await fetch('http://localhost:5000/translate', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             q: text,
//             source: 'auto',
//             target: targetLanguage
//           })
//         })
        
//         const data = await response.json()
//         setTranslatedText(data.translatedText)
//       } catch (error) {
//         console.error("Translation error:", error)
//         setTranslatedText(text) // Mantém o texto original em caso de erro
//       } finally {
//         setLoading(false)
//       }
//     }

//     const timer = setTimeout(translateText, 1000) // Debounce de 1 segundo
    
//     return () => clearTimeout(timer)
//   }, [text, targetLanguage])

//   return { translatedText, loading }
// }