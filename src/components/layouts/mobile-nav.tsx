'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, Wand2 } from 'lucide-react'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Voice Alchemy</span>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 hover:bg-accent"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-64 bg-background shadow-lg transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-end border-b px-4">
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 hover:bg-accent"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <Link
              href="/dashboard/student"
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/courses"
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/live"
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Live Sessions
            </Link>
            <Link
              href="/messages"
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Messages
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
