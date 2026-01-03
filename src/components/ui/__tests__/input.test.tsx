import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input Component', () => {
    it('renders an input element', () => {
        render(<Input />)
        const input = screen.getByRole('textbox') // Default role for input type="text" (default)
        expect(input).toBeInTheDocument()
    })

    it('applies custom className', () => {
        render(<Input className="custom-class" />)
        const input = screen.getByRole('textbox')
        expect(input).toHaveClass('custom-class')
    })

    it('forwards refs correctly', () => {
        const ref = { current: null }
        render(<Input ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('handles type attribute', () => {
        render(<Input type="email" />)
        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('type', 'email')
    })

    it('handles user input', async () => {
        render(<Input />)
        const input = screen.getByRole('textbox')
        await userEvent.type(input, 'Hello World')
        expect(input).toHaveValue('Hello World')
    })

    it('can be disabled', () => {
        render(<Input disabled />)
        const input = screen.getByRole('textbox')
        expect(input).toBeDisabled()
    })

    it('renders with placeholder', () => {
        render(<Input placeholder="Enter text" />)
        const input = screen.getByPlaceholderText('Enter text')
        expect(input).toBeInTheDocument()
    })
})
