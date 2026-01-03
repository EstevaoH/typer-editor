import { render, screen } from '@testing-library/react'
import { Features } from '../Features'

describe('Features Component', () => {
    it('renders the section heading', () => {
        render(<Features />)

        const heading = screen.getByRole('heading', { name: /recursos poderosos/i })
        expect(heading).toBeInTheDocument()
    })

    it('renders the section description', () => {
        render(<Features />)

        const description = screen.getByText(/tudo que você precisa em um editor moderno e intuitivo/i)
        expect(description).toBeInTheDocument()
    })

    it('renders all 5 feature cards', () => {
        render(<Features />)

        // Check for all feature titles
        expect(screen.getByText('Edição em Tempo Real')).toBeInTheDocument()
        expect(screen.getByText('Múltiplos Formatos')).toBeInTheDocument()
        expect(screen.getByText('Sintaxe Highlight')).toBeInTheDocument()
        expect(screen.getByText('Totalmente Responsivo')).toBeInTheDocument()
        expect(screen.getByText('Privacidade Garantida')).toBeInTheDocument()
    })

    it('renders feature descriptions', () => {
        render(<Features />)

        expect(screen.getByText(/interface limpa e responsiva com salvamento automático instantâneo/i)).toBeInTheDocument()
        expect(screen.getByText(/exporte para txt, md, docx, pdf/i)).toBeInTheDocument()
        expect(screen.getByText(/suporte para destacar sintaxe/i)).toBeInTheDocument()
        expect(screen.getByText(/funciona perfeitamente em desktop, tablet e smartphone/i)).toBeInTheDocument()
        expect(screen.getByText(/seus documentos ficam salvos localmente/i)).toBeInTheDocument()
    })

    it('has the correct section id for navigation', () => {
        const { container } = render(<Features />)

        const section = container.querySelector('#features')
        expect(section).toBeInTheDocument()
    })

    it('renders feature icons', () => {
        const { container } = render(<Features />)

        // Check that SVG icons are present (lucide-react renders as SVG)
        const icons = container.querySelectorAll('svg')
        expect(icons.length).toBeGreaterThan(0)
    })

    it('renders features in a grid layout', () => {
        const { container } = render(<Features />)

        const grid = container.querySelector('.grid')
        expect(grid).toBeInTheDocument()
    })
})
