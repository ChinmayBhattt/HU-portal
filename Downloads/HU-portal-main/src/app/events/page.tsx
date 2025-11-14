import { createClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/events/event-card'
import { EventFilters } from '@/components/events/event-filters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Filter } from 'lucide-react'
import { generateSEO } from '@/lib/seo/seo-config'
import { Metadata } from 'next'

interface EventsPageProps {
  searchParams: {
    category?: string
    date?: string
    location?: string
    type?: string
  }
}

export const metadata: Metadata = generateSEO({
  title: 'Events',
  description: 'Discover and join amazing tech events, workshops, hackathons, and meetups in India\'s hacker community.',
  url: '/events',
  keywords: ['tech events', 'hackathons', 'workshops', 'meetups', 'tech community', 'India'],
})

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  // First, try to get the current user
  const { data: { user } } = await supabase.auth.getUser()
  
  let query = supabase
    .from('events')
    .select('*')
    // Show published events OR user's own pending submissions
    .or(`is_published.eq.true,and(organizer_email.eq.${user?.email || ''},status.eq.pending)`)

  // Apply filters
  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }

  if (params.date) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    switch (params.date) {
      case 'today':
        query = query.eq('date', today.toISOString().split('T')[0])
        break
      case 'week':
        const nextWeek = new Date(today)
        nextWeek.setDate(nextWeek.getDate() + 7)
        query = query.gte('date', today.toISOString().split('T')[0])
          .lte('date', nextWeek.toISOString().split('T')[0])
        break
      case 'month':
        const nextMonth = new Date(today)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        query = query.gte('date', today.toISOString().split('T')[0])
          .lte('date', nextMonth.toISOString().split('T')[0])
        break
    }
  }

  if (params.location) {
    query = query.ilike('location', `%${params.location}%`)
  }

  if (params.type && params.type !== 'all') {
    query = query.eq('event_type', params.type)
  }

  const { data: events } = await query
    .order('date', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                All Events
              </h1>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Back to Home
              </Button>
            </Link>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl">
            Discover amazing tech events, workshops, and hackathons happening across India.
          </p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              You can see your submitted events that are under review. They will appear with a &quot;Under Review&quot; badge.
            </p>
          )}
        </div>

        {/* Filters */}
        <EventFilters searchParams={searchParams} />

        {/* Events Grid */}
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or check back later for new events.
              </p>
              <Link href="/events">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  Clear Filters
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
