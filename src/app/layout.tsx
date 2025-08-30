import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zouglou - Votre plateforme de musique Zouglou',
  description: 'Découvrez, écoutez et partagez la meilleure musique Zouglou. Profitez d\'une expérience musicale unique avec les meilleurs artistes ivoiriens.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
