import { render, screen } from '@testing-library/react'
import { HowItWorks } from '../HowItWorks'

describe('HowItWorks Component', () => {
    it('renders the main heading', () => {
        render(<HowItWorks />)

        const heading = screen.getByRole('heading', { level: 2, name: /como funciona/i })
        expect(heading).toBeInTheDocument()
    })

    it('renders the description', () => {
        render(<HowItWorks />)

        const description = screen.getByText(/simples e intuitivo em três passos/i)
        expect(description).toBeInTheDocument()
    })

    it('renders all three steps', () => {
        render(<HowItWorks />)

        // Check step numbers
        expect(screen.getByText('01')).toBeInTheDocument()
        expect(screen.getByText('02')).toBeInTheDocument()
        expect(screen.getByText('03')).toBeInTheDocument()

        // Check titles
        expect(screen.getByText('Crie seu Documento')).toBeInTheDocument()
        expect(screen.getByText('Edite e Formate')).toBeInTheDocument()
        expect(screen.getByText('Exporte e Compartilhe')).toBeInTheDocument()
    })

    it('renders step descriptions', () => {
        render(<HowItWorks />)

        expect(screen.getByText(/acesse o editor e comece a escrever/i)).toBeInTheDocument()
        expect(screen.getByText(/use as ferramentas de formatação/i)).toBeInTheDocument()
        expect(screen.getByText(/baixe em múltiplos formatos/i)).toBeInTheDocument()
    })

    it('has correct section id', () => {
        const { container } = render(<HowItWorks />)

        const section = container.querySelector('#how-it-works')
        expect(section).toBeInTheDocument()
    })

    it('renders step icons', () => {
        const { container } = render(<HowItWorks />)

        const icons = container.querySelectorAll('svg')
        expect(icons.length).toBeGreaterThanOrEqual(3)
    })
})
