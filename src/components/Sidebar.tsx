'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/dashboard/actions' // Re-using the logout action
import { Home, Book, GraduationCap, MessageSquare, Music, Settings, LogOut, LayoutDashboard } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/courses', icon: Book, label: 'Courses' },
    { href: '/masterclasses', icon: GraduationCap, label: 'Masterclasses' },
    { href: '/messaging', icon: MessageSquare, label: 'Messaging' },
    { href: '/tools', icon: Music, label: 'Tools' },
    { href: '/library', icon: LayoutDashboard, label: 'Library' }, // Using LayoutDashboard for Library/Blog
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4 h-screen fixed top-0 left-0">
      <div className="flex items-center justify-center h-16 border-b border-border mb-6">
        <h2 className="text-2xl font-bold text-primary">Voice Alchemy</h2>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-md text-sm font-medium transition-colors
                  ${pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <form>
          <button
            formAction={logout}
            className="flex items-center w-full p-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  )
}
