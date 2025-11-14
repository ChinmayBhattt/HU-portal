'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Github, Mail } from 'lucide-react'

interface AuthButtonProps {
  provider: 'google' | 'github'
  variant?: 'default' | 'outline' | 'secondary'
  className?: string
  next?: string
}

export function AuthButton({ provider, variant = 'default', className, next }: AuthButtonProps) {
  const supabase = createClient()

  const handleSignIn = async () => {
    try {
      const callbackUrl = new URL('/auth/callback', window.location.origin)
      if (next) {
        callbackUrl.searchParams.set('next', next)
      }
      
      console.log('Auth button - callback URL:', callbackUrl.toString())
      console.log('Auth button - next parameter:', next)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString()
        }
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const getProviderInfo = () => {
    switch (provider) {
      case 'google':
        return {
          icon: <Mail className="w-4 h-4" />,
          label: 'Continue with Google'
        }
      case 'github':
        return {
          icon: <Github className="w-4 h-4" />,
          label: 'Continue with GitHub'
        }
      default:
        return {
          icon: null,
          label: 'Continue'
        }
    }
  }

  const { icon, label } = getProviderInfo()

  return (
    <Button
      onClick={handleSignIn}
      variant={variant}
      className={className}
      size="lg"
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  )
}