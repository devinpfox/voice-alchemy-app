'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wand2 } from 'lucide-react'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'instructor'>('student')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('role', role)
    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md glass-card">
        <div className="space-y-2 text-center mb-6">
          <div className="mb-4 flex justify-center">
            <Wand2 className="h-12 w-12 text-brand-gold" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/60">
            Join Voice Alchemy Academy and start your vocal journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-white">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">I am a</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
                  role === 'student'
                    ? 'border-brand-gold bg-brand-gold/20 text-brand-gold'
                    : 'border-white/20 text-white/70 hover:border-brand-gold/50 hover:bg-white/5'
                }`}
                disabled={loading}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`flex-1 rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
                  role === 'instructor'
                    ? 'border-brand-gold bg-brand-gold/20 text-brand-gold'
                    : 'border-white/20 text-white/70 hover:border-brand-gold/50 hover:bg-white/5'
                }`}
                disabled={loading}
              >
                Instructor
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-white/60">Already have an account? </span>
          <Link href="/login" className="text-brand-gold hover:text-brand-gold/80 font-semibold transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
