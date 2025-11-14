import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'icon'
}

export function HackersUnityLogo({ className, variant = 'default' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        className={cn("h-8 w-8", className)}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
        <path
          d="M16 8L24 16L16 24L8 16L16 8Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M16 12L20 16L16 20L12 16L16 12Z"
          fill="url(#gradient)"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#8B5CF6"/>
            <stop offset="1" stopColor="#3B82F6"/>
          </linearGradient>
        </defs>
      </svg>
    )
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <HackersUnityLogo variant="icon" />
      <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Hackers Unity
      </span>
    </div>
  )
}