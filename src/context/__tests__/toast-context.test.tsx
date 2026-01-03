import { render, screen, act } from '@testing-library/react'
import { ToastProvider, useToast } from '../toast-context'
import userEvent from '@testing-library/user-event'

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
}))

const TestComponent = () => {
    const { showToast, hideToast } = useToast()

    return (
        <div>
            <button onClick={() => showToast('Test Message')}>Show Toast</button>
            <button onClick={() => showToast('Custom Duration', 10000)}>Show Long Toast</button>
            <button onClick={hideToast}>Hide Toast</button>
        </div>
    )
}

describe('ToastContext', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('shows toast when showToast is called', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        )

        const button = screen.getByText('Show Toast')
        await user.click(button)

        expect(screen.getByText('Test Message')).toBeInTheDocument()
    })

    it('hides toast automatically after duration', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(
            <ToastProvider defaultDuration={3000}>
                <TestComponent />
            </ToastProvider>
        )

        const button = screen.getByText('Show Toast')
        await user.click(button)

        expect(screen.getByText('Test Message')).toBeInTheDocument()

        act(() => {
            jest.advanceTimersByTime(3500)
        })

        expect(screen.queryByText('Test Message')).not.toBeInTheDocument()
    })

    it('hides toast when hideToast is called', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        )

        const showButton = screen.getByText('Show Toast')
        await user.click(showButton)
        expect(screen.getByText('Test Message')).toBeInTheDocument()

        const hideButton = screen.getByText('Hide Toast')
        await user.click(hideButton)

        expect(screen.queryByText('Test Message')).not.toBeInTheDocument()
    })

    it('respects custom duration per toast', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        render(
            <ToastProvider defaultDuration={2000}>
                <TestComponent />
            </ToastProvider>
        )

        const button = screen.getByText('Show Long Toast')
        await user.click(button)

        expect(screen.getByText('Custom Duration')).toBeInTheDocument()

        // Should still be visible after default duration
        act(() => {
            jest.advanceTimersByTime(3000)
        })
        expect(screen.getByText('Custom Duration')).toBeInTheDocument()

        // Should disappear after custom duration (10s)
        act(() => {
            jest.advanceTimersByTime(8000) // Total 11s
        })
        expect(screen.queryByText('Custom Duration')).not.toBeInTheDocument()
    })

    it('warns on empty message', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { })

        const TestEmpty = () => {
            const { showToast } = useToast()
            return <button onClick={() => showToast('')}>Empty</button>
        }

        render(
            <ToastProvider>
                <TestEmpty />
            </ToastProvider>
        )

        await user.click(screen.getByText('Empty'))

        expect(consoleSpy).toHaveBeenCalledWith('Toast message is empty')
        consoleSpy.mockRestore()
    })
})
