import { createClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/events/event-card'
import { ThemedEventCard } from '@/components/events/themed-event-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, TrendingUp, Users, MapPin, Clock, Star, ArrowRight, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { generateSEO } from '@/lib/seo/seo-config'
import { Metadata } from 'next'

export const metadata: Metadata = generateSEO({
  title: 'Discover',
  description: 'Discover amazing tech events, communities, and opportunities in India\'s hacker ecosystem.',
  url: '/discover',
  keywords: ['discover', 'tech events', 'hackathons', 'communities', 'tech ecosystem', 'India'],
})

interface DiscoverPageProps {
  searchParams: {
    category?: string
    location?: string
    type?: string
  }
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get featured events (upcoming and published)
  const { data: featuredEvents } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(6)

  // Get trending events (most recent with registrations)
  const { data: trendingEvents } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('created_at', { ascending: false })
    .limit(4)

  // Get past events for reference
  const { data: pastEvents } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .lt('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: false })
    .limit(3)

  // Get unique categories and locations for filters
  const { data: allEvents } = await supabase
    .from('events')
    .select('category, location, city')
    .eq('is_published', true)

  const categories = [...new Set(allEvents?.map(event => event.category).filter(Boolean))]
  const locations = [...new Set(allEvents?.map(event => event.location || event.city).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Discover
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore the vibrant tech ecosystem of India. Find events, communities, and opportunities that match your interests.
          </p>
        </div>

        {/* Quick Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/events">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                All Events
              </Button>
            </Link>
            <Link href="/create-event">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                <Star className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Section */}
        {featuredEvents && featuredEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">Featured Events</h2>
              </div>
              <Link href="/events" className="text-purple-400 hover:text-purple-300 flex items-center">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                event.theme_id ? (
                  <ThemedEventCard key={event.id} event={event} />
                ) : (
                  <EventCard key={event.id} event={event} />
                )
              ))}
            </div>
          </section>
        )}

        {/* Trending Section */}
        {trendingEvents && trendingEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingEvents.map((event) => (
                <div key={event.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  
                  <Link href={`/events/${event.id}`} className="mt-4 inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/events?category=${category.toLowerCase()}`}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-all duration-200 border border-gray-700 hover:border-purple-500"
                >
                  <div className="text-white font-medium capitalize">{category}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    {allEvents?.filter(event => event.category === category).length} events
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Locations Section */}
        {locations.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Popular Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {locations.slice(0, 8).map((location) => (
                <Link
                  key={location}
                  href={`/events?location=${encodeURIComponent(location)}`}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-all duration-200 border border-gray-700 hover:border-blue-500"
                >
                  <MapPin className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-medium">{location}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    {allEvents?.filter(event => (event.location === location || event.city === location)).length} events
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Events Section */}
        {pastEvents && pastEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-gray-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">Recent Events</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 opacity-75">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {format(new Date(event.date), 'MMM d, yyyy')} • {event.location}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!featuredEvents?.length && !trendingEvents?.length && (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-400 mb-6">
                Check back later for new events and opportunities.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Be part of India's growing hacker ecosystem. Create events, join communities, and connect with like-minded tech enthusiasts.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/join">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </Link>
            <Link href="/create-event">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}