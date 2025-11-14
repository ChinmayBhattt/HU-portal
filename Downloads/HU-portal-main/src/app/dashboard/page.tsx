import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentEvents } from '@/components/dashboard/recent-events'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { UpcomingEvents } from '@/components/dashboard/upcoming-events'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user's events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('start_date', { ascending: true })

  // Get registrations for user's events
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('*, events!inner(title)')
    .eq('events.organizer_id', user.id)

  const totalEvents = events?.length || 0
  const totalRegistrations = registrations?.length || 0
  const upcomingEvents = events?.filter(event => new Date(event.start_date) > new Date()).length || 0
  const pastEvents = events?.filter(event => new Date(event.end_date) < new Date()).length || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Organizer Dashboard</h1>
        <p className="text-gray-400">Manage your events and track performance</p>
      </div>

      <DashboardStats 
        totalEvents={totalEvents}
        totalRegistrations={totalRegistrations}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <RecentEvents events={events || []} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      <div className="mt-8">
        <UpcomingEvents events={events || []} />
      </div>
    </div>
  )
}