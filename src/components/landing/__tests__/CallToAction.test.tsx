import { render, screen } from '@testing-library/react'
import { CallToAction } from '../CallToAction'

describe('CallToAction Component', () => {
    it('renders the main heading', () => {
        render(<CallToAction />)

        const heading = screen.getByRole('heading', { name: /pronto para começar/i })
        expect(heading).toBeInTheDocument()
    })

    it('renders the description text', () => {
        render(<CallToAction />)

        const description = screen.getByText(/junte-se a milhares de usuários/i)
        expect(description).toBeInTheDocument()
        expect(description).toHaveTextContent('TyperEditor')
    })

    it('renders the CTA button with correct text', () => {
        render(<CallToAction />)

        const ctaButton = screen.getByRole('link', { name: /criar primeiro documento/i })
        expect(ctaButton).toBeInTheDocument()
    })

    it('CTA button links to the editor', () => {
        render(<CallToAction />)

        const ctaButton = screen.getByRole('link', { name: /criar primeiro documento/i })
        expect(ctaButton).toHaveAttribute('href', '/editor')
    })

    it('renders the Edit icon in the button', () => {
        const { container } = render(<CallToAction />)

        // Check that an SVG icon is present (lucide-react renders as SVG)
        const button = screen.getByRole('link', { name: /criar primeiro documento/i })
        const svg = button.querySelector('svg')
        expect(svg).toBeInTheDocument()
    })

    it('has gradient background styling', () => {
        const { container } = render(<CallToAction />)

        const section = container.querySelector('section')
        expect(section).toHaveClass('bg-gradient-to-r')
    })
})
