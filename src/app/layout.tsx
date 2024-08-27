import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: 'Savings and Expenses Tracker',
  description: 'Track your monthly savings and expenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="cupcake">
      <body className={`${ibmPlexMono.variable} font-mono`}>
        <main className="h-screen flex items-center justify-center bg-base-100">
          {children}
        </main>
      </body>
    </html>
  )
}