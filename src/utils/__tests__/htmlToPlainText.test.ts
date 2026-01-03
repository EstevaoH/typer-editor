import { htmlToPlainText, htmlToMarkdown, htmlToFormattedText } from '../htmlToPlainText'

describe('htmlToPlainText', () => {
    it('converts simple HTML to plain text', () => {
        const html = '<p>Hello World</p>'
        const result = htmlToPlainText(html)

        expect(result).toBe('Hello World')
    })

    it('removes all HTML tags', () => {
        const html = '<div><strong>Bold</strong> and <em>italic</em> text</div>'
        const result = htmlToPlainText(html)

        expect(result).toBe('Bold and italic text')
    })

    it('converts br tags to newlines', () => {
        const html = 'Line 1<br>Line 2<br/>Line 3'
        const result = htmlToPlainText(html)

        expect(result).toBe('Line 1\nLine 2\nLine 3')
    })

    it('converts paragraph tags to double newlines', () => {
        const html = '<p>Paragraph 1</p><p>Paragraph 2</p>'
        const result = htmlToPlainText(html)

        expect(result).toBe('Paragraph 1\n\nParagraph 2')
    })

    it('converts heading tags to text with spacing', () => {
        const html = '<h1>Title</h1><p>Content</p>'
        const result = htmlToPlainText(html)

        expect(result).toBe('Title\n\nContent')
    })

    it('decodes HTML entities', () => {
        const html = 'Hello&nbsp;World &amp; &lt;tag&gt; &quot;quoted&quot; &#39;apostrophe&#39;'
        const result = htmlToPlainText(html)

        expect(result).toBe('Hello World & <tag> "quoted" \'apostrophe\'')
    })

    it('removes excessive newlines', () => {
        const html = '<p>Para 1</p><p></p><p></p><p>Para 2</p>'
        const result = htmlToPlainText(html)

        expect(result).not.toContain('\n\n\n')
    })

    it('trims whitespace from result', () => {
        const html = '  <p>  Content  </p>  '
        const result = htmlToPlainText(html)

        expect(result).toBe('Content')
    })

    it('handles empty HTML', () => {
        const html = ''
        const result = htmlToPlainText(html)

        expect(result).toBe('')
    })

    it('handles HTML with only tags', () => {
        const html = '<div><span></span></div>'
        const result = htmlToPlainText(html)

        expect(result).toBe('')
    })
})

describe('htmlToMarkdown', () => {
    it('converts headings to markdown', () => {
        const html = '<h1>Title</h1><h2>Subtitle</h2>'
        const result = htmlToMarkdown(html)

        expect(result).toContain('# Title')
        expect(result).toContain('## Subtitle')
    })

    it('converts bold tags to markdown', () => {
        const html = '<strong>Bold</strong> and <b>also bold</b>'
        const result = htmlToMarkdown(html)

        expect(result).toContain('**Bold**')
        expect(result).toContain('**also bold**')
    })

    it('converts italic tags to markdown', () => {
        const html = '<em>Italic</em> and <i>also italic</i>'
        const result = htmlToMarkdown(html)

        expect(result).toContain('*Italic*')
        expect(result).toContain('*also italic*')
    })

    it('converts links to markdown', () => {
        const html = '<a href=\"https://example.com\">Link Text</a>'
        const result = htmlToMarkdown(html)

        expect(result).toContain('[Link Text](https://example.com)')
    })

    it('converts unordered lists to markdown', () => {
        const html = '<ul><li>Item 1</li><li>Item 2</li></ul>'
        const result = htmlToMarkdown(html)

        expect(result).toContain('- Item 1')
        expect(result).toContain('- Item 2')
    })

    it('converts ordered lists to markdown', () => {
        const html = '<ol><li>First</li><li>Second</li></ol>'
        const result = htmlToMarkdown(html)

        expect(result).toContain('1. First')
        expect(result).toContain('2. Second')
    })

    it('converts code tags to markdown', () => {
        const html = '<code>const x = 1;</code>'
        const result = htmlToMarkdown(html)

        expect(result).toContain('`const x = 1;`')
    })

    it('converts blockquotes to markdown', () => {
        const html = '<blockquote>Quote text</blockquote>'
        const result = htmlToMarkdown(html)

        expect(result).toContain('> Quote text')
    })
})

describe('htmlToFormattedText', () => {
    it('returns plain text when format is txt', () => {
        const html = '<p><strong>Bold</strong> text</p>'
        const result = htmlToFormattedText(html, 'txt')

        expect(result).toBe('Bold text')
    })

    it('returns markdown when format is md', () => {
        const html = '<p><strong>Bold</strong> text</p>'
        const result = htmlToFormattedText(html, 'md')

        expect(result).toContain('**Bold**')
    })

    it('defaults to txt format', () => {
        const html = '<p><strong>Bold</strong> text</p>'
        const result = htmlToFormattedText(html)

        expect(result).toBe('Bold text')
    })
})
