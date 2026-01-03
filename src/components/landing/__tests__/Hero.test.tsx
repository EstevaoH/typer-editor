import { render, screen } from '@testing-library/react'
import { Hero } from '../Hero'

describe('Hero Component', () => {
    it('renders the main heading', () => {
        render(<Hero />)

        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent(/Escreva, Edite e Compartilhe/i)
    })

    it('renders the badge with "Editor Online Revolucionário"', () => {
        render(<Hero />)

        const badge = screen.getByText('Editor Online Revolucionário')
        expect(badge).toBeInTheDocument()
    })

    it('renders the description text', () => {
        render(<Hero />)

        const description = screen.getByText(/O editor de texto moderno que funciona diretamente no seu navegador/i)
        expect(description).toBeInTheDocument()
    })

    it('renders the CTA button with correct link', () => {
        render(<Hero />)

        const ctaButton = screen.getByRole('link', { name: /começar a editar/i })
        expect(ctaButton).toBeInTheDocument()
        expect(ctaButton).toHaveAttribute('href', '/editor')
    })

    it('renders the code preview section', () => {
        render(<Hero />)

        // Check for the document name in the preview
        const documentName = screen.getByText('documento.md')
        expect(documentName).toBeInTheDocument()
    })

    it('renders the welcome message in code preview', () => {
        render(<Hero />)

        const welcomeText = screen.getByText(/Bem-vindo ao TyperEditor/i)
        expect(welcomeText).toBeInTheDocument()
    })

    it('renders the features list in code preview', () => {
        render(<Hero />)

        expect(screen.getByText(/Edição em tempo real com interface limpa/i)).toBeInTheDocument()
        expect(screen.getByText(/Salvamento automático no navegador/i)).toBeInTheDocument()
        expect(screen.getByText(/Exporte para TXT, MD, DOCX, PDF/i)).toBeInTheDocument()
    })

    it('renders the traffic light dots in preview', () => {
        render(<Hero />)

        // The preview should have the window controls (red, yellow, green dots)
        const preview = screen.getByText('documento.md').parentElement
        expect(preview).toBeInTheDocument()
    })

    it('has gradient styling on the main heading', () => {
        render(<Hero />)

        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toHaveClass('bg-gradient-to-r')
    })
})
