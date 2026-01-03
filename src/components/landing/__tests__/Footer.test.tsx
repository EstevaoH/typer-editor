import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer Component', () => {
    const mockOnOpenContact = jest.fn()

    beforeEach(() => {
        mockOnOpenContact.mockClear()
    })

    it('renders the logo image', () => {
        render(<Footer onOpenContact={mockOnOpenContact} />)

        const logo = screen.getByAltText('TyperEditor Logo')
        expect(logo).toBeInTheDocument()
        expect(logo).toHaveAttribute('src', '/icon.png')
    })

    it('renders the brand name', () => {
        render(<Footer onOpenContact={mockOnOpenContact} />)

        const brandName = screen.getByText('TyperEditor')
        expect(brandName).toBeInTheDocument()
    })

    it('renders navigation links', () => {
        render(<Footer onOpenContact={mockOnOpenContact} />)

        expect(screen.getByText('Recursos')).toBeInTheDocument()
        expect(screen.getByText('Como Funciona')).toBeInTheDocument()
        expect(screen.getByText('Contato')).toBeInTheDocument()
        expect(screen.getByText('Privacidade')).toBeInTheDocument()
    })

    it('renders copyright text', () => {
        render(<Footer onOpenContact={mockOnOpenContact} />)

        const copyright = screen.getByText(/© 2024 TyperEditor/i)
        expect(copyright).toBeInTheDocument()
        expect(copyright).toHaveTextContent('Todos os direitos reservados')
    })

    it('has correct href for privacy link', () => {
        render(<Footer onOpenContact={mockOnOpenContact} />)

        const privacyLink = screen.getByText('Privacidade')
        expect(privacyLink).toHaveAttribute('href', '/privacy')
    })

    it('calls onOpenContact when contact button is clicked', () => {
        render(<Footer onOpenContact={mockOnOpenContact} />)

        const contactButton = screen.getByText('Contato')
        contactButton.click()

        expect(mockOnOpenContact).toHaveBeenCalledTimes(1)
    })

    it('has correct anchor hrefs for section links', () => {
        render(<Footer onOpenContact={mockOnOpenContact} />)

        const recursosLink = screen.getByText('Recursos')
        expect(recursosLink).toHaveAttribute('href', '#features')

        const comoFuncionaLink = screen.getByText('Como Funciona')
        expect(comoFuncionaLink).toHaveAttribute('href', '#how-it-works')
    })
})
