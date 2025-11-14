'use client'

import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Calendar, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

interface EventRegistrationProps {
  event: {
    id: string
    title: string
    description: string
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
  registrationCount: number
}

export function EventRegistration({ event, registrationCount }: EventRegistrationProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  const isEventFull = registrationCount >= event.max_attendees
  const isEventPast = endDate < new Date()
  const isEventUpcoming = startDate > new Date()

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please log in to register for this event')
      return
    }

    if (isEventFull) {
      toast.error('This event is full')
      return
    }

    if (isEventPast) {
      toast.error('This event has already ended')
      return
    }

    setIsRegistering(true)

    try {
      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .single()

      if (existingRegistration) {
        toast.info('You are already registered for this event')
        setIsRegistered(true)
        return
      }

      // Create registration
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          status: 'approved', // Auto-approve for now
          registered_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }

      setIsRegistered(true)
      toast.success('Successfully registered for the event!')
      
      // Send confirmation email (would be handled by Supabase email templates)
      // This is a placeholder for email functionality
      
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to register for the event. Please try again.')
    } finally {
      setIsRegistering(false)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
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
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 sticky top-8"
    >
      {/* Event Info */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-medium">{format(startDate, 'MMM d, yyyy')}</p>
            <p className="text-gray-400 text-sm">
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-medium">{event.location}</p>
            <p className="text-gray-400 text-sm capitalize">
              {event.location_type.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-white font-medium">{registrationCount} registered</p>
            <p className="text-gray-400 text-sm">of {event.max_attendees} spots</p>
          </div>
        </div>
      </div>

      {/* Registration Status */}
      <div className="mb-6">
        {isRegistered ? (
          <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">You are registered!</span>
          </div>
        ) : isEventFull ? (
          <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Event is full</span>
          </div>
        ) : isEventPast ? (
          <div className="flex items-center space-x-2 p-4 bg-gray-500/10 border border-gray-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 font-medium">Event has ended</span>
          </div>
        ) : !user ? (
          <div className="flex items-center space-x-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Login to register</span>
          </div>
        ) : null}
      </div>

      {/* Registration Button */}
      <Button
        onClick={handleRegister}
        disabled={isRegistering || isRegistered || isEventFull || isEventPast || !user}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isRegistering ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Registering...
          </>
        ) : isRegistered ? (
          'Already Registered'
        ) : isEventFull ? (
          'Event Full'
        ) : isEventPast ? (
          'Event Ended'
        ) : !user ? (
          'Login to Register'
        ) : (
          'Register Now'
        )}
      </Button>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="space-y-3 text-sm text-gray-400">
          <p className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Free registration</span>
          </p>
          <p className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Instant confirmation</span>
          </p>
          <p className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Join community</span>
          </p>
        </div>
      </div>

      {/* Calendar Add */}
      {isEventUpcoming && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={() => {
              // Generate calendar link
              const startTime = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
              const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
              const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
              window.open(calendarUrl, '_blank')
            }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
        </div>
      )}
    </motion.div>
  )
}