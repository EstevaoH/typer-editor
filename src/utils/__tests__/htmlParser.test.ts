import { parseHtmlToStructure } from '../htmlParser'

describe('parseHtmlToStructure', () => {
    it('parses simple paragraph text', () => {
        const html = '<p>Hello World</p>'
        const result = parseHtmlToStructure(html)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            type: 'paragraph',
            alignment: 'left',
            content: [{ text: 'Hello World' }]
        })
    })

    it('parses formatted text strings', () => {
        const html = '<p><strong>Bold</strong> and <em>Italic</em> and <u>Underline</u></p>'
        const result = parseHtmlToStructure(html)

        expect(result[0].content).toEqual([
            { text: 'Bold', bold: true },
            { text: ' and ' },
            { text: 'Italic', italic: true },
            { text: ' and ' },
            { text: 'Underline', underline: true }
        ])
    })

    it('parses headings correctly', () => {
        const html = '<h1>Heading 1</h1><h3>Heading 3</h3>'
        const result = parseHtmlToStructure(html)

        expect(result).toHaveLength(2)
        expect(result[0]).toEqual({
            type: 'heading',
            level: 1,
            content: [{ text: 'Heading 1' }]
        })
        expect(result[1]).toEqual({
            type: 'heading',
            level: 3,
            content: [{ text: 'Heading 3' }]
        })
    })

    it('parses unordered lists', () => {
        const html = '<ul><li>Item 1</li><li>Item 2</li></ul>'
        const result = parseHtmlToStructure(html)

        expect(result).toHaveLength(2)
        expect(result[0].type).toBe('list-item')
        expect(result[0].isOrdered).toBe(false)
        expect(result[0].content[0].text).toBe('Item 1')

        expect(result[1].type).toBe('list-item')
        expect(result[1].isOrdered).toBe(false)
        expect(result[1].content[0].text).toBe('Item 2')
    })

    it('parses ordered lists', () => {
        const html = '<ol><li>First</li><li>Second</li></ol>'
        const result = parseHtmlToStructure(html)

        expect(result).toHaveLength(2)
        expect(result[0].type).toBe('list-item')
        expect(result[0].isOrdered).toBe(true)
        expect(result[0].content[0].text).toBe('First')
    })

    it('parses links correctly', () => {
        const html = '<p><a href="https://example.com">Click here</a></p>'
        const result = parseHtmlToStructure(html)

        expect(result[0].content[0]).toEqual({
            text: 'Click here',
            link: 'https://example.com'
        })
    })

    it('parses code blocks', () => {
        const html = '<pre><code class="language-javascript">const x = 1;</code></pre>'
        const result = parseHtmlToStructure(html)

        expect(result[0]).toEqual({
            type: 'code',
            language: 'javascript',
            content: [{ text: 'const x = 1;', code: true }]
        })
    })

    it('parses blockquotes', () => {
        const html = '<blockquote>Quote text</blockquote>'
        const result = parseHtmlToStructure(html)

        expect(result[0]).toEqual({
            type: 'blockquote',
            content: [{ text: 'Quote text' }]
        })
    })

    it('handles nested alignment', () => {
        const html = '<p style="text-align: center">Centered text</p>'
        const result = parseHtmlToStructure(html)

        expect(result[0].alignment).toBe('center')
    })

    it('handles mixed nested formatting', () => {
        const html = '<p><strong>Bold <em>and Italic</em></strong></p>'
        const result = parseHtmlToStructure(html)

        expect(result[0].content).toHaveLength(2)
        expect(result[0].content[0]).toEqual({ text: 'Bold ', bold: true })
        expect(result[0].content[1]).toEqual({ text: 'and Italic', bold: true, italic: true })
    })

    it('handles line breaks', () => {
        const html = '<p>Line 1<br>Line 2</p>'
        const result = parseHtmlToStructure(html)

        expect(result[0].content).toHaveLength(3)
        // Note: The parser implementation might vary on splitting logic, but based on reading code:
        // it pushes individual text nodes.
        expect(result[0].content[1].text).toBe('\n')
    })

    it('ignores empty elements but parses simple text as paragraph fallback', () => {
        const html = 'Simple text'
        const result = parseHtmlToStructure(html)

        expect(result).toHaveLength(1)
        expect(result[0].type).toBe('paragraph')
        expect(result[0].content[0].text).toBe('Simple text')
    })
})
