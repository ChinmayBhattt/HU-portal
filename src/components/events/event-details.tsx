import { Calendar, MapPin, Users, Clock, Globe, Share2, Heart } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { format } from 'date-fns'
import Image from 'next/image'

interface EventDetailsProps {
  event: {
    id: string
    title: string
    description: string
    full_description: string
    start_date: string
    end_date: string
    location: string
    location_type: 'online' | 'in_person' | 'hybrid'
    max_attendees: number
    event_type: string
    category: string
    image_url: string
    organizer_id: string
    created_at: string
    updated_at: string
    is_published: boolean
    meeting_url?: string
    venue_details?: string
    requirements?: string
    what_to_bring?: string
  }
}

export function EventDetails({ event }: EventDetailsProps) {
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Event Image */}
      <motion.div variants={itemVariants} className="relative">
        <div className="aspect-video relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Calendar className="w-16 h-16 mx-auto text-white/40 mb-4" />
                <p className="text-white/60">Event Image</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Event Description */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">About This Event</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed text-lg">
            {event.full_description || event.description}
          </p>
        </div>
      </motion.div>

      {/* Event Details */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date and Time */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Date & Time</h3>
              <p className="text-gray-300">
                {format(startDate, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-gray-400 text-sm">
                {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Location</h3>
              <p className="text-gray-300">{event.location}</p>
              <p className="text-gray-400 text-sm capitalize">
                {event.location_type.replace('_', ' ')}
              </p>
              {event.meeting_url && (
                <a
                  href={event.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Join Online
                </a>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Capacity</h3>
              <p className="text-gray-300">{event.max_attendees} attendees</p>
              <p className="text-gray-400 text-sm">Maximum capacity</p>
            </div>
          </div>

          {/* Event Type */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <Globe className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Event Type</h3>
              <p className="text-gray-300">{event.event_type}</p>
              <p className="text-gray-400 text-sm">{event.category}</p>
            </div>
          </div>
        </div>

        {/* Venue Details */}
        {event.venue_details && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="font-semibold text-white mb-2">Venue Details</h3>
            <p className="text-gray-300">{event.venue_details}</p>
          </div>
        )}

        {/* Requirements */}
        {event.requirements && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="font-semibold text-white mb-2">Requirements</h3>
            <p className="text-gray-300">{event.requirements}</p>
          </div>
        )}

        {/* What to Bring */}
        {event.what_to_bring && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="font-semibold text-white mb-2">What to Bring</h3>
            <p className="text-gray-300">{event.what_to_bring}</p>
          </div>
        )}
      </motion.div>

      {/* Share Event */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Share This Event</h2>
        <p className="text-gray-400 mb-6">Help spread the word about this amazing event!</p>
        
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">Share</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-colors">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-red-400">Save</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}