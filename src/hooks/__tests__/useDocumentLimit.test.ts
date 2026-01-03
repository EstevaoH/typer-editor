import { renderHook } from '@testing-library/react'
import { useDocumentLimit } from '../useDocumentLimit'

// Mock the useToast hook
const mockShowToast = jest.fn()
jest.mock('@/context/toast-context', () => ({
    useToast: () => ({
        showToast: mockShowToast
    })
}))

describe('useDocumentLimit Hook', () => {
    beforeEach(() => {
        mockShowToast.mockClear()
    })

    it('correctly calculates status when below limit', () => {
        const documents = [1, 2, 3] // 3 documents
        const MAX_DOCUMENTS = 5

        const { result } = renderHook(() => useDocumentLimit(documents, MAX_DOCUMENTS))

        expect(result.current.canCreate).toBe(true)
        expect(result.current.isLimitReached).toBe(false)
        expect(result.current.remaining).toBe(2)
    })

    it('correctly calculates status when at limit', () => {
        const documents = [1, 2, 3, 4, 5] // 5 documents
        const MAX_DOCUMENTS = 5

        const { result } = renderHook(() => useDocumentLimit(documents, MAX_DOCUMENTS))

        expect(result.current.canCreate).toBe(false)
        expect(result.current.isLimitReached).toBe(true)
        expect(result.current.remaining).toBe(0)
    })

    it('correctly calculates status when above limit', () => {
        const documents = [1, 2, 3, 4, 5, 6] // 6 documents
        const MAX_DOCUMENTS = 5

        const { result } = renderHook(() => useDocumentLimit(documents, MAX_DOCUMENTS))

        expect(result.current.canCreate).toBe(false)
        expect(result.current.isLimitReached).toBe(true)
        expect(result.current.remaining).toBe(0) // Should not be negative
    })

    it('checkLimit returns true when below limit', () => {
        const documents = [1, 2]
        const MAX_DOCUMENTS = 5

        const { result } = renderHook(() => useDocumentLimit(documents, MAX_DOCUMENTS))

        const canProceed = result.current.checkLimit()

        expect(canProceed).toBe(true)
        expect(mockShowToast).not.toHaveBeenCalled()
    })

    it('checkLimit returns false and shows toast when limit reached', () => {
        const documents = [1, 2, 3, 4, 5]
        const MAX_DOCUMENTS = 5

        const { result } = renderHook(() => useDocumentLimit(documents, MAX_DOCUMENTS))

        const canProceed = result.current.checkLimit()

        expect(canProceed).toBe(false)
        expect(mockShowToast).toHaveBeenCalledWith(`⚠️ Limite de ${MAX_DOCUMENTS} documentos atingido`)
    })
})
