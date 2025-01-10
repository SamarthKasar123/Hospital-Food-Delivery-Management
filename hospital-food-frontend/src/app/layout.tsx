import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { AppHeader } from '@/components/AppHeader'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <AppHeader />
            <main className="container mx-auto py-6 px-4">
              {children}
            </main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}

// app/page.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard'
import { PantryDashboard } from '@/components/dashboard/PantryDashboard'
import { DeliveryDashboard } from '@/components/dashboard/DeliveryDashboard'
import { LoginForm } from '@/components/auth/LoginForm'

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <LoginForm />
  }

  switch (user.role) {
    case 'MANAGER':
      return <ManagerDashboard />
    case 'PANTRY_STAFF':
      return <PantryDashboard />
    case 'DELIVERY_PERSONNEL':
      return <DeliveryDashboard />
    default:
      return <div>Invalid role</div>
  }
}