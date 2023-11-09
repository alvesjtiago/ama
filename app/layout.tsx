import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DiGithubAlt } from 'react-icons/di'

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
        <main className="container max-w-4xl mx-auto px-8 flex flex-col min-h-screen justify-between">
          <div className="my-8">{children}</div>
          <footer className="text-md border-t pt-8 my-8 h-10">
            <a href="https://github.com/alvesjtiago/ama" target="_blank">
              <DiGithubAlt />
            </a>
          </footer>
        </main>
      </body>
    </html>
  )
}
