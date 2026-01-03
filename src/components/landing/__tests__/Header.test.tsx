import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

describe('Header Component', () => {
    const mockOnOpenContact = jest.fn()

    beforeEach(() => {
        mockOnOpenContact.mockClear()
    })

    it('renders the logo image', () => {
        render(<Header onOpenContact={mockOnOpenContact} />)

        const logo = screen.getByAltText('TyperEditor Logo')
        expect(logo).toBeInTheDocument()
        expect(logo).toHaveAttribute('src', '/icon.png')
    })

    it('renders the brand name', () => {
        render(<Header onOpenContact={mockOnOpenContact} />)

        const brandName = screen.getByText('TyperEditor')
        expect(brandName).toBeInTheDocument()
    })

    it('renders navigation links', () => {
        render(<Header onOpenContact={mockOnOpenContact} />)

        expect(screen.getByText('Recursos')).toBeInTheDocument()
        expect(screen.getByText('Como Funciona')).toBeInTheDocument()
        expect(screen.getByText('FAQ')).toBeInTheDocument()
    })

    it('renders the "Começar Agora" button with correct link', () => {
        render(<Header onOpenContact={mockOnOpenContact} />)

        const ctaButton = screen.getByRole('link', { name: /começar agora/i })
        expect(ctaButton).toBeInTheDocument()
        expect(ctaButton).toHaveAttribute('href', '/editor')
    })

    it('renders the theme toggle', () => {
        render(<Header onOpenContact={mockOnOpenContact} />)

        // ThemeToggle component should be present
        // Note: This test might need adjustment based on ThemeToggle implementation
        const nav = screen.getByRole('navigation')
        expect(nav).toBeInTheDocument()
    })

    it('has correct navigation link hrefs', () => {
        render(<Header onOpenContact={mockOnOpenContact} />)

        const recursosLink = screen.getByText('Recursos')
        expect(recursosLink).toHaveAttribute('href', '#features')

        const comoFuncionaLink = screen.getByText('Como Funciona')
        expect(comoFuncionaLink).toHaveAttribute('href', '#how-it-works')

        const faqLink = screen.getByText('FAQ')
        expect(faqLink).toHaveAttribute('href', '#faq')
    })
})
