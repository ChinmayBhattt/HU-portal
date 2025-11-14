import { AuthButton } from '@/components/auth/auth-button'
import { HackersUnityLogo } from '@/components/ui/logo'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  console.log('Login page - next parameter:', params.next)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <HackersUnityLogo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to Hackers Unity
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Join our community of passionate hackers and innovators
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-white text-center">
              Sign in to your account
            </h3>
            
            <div className="space-y-3">
              <AuthButton 
                provider="google" 
                variant="outline"
                className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                next={params.next}
              />
              
              <AuthButton 
                provider="github" 
                variant="outline"
                className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                next={params.next}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">
                  By signing in, you agree to our
                </span>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-300 space-y-1">
              <a href="/community-guidelines" className="hover:text-white underline">
                Community Guidelines
              </a>
              <span className="mx-2">•</span>
              <a href="/privacy" className="hover:text-white underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}