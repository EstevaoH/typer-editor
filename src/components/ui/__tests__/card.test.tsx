import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card'

describe('Card Component', () => {
    it('renders card with subclasses', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        )

        expect(screen.getByText('Card Title')).toBeInTheDocument()
        expect(screen.getByText('Card Description')).toBeInTheDocument()
        expect(screen.getByText('Card Content')).toBeInTheDocument()
        expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })

    it('applies custom className to Card', () => {
        render(<Card className="custom-card-class">Content</Card>)
        // Use text match to find the container div, as Card doesn't have a specific role by default
        // Or cleaner: render with testid
        const card = screen.getByText('Content').closest('div')
        expect(card).toHaveClass('custom-card-class')
    })

    it('renders content correctly', () => {
        render(<Card>Test Content</Card>)
        expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
})
