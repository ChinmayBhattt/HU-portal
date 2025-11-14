import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    // For dashboard routes, always redirect to login with dashboard as the next destination
    // The specific sub-route will be handled by the navigation after login
    redirect('/login?next=/dashboard')
  }

  // Check if user is an organizer
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('is_organizer')
    .eq('id', user.id)
    .single()

  const isOrganizer = userProfile?.is_organizer || false

  // For now, allow all authenticated users to access the dashboard
  // This is a temporary fix to resolve the 404 issue
  if (!isOrganizer) {
    console.log('User is not organizer, but allowing access')
    // Don't redirect - let users access the dashboard even if they're not organizers
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar isOrganizer={isOrganizer} />
        <main className="flex-1 ml-64 pt-16">
          {children}
        </main>
      </div>
    </div>
  )
}