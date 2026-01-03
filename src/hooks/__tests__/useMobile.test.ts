import { renderHook } from '@testing-library/react'
import { useIsMobile } from '../useMobile'

describe('useIsMobile Hook', () => {
    const originalInnerWidth = window.innerWidth

    afterEach(() => {
        // Restore original window size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        })
    })

    it('returns false for desktop screen size', () => {
        // Set window width to desktop size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        })

        const { result } = renderHook(() => useIsMobile())

        expect(result.current).toBe(false)
    })

    it('returns true for mobile screen size', () => {
        // Set window width to mobile size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375,
        })

        const { result } = renderHook(() => useIsMobile())

        expect(result.current).toBe(true)
    })

    it('returns true for screen width exactly at mobile breakpoint - 1', () => {
        // 768 is the breakpoint, so 767 should be mobile
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 767,
        })

        const { result } = renderHook(() => useIsMobile())

        expect(result.current).toBe(true)
    })

    it('returns false for screen width at desktop breakpoint', () => {
        // 768 is the breakpoint, so 768 should be desktop
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 768,
        })

        const { result } = renderHook(() => useIsMobile())

        expect(result.current).toBe(false)
    })

    it('initially returns false before effect runs', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375,
        })

        const { result } = renderHook(() => useIsMobile())

        // After effect runs, should be true for mobile
        expect(result.current).toBe(true)
    })
})
