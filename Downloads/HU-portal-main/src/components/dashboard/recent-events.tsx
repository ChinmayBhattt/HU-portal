import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Calendar, MapPin, Users, ExternalLink, Edit } from 'lucide-react'
import { format } from 'date-fns'

interface RecentEventsProps {
  events: Array<{
    id: string
    title: string
    start_date: string
    end_date: string
    location: string
    location_type: 'online' | 'in_person' | 'hybrid'
    max_attendees: number
    event_type: string
    category: string
    is_published: boolean
    created_at: string
  }>
}

export function RecentEvents({ events }: RecentEventsProps) {
  const recentEvents = events.slice(0, 5)

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
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Recent Events</h2>
        <Link 
          href="/dashboard/events"
          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      {recentEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No events created yet</p>
          <Link 
            href="/dashboard/create-event"
            className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recentEvents.map((event) => {
            const startDate = new Date(event.start_date)
            const isUpcoming = startDate > new Date()
            
            return (
              <motion.div
                key={event.id}
                variants={itemVariants}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {event.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.is_published 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {event.is_published ? 'Published' : 'Draft'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isUpcoming 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(startDate, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{event.max_attendees} max</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/events/${event.id}`}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="View Event"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/events/${event.id}/edit`}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="Edit Event"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}