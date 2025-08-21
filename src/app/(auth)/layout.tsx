
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <section className="flex flex-col items-center justify-center py-8">
                {children}
            </section>
        </>
    )
}