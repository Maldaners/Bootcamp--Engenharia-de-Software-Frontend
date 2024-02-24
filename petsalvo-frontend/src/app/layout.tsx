import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PetSalvo',
  description: 'Ajudando os pets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={montserrat.className}>{children}</body>
      </html>
    </AuthProvider>
  )
}
