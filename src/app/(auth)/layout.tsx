import '../globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import AuthLayoutWrapper from '@/components/auth/AuthLayoutWrapper'


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <AuthLayoutWrapper>
            {children}
          </AuthLayoutWrapper>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
