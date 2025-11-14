import { motion, Variants } from 'framer-motion'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'

interface UpcomingEventsProps {
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
  }>
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const upcomingEvents = events.filter(event => new Date(event.start_date) > new Date()).slice(0, 3)

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

  if (upcomingEvents.length === 0) {
    return null
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
      
      <div className="space-y-6">
        {upcomingEvents.map((event) => {
          const startDate = new Date(event.start_date)
          const daysUntilEvent = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          
          return (
            <motion.div
              key={event.id}
              variants={itemVariants}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {event.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{format(startDate, 'MMM d, h:mm a')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                    {daysUntilEvent === 0 ? 'Today' : daysUntilEvent === 1 ? 'Tomorrow' : `${daysUntilEvent} days`}
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                    {event.max_attendees} max
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}