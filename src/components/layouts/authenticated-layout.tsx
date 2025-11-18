import { Sidebar } from './sidebar'
import { MobileNav } from './mobile-nav'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="pt-16 lg:pl-64 lg:pt-0">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
