import { createClient } from '@/lib/supabase/server'

/**
 * Check if the current user has admin role (teacher/instructor)
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin'
}

/**
 * Check if user is authenticated and has admin role
 * Throws error if not authorized
 */
export async function requireAdmin() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return { user, profile }
}
