import { createClient } from '@/lib/supabase/server'
import { EventHeader } from '@/components/events/event-header'
import { EventDetails } from '@/components/events/event-details'
import { EventRegistration } from '@/components/events/event-registration'
import { notFound } from 'next/navigation'
import { generateSEO } from '@/lib/seo/seo-config'
import { Metadata } from 'next'
import { StructuredData } from '@/components/seo/structured-data'

interface EventDetailPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const supabase = await createClient()
  
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .eq('is_published', true)
    .single()

  if (!event) {
    return generateSEO({
      title: 'Event Not Found',
      description: 'The event you are looking for could not be found.',
      url: `/events/${params.id}`,
    })
  }

  return generateSEO({
    title: event.title,
    description: event.description,
    url: `/events/${params.id}`,
    image: event.image_url,
    type: 'article',
    publishedTime: event.created_at,
    modifiedTime: event.updated_at,
    section: event.category,
    tags: [event.event_type, event.category, event.location_type],
  })
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const supabase = await createClient()
  
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .eq('is_published', true)
    .single()

  if (!event) {
    notFound()
  }

  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', params.id)
    .eq('status', 'approved')

  const registrationCount = registrations?.length || 0

  return (
    <div className="min-h-screen bg-gray-900">
      <StructuredData type="event" data={event} />
      <EventHeader event={event} registrationCount={registrationCount} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventDetails event={event} />
          </div>
          <div className="lg:col-span-1">
            <EventRegistration event={event} registrationCount={registrationCount} />
          </div>
        </div>
      </div>
    </div>
  )
}