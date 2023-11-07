import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AMA',
  description: 'Farcaster AMA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container max-w-4xl mx-auto my-8 px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
