import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce Hook', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('returns the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial', 500))

        expect(result.current).toBe('initial')
    })

    it('does not update value immediately when value changes', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: 'initial' } }
        )

        expect(result.current).toBe('initial')

        rerender({ value: 'updated' })

        // Value should still be 'initial' before delay
        expect(result.current).toBe('initial')
    })

    it('updates value after the specified delay', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: 'initial' } }
        )

        rerender({ value: 'updated' })

        // Fast-forward time by 500ms
        act(() => {
            jest.advanceTimersByTime(500)
        })

        expect(result.current).toBe('updated')
    })

    it('cancels previous timeout when value changes rapidly', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: 'initial' } }
        )

        // Change value multiple times rapidly
        rerender({ value: 'first' })
        act(() => {
            jest.advanceTimersByTime(200)
        })

        rerender({ value: 'second' })
        act(() => {
            jest.advanceTimersByTime(200)
        })

        rerender({ value: 'third' })

        // Value should still be initial
        expect(result.current).toBe('initial')

        // After full delay from last change
        act(() => {
            jest.advanceTimersByTime(500)
        })

        // Should have the last value
        expect(result.current).toBe('third')
    })

    it('works with different data types', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: 42 } }
        )

        expect(result.current).toBe(42)

        rerender({ value: 100 })

        act(() => {
            jest.advanceTimersByTime(300)
        })

        expect(result.current).toBe(100)
    })

    it('uses default delay of 500ms when not specified', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value),
            { initialProps: { value: 'initial' } }
        )

        rerender({ value: 'updated' })

        // Should not update before 500ms
        act(() => {
            jest.advanceTimersByTime(400)
        })
        expect(result.current).toBe('initial')

        // Should update after 500ms
        act(() => {
            jest.advanceTimersByTime(100)
        })
        expect(result.current).toBe('updated')
    })
})
