import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zouglou - Votre plateforme de santé en ligne',
  description: 'Accédez à des services médicaux de qualité depuis chez vous. Consultations, analyses et suivi médical en ligne.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>

            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            </ToastProvider>

          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
