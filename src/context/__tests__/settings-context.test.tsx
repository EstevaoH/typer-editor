import { render, screen, act } from '@testing-library/react'
import { SettingsProvider, useSettings } from '../settings-context'
import userEvent from '@testing-library/user-event'

// Mock LocalStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString()
        }),
        clear: jest.fn(() => {
            store = {}
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key]
        })
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
})

const TestComponent = () => {
    const { fontFamily, setFontFamily } = useSettings()

    return (
        <div>
            <div data-testid="current-font">{fontFamily}</div>
            <button onClick={() => setFontFamily('serif')}>Set Serif</button>
            <button onClick={() => setFontFamily('mono')}>Set Mono</button>
        </div>
    )
}

describe('SettingsContext', () => {
    beforeEach(() => {
        mockLocalStorage.clear()
        jest.clearAllMocks()
    })

    it('provides default font family (sans)', () => {
        render(
            <SettingsProvider>
                <TestComponent />
            </SettingsProvider>
        )

        expect(screen.getByTestId('current-font')).toHaveTextContent('sans')
    })

    // it('loads font family from localStorage on mount', () => {
    //     mockLocalStorage.store = { 'fontFamily': 'inter' }
    //     mockLocalStorage.getItem.mockReturnValue('inter')

    //     render(
    //         <SettingsProvider>
    //             <TestComponent />
    //         </SettingsProvider>
    //     )

    //     expect(screen.getByTestId('current-font')).toHaveTextContent('inter')
    //     expect(mockLocalStorage.getItem).toHaveBeenCalledWith('fontFamily')
    // })

    it('updates font family and saves to localStorage', async () => {
        render(
            <SettingsProvider>
                <TestComponent />
            </SettingsProvider>
        )

        const button = screen.getByText('Set Serif')
        await userEvent.click(button)

        expect(screen.getByTestId('current-font')).toHaveTextContent('serif')
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('fontFamily', 'serif')
    })

    it('throws error when used outside provider', () => {
        // Prevent console.error from cluttering output
        const consoleSpy = jest.spyOn(console, 'error')
        consoleSpy.mockImplementation(() => { })

        expect(() => render(<TestComponent />)).toThrow('useSettings must be used within a SettingsProvider')

        consoleSpy.mockRestore()
    })
})
