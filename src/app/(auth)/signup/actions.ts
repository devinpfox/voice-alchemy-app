'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // emailRedirectTo: `${origin}/auth/callback`, // This is handled by the middleware now
    },
  })

  if (error) {
    console.error(error)
    redirect('/signup?message=Could not authenticate user')
  }

  // For email confirmation, Supabase sends a confirmation link.
  // You should show a message to the user to check their email.
  // For this example, we'll just redirect to a page that could show this message.
  revalidatePath('/', 'layout')
  redirect('/dashboard?message=Check email to continue sign in process')
}
