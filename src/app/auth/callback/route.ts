import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('Auth callback - next parameter:', next)
  console.log('Auth callback - code parameter:', code)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Auth successful, redirecting to:', `${origin}${next}`)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.log('Auth error:', error)
    }
  }

  console.log('Auth callback - no code or error, redirecting to home')
  // Redirect to home page instead of non-existent error page
  return NextResponse.redirect(`${origin}/`)
}