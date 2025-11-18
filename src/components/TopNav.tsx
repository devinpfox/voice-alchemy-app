'use client'

import { Menu, UserCircle } from 'lucide-react'
import { useState } from 'react'

export default function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="w-full bg-card border-b border-border p-4 flex items-center justify-between md:justify-end h-16">
      {/* Mobile menu toggle */}
      <button
        className="md:hidden p-2 rounded-md bg-secondary text-secondary-foreground"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu size={24} />
      </button>

      {/* User Info / Profile */}
      <div className="flex items-center space-x-2">
        <UserCircle size={32} className="text-muted-foreground" />
        <span className="font-medium hidden sm:block">John Doe</span> {/* Placeholder for user name */}
      </div>

      {/* Mobile Menu Overlay (for future implementation) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute top-0 left-0 w-64 h-full bg-card p-4 shadow-lg">
            {/* Mobile sidebar content will go here */}
            <button
              className="absolute top-4 right-4 p-2 rounded-md bg-secondary text-secondary-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Menu size={24} /> {/* Can be a close icon */}
            </button>
            <h2 className="text-2xl font-bold text-primary mb-6">Menu</h2>
            {/* Navigation links for mobile */}
          </div>
        </div>
      )}
    </header>
  )
}
