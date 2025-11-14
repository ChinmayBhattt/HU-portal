import Link from 'next/link'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Event } from '@/lib/supabase/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate >= new Date()
  
  return (
    <Link href={`/events/${event.id}`}>
      <div className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          {event.banner_url ? (
            <img
              src={event.banner_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl font-bold mb-2">
                  {format(eventDate, 'dd')}
                </div>
                <div className="text-lg">
                  {format(eventDate, 'MMM')}
                </div>
              </div>
            </div>
          )}
          
          {/* Event Type Badge */}
          <div className="absolute top-4 right-4">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
              event.event_type === 'online' && "bg-blue-500/20 text-blue-300 border border-blue-500/30",
              event.event_type === 'offline' && "bg-green-500/20 text-green-300 border border-green-500/30",
              event.event_type === 'hybrid' && "bg-purple-500/20 text-purple-300 border border-purple-500/30"
            )}>
              {event.event_type === 'online' && 'Online'}
              {event.event_type === 'offline' && 'In-Person'}
              {event.event_type === 'hybrid' && 'Hybrid'}
            </span>
          </div>

          {/* Status Badge - Show submission status */}
          {event.status === 'pending' && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 backdrop-blur-sm">
                Under Review
              </span>
            </div>
          )}
          
          {!isUpcoming && event.status === 'approved' && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-sm">
                Past Event
              </span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {event.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-400">
              <Users className="w-4 h-4 mr-1" />
              <span>0 registered</span>
            </div>
            
            <span className="text-sm font-medium text-purple-400">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}