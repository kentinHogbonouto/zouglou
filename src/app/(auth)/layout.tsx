import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import AuthLayoutWrapper from '@/components/auth/AuthLayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zouglou - Authentification',
  description: 'Connectez-vous à votre compte Zouglou pour accéder à vos services de santé.',
}

export default function AuthLayout({
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
              <AuthLayoutWrapper>
                {children}
              </AuthLayoutWrapper>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
