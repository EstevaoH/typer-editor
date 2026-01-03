import { renderHook, act } from '@testing-library/react'
import { useContactForm } from '../useContactForm'

describe('useContactForm Hook', () => {
    const originalFetch = global.fetch

    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        global.fetch = originalFetch
    })

    it('initializes with default values', () => {
        const { result } = renderHook(() => useContactForm())

        expect(result.current.isLoading).toBe(false)
        expect(result.current.form.getValues()).toEqual({
            name: '',
            mail: '',
            message: '',
        })
    })

    it('handles successful form submission', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Mensagem enviada!' }),
        })

        const { result } = renderHook(() => useContactForm())

        const formData = {
            name: 'John Doe',
            mail: 'john@example.com',
            message: 'This is a test message with enough characters',
        }

        let submissionResult
        await act(async () => {
            submissionResult = await result.current.onSubmit(formData)
        })

        expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        expect(submissionResult).toEqual({ success: true, message: 'Mensagem enviada!' })
        expect(result.current.isLoading).toBe(false)
    })

    it('handles API error response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ success: false, message: 'Falha no envio' }),
        })

        const { result } = renderHook(() => useContactForm())

        const formData = {
            name: 'John Doe',
            mail: 'john@example.com',
            message: 'This is a test message',
        }

        let submissionResult
        await act(async () => {
            submissionResult = await result.current.onSubmit(formData)
        })

        expect(submissionResult).toEqual({ success: false, message: 'Falha no envio' })
    })

    it('handles network exceptions', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

        const { result } = renderHook(() => useContactForm())

        const formData = {
            name: 'John Doe',
            mail: 'john@example.com',
            message: 'This is a test message',
        }

        let submissionResult
        await act(async () => {
            submissionResult = await result.current.onSubmit(formData)
        })

        expect(submissionResult).toEqual({
            success: false,
            message: 'Erro de conexão. Verifique sua internet e tente novamente.'
        })

        consoleSpy.mockRestore()
    })
})
