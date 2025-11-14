'use client'

import { motion } from 'framer-motion'
import { Event } from '@/lib/supabase/types'
import { Calendar, MapPin, Clock, Users, Share2 } from 'lucide-react'
import { format } from 'date-fns'

interface EventHeaderProps {
  event: Event
  registrationCount: number
}

export function EventHeader({ event, registrationCount }: EventHeaderProps) {
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate >= new Date()

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Event link copied to clipboard!')
    }
  }

  return (
    <div className="relative h-96 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {event.banner_url && (
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Event Type Badge */}
            <div className="flex items-center gap-4 mb-4">
              <span className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm",
                event.event_type === 'online' && "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                event.event_type === 'offline' && "bg-green-500/20 text-green-300 border border-green-500/30",
                event.event_type === 'hybrid' && "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              )}>
                {event.event_type === 'online' && 'Online Event'}
                {event.event_type === 'offline' && 'In-Person Event'}
                {event.event_type === 'hybrid' && 'Hybrid Event'}
              </span>
              
              {!isUpcoming && (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-sm">
                  Past Event
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {event.title}
            </h1>

            {/* Details */}
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{event.time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{event.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">{registrationCount} registered</span>
              </div>
            </div>

            {/* Share Button */}
            <div className="mt-6">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Event
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}