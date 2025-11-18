'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  BookOpen,
  Video,
  MessageSquare,
  Mic,
  Settings,
  User,
  LogOut,
  Music,
  Headphones,
  Wind,
  Gauge,
  Wand2,
} from 'lucide-react'
import { logout } from '@/lib/supabase/actions'

const studentNavItems = [
  { href: '/dashboard/student', label: 'Dashboard', icon: Home },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/live', label: 'Live Sessions', icon: Video },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
]

const toolsNavItems = [
  { href: '/tools/tuner', label: 'Tuner', icon: Mic },
  { href: '/tools/pitch-training', label: 'Pitch Training', icon: Music },
  { href: '/tools/ear-training', label: 'Ear Training', icon: Headphones },
  { href: '/tools/warmups', label: 'Warmups', icon: Wind },
  { href: '/tools/metronome', label: 'Metronome', icon: Gauge },
]

const bottomNavItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform lg:translate-x-0">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Voice Alchemy</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div>
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Main
              </p>
              <div className="space-y-1">
                {studentNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Tools Navigation */}
            <div>
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Vocal Tools
              </p>
              <div className="space-y-1">
                {toolsNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t p-4">
          <div className="space-y-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
