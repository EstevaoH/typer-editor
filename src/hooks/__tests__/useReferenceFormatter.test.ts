import { renderHook } from '@testing-library/react'
import { useReferenceFormatter } from '../useReferenceFormatter'

describe('useReferenceFormatter Hook', () => {
    const mockDate = new Date('2023-12-25T12:00:00')
    const mockAccessDate = new Date('2024-01-01T12:00:00')

    const baseReferenceData = {
        lastName: 'Silva',
        firstName: 'João',
        articleTitle: 'Título do Artigo',
        journalTitle: 'Revista Científica',
        location: 'São Paulo',
        startPage: '10',
        endPage: '20',
        publicationDate: mockDate,
        accessDate: mockAccessDate,
    }

    it('formats basic reference correctly', () => {
        const { result } = renderHook(() => useReferenceFormatter())

        const { plainText, html } = result.current.formatABNTReference(baseReferenceData)

        // Expected format: SOBRENOME, Nome. Título do Artigo. Revista Científica, Local, p. 10-20, dez. 2023.
        const expected = 'SILVA, João. Título do Artigo. Revista Científica, São Paulo, p. 10-20, dez. 2023.'

        expect(plainText).toBe(expected)
        expect(html).toContain(expected)
    })

    it('formats reference with volume and number', () => {
        const { result } = renderHook(() => useReferenceFormatter())

        const data = {
            ...baseReferenceData,
            volume: '10',
            number: '5',
        }

        const { plainText } = result.current.formatABNTReference(data)

        // Expected format: ... São Paulo, v. 10, n. 5, p. 10-20 ...
        expect(plainText).toContain('v. 10, n. 5')
        expect(plainText).toMatch(/São Paulo, v\. 10, n\. 5, p\. 10-20/)
    })

    it('formats reference with URL', () => {
        const { result } = renderHook(() => useReferenceFormatter())

        const data = {
            ...baseReferenceData,
            url: 'https://example.com/article',
        }

        const { plainText } = result.current.formatABNTReference(data)

        expect(plainText).toContain('Disponível em: https://example.com/article.')
        expect(plainText).toContain('Acesso em: 01/01/2024.')
    })

    it('handles optional fields being undefined', () => {
        const { result } = renderHook(() => useReferenceFormatter())

        const data = {
            ...baseReferenceData,
            volume: undefined,
            number: undefined,
            url: undefined,
        }

        const { plainText } = result.current.formatABNTReference(data)

        expect(plainText).not.toContain('v.')
        expect(plainText).not.toContain('n.')
        expect(plainText).not.toContain('Disponível em:')
    })

    it('handles empty strings in optional fields', () => {
        const { result } = renderHook(() => useReferenceFormatter())

        const data = {
            ...baseReferenceData,
            volume: '   ',
            number: '',
            url: ' ',
        }

        const { plainText } = result.current.formatABNTReference(data)

        // Ensure it doesn't add empty fields
        expect(plainText).not.toContain('v.')
        expect(plainText).not.toContain('n.')
        expect(plainText).not.toContain('Disponível em:')
    })

    it('validates schema correctly', () => {
        const { result } = renderHook(() => useReferenceFormatter())
        const schema = result.current.referenceSchema

        const validData = {
            ...baseReferenceData,
            volume: '1',
            number: '1',
            url: 'https://example.com',
        }

        const validation = schema.safeParse(validData)
        expect(validation.success).toBe(true)
    })

    it('rejects invalid data', () => {
        const { result } = renderHook(() => useReferenceFormatter())
        const schema = result.current.referenceSchema

        const invalidData = {
            ...baseReferenceData,
            lastName: 'A', // Too short
            url: 'not-a-url', // Invalid URL
        }

        const validation = schema.safeParse(invalidData)
        expect(validation.success).toBe(false)
    })
})
