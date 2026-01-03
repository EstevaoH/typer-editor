import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UpcomingFeatures } from '../UpcomingFeatures'

describe('UpcomingFeatures Component', () => {
    const mockOnOpenContact = jest.fn()

    beforeEach(() => {
        mockOnOpenContact.mockClear()
    })

    it('renders the main heading', () => {
        render(<UpcomingFeatures onOpenContact={mockOnOpenContact} />)

        const heading = screen.getByRole('heading', { level: 2, name: /roadmap & novidades/i })
        expect(heading).toBeInTheDocument()
    })

    it('renders the description', () => {
        render(<UpcomingFeatures onOpenContact={mockOnOpenContact} />)

        const description = screen.getByText(/acompanhe a evolução do projeto/i)
        expect(description).toBeInTheDocument()
    })

    it('renders feature cards with status', () => {
        render(<UpcomingFeatures onOpenContact={mockOnOpenContact} />)

        // Check for some known features and their statuses
        expect(screen.getByText('Histórico de Versões')).toBeInTheDocument()

        const releasedLabels = screen.queryAllByText('Lançado')
        expect(releasedLabels.length).toBeGreaterThan(0)

        const comingSoonLabels = screen.queryAllByText('Em breve')
        expect(comingSoonLabels.length).toBeGreaterThan(0)

        const plannedLabels = screen.queryAllByText('Planejado')
        expect(plannedLabels.length).toBeGreaterThan(0)
    })

    it('renders suggestion section', () => {
        render(<UpcomingFeatures onOpenContact={mockOnOpenContact} />)

        expect(screen.getByText(/tem uma sugestão de funcionalidade/i)).toBeInTheDocument()
    })

    it('calls onOpenContact when suggestion button is clicked', async () => {
        render(<UpcomingFeatures onOpenContact={mockOnOpenContact} />)

        const button = screen.getByRole('button', { name: /envie sua ideia/i })
        await userEvent.click(button)

        expect(mockOnOpenContact).toHaveBeenCalledTimes(1)
    })

    it('has correct section id', () => {
        const { container } = render(<UpcomingFeatures onOpenContact={mockOnOpenContact} />)

        const section = container.querySelector('#upcoming-features')
        expect(section).toBeInTheDocument()
    })

    it('renders icons for features', () => {
        const { container } = render(<UpcomingFeatures onOpenContact={mockOnOpenContact} />)

        const icons = container.querySelectorAll('svg')
        expect(icons.length).toBeGreaterThan(0)
    })
})
