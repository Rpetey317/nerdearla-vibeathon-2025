import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RoleProvider } from '@/context/role-context'
import { SessionProvider } from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rep\'s EduCompass - Educational Dashboard',
  description: 'Navigate student progress with Rep\'s EduCompass - A comprehensive educational dashboard for Semillero Digital',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <RoleProvider>
            {children}
          </RoleProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
