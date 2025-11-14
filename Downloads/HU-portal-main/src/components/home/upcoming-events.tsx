import { createClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/events/event-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export async function UpcomingEvents() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(6)

  if (!events || events.length === 0) {
    return (
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            No Upcoming Events
          </h2>
          <p className="text-gray-400 mb-8">
            Check back soon for amazing events!
          </p>
          <Link href="/events">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              View All Events
            </Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Upcoming Events
            </h2>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't miss out on these amazing events. Join our community and be part of the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/events">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}