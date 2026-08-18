import Link from 'next/link'
export default function notFound() {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <h1>404 - Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/">Go back to home</Link>
        </div>
    )
}
