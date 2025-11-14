import Link from 'next/link'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Event } from '@/lib/supabase/types'

interface ThemedEventCardProps {
  event: Event
}

export function ThemedEventCard({ event }: ThemedEventCardProps) {
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate >= new Date()
  
  // Apply theme if available
  const theme = event.theme_colors && typeof event.theme_colors === 'string' ? JSON.parse(event.theme_colors) : null
  const themeStyle = event.theme_style || 'default'
  const themeFont = event.theme_font || 'font-sans'
  
  const getCardBackground = () => {
    if (theme) {
      return theme.background === '#ffffff' ? 'bg-white' : 'bg-gray-900'
    }
    return 'bg-gray-900'
  }
  
  const getTextColor = () => {
    if (theme) {
      return theme.text === '#ffffff' ? 'text-white' : 'text-gray-900'
    }
    return 'text-white'
  }
  
  const getPrimaryColor = () => {
    if (theme) {
      // Map theme colors to Tailwind classes
      const colorMap: { [key: string]: string } = {
        '#8b5cf6': 'text-purple-500',
        '#3b82f6': 'text-blue-500',
        '#06b6d4': 'text-cyan-500',
        '#ec4899': 'text-pink-500',
        '#ef4444': 'text-red-500',
        '#f59e0b': 'text-amber-500',
        '#10b981': 'text-emerald-500',
        '#a855f7': 'text-purple-600',
        '#f97316': 'text-orange-500',
        '#64748b': 'text-slate-500',
        '#94a3b8': 'text-slate-400',
        '#f1f5f9': 'text-slate-100',
      }
      return colorMap[theme.primary] || 'text-purple-400'
    }
    return 'text-purple-400'
  }
  
  const getHeaderBackground = () => {
    if (theme) {
      switch (event.theme_id) {
        case 'minimal':
          return 'bg-gradient-to-br from-gray-100 to-gray-200'
        case 'quantum':
          return 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
        case 'warp':
          return 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500'
        case 'emoji':
          return 'bg-gradient-to-br from-green-400 to-blue-500'
        case 'confetti':
          return 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
        case 'pattern':
          return 'bg-gradient-to-br from-slate-800 via-gray-900 to-black'
        default:
          return 'bg-gradient-to-br from-purple-600 to-blue-600'
      }
    }
    return 'bg-gradient-to-br from-purple-600 to-blue-600'
  }

  return (
    <Link href={`/events/${event.id}`}>
      <div className={cn(
        "group rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-2xl",
        getCardBackground(),
        "border-gray-700 hover:border-purple-500"
      )}>
        {/* Event Image with Theme */}
        <div className="relative h-48 overflow-hidden">
          {event.banner_url ? (
            <img
              src={event.banner_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={cn("w-full h-full flex items-center justify-center", getHeaderBackground())}>
              <div className={cn("text-center", getTextColor())}>
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
              "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border",
              event.event_type === 'online' && "bg-blue-500/20 text-blue-300 border-blue-500/30",
              event.event_type === 'offline' && "bg-green-500/20 text-green-300 border-green-500/30",
              event.event_type === 'hybrid' && "bg-purple-500/20 text-purple-300 border-purple-500/30"
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

        {/* Event Details with Theme */}
        <div className="p-6">
          <h3 className={cn("text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors", getTextColor())}>
            {event.title}
          </h3>
          
          <p className={cn("text-sm mb-4 line-clamp-2 opacity-80", getTextColor())}>
            {event.description}
          </p>

          <div className={cn("space-y-2 text-sm", getTextColor())}>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 opacity-70" />
              <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 opacity-70" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 opacity-70" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className={cn("flex items-center text-sm opacity-70", getTextColor())}>
              <Users className="w-4 h-4 mr-1" />
              <span>0 registered</span>
            </div>
            
            <span className={cn("text-sm font-medium", getPrimaryColor())}>
              View Details →
            </span>
          </div>

          {/* Theme Info */}
          {event.theme_name && (
            <div className={cn("mt-3 pt-3 border-t border-gray-700 text-xs opacity-60", getTextColor())}>
              Theme: {event.theme_name}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}