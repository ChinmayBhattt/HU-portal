'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Calendar, MapPin, User, Mail, Phone, Globe, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface EventApprovalCardProps {
  event: {
    id: string
    title: string
    description: string
    full_description?: string | null
    date?: string | null
    time?: string | null
    start_date?: string | null
    end_date?: string | null
    location: string
    location_type?: string | null
    event_type: string | null
    max_capacity?: number | null
    max_attendees?: number | null
    category: string
    meeting_url?: string | null
    venue_details?: string | null
    requirements?: string | null
    what_to_bring?: string | null
    organizer_name: string | null
    organizer_email: string | null
    organizer_phone: string | null
    image_url?: string | null
    banner_url?: string | null
    created_at: string
  }
}

export function EventApprovalCard({ event }: EventApprovalCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()

  const handleApproval = async (action: 'approve' | 'reject') => {
    setIsProcessing(true)
    
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          is_published: action === 'approve'
        })
        .eq('id', event.id)

      if (error) {
        throw error
      }

      toast.success(`Event ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error('Error processing event:', error)
      toast.error(`Failed to ${action} event. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string | null, timeString?: string | null) => {
    if (!dateString) return 'Not specified'
    
    let dateTime = new Date(dateString)
    
    // If we have a separate time string, combine it with the date
    if (timeString) {
      const [hours, minutes] = timeString.split(':')
      dateTime.setHours(parseInt(hours), parseInt(minutes))
    }
    
    return dateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl text-white mb-2">{event.title}</CardTitle>
            <CardDescription className="text-gray-400">
              Submitted on {new Date(event.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
            Pending Review
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Event Description */}
        <div>
          <h4 className="font-semibold text-white mb-2">Description</h4>
          <p className="text-gray-300 text-sm">{event.description}</p>
          {event.full_description && (
            <details className="mt-2">
              <summary className="cursor-pointer text-purple-400 hover:text-purple-300 text-sm">
                View full description
              </summary>
              <p className="text-gray-300 text-sm mt-2">{event.full_description}</p>
            </details>
          )}
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-sm">
              {formatDate(event.date || event.start_date || '', event.time)} {event.end_date && `- ${formatDate(event.end_date)}`}
            </span>
          </div>
          
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-sm">{event.location}</span>
          </div>
          
          {(event.max_capacity || event.max_attendees) && (
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm">Max {event.max_capacity || event.max_attendees} attendees</span>
            </div>
          )}
          
          {event.event_type && (
            <div className="flex items-center text-gray-300">
              <Globe className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm capitalize">{event.event_type.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        {/* Organizer Information */}
        <div className="border-t border-gray-700 pt-4">
          <h4 className="font-semibold text-white mb-3">Organizer Information</h4>
          <div className="space-y-2">
            {event.organizer_name && (
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm">{event.organizer_name}</span>
              </div>
            )}
            
            {event.organizer_email && (
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm">{event.organizer_email}</span>
              </div>
            )}
            
            {event.organizer_phone && (
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm">{event.organizer_phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        {event.venue_details && (
          <div>
            <h4 className="font-semibold text-white mb-2">Venue Details</h4>
            <p className="text-gray-300 text-sm">{event.venue_details}</p>
          </div>
        )}
        
        {event.requirements && (
          <div>
            <h4 className="font-semibold text-white mb-2">Requirements</h4>
            <p className="text-gray-300 text-sm">{event.requirements}</p>
          </div>
        )}
        
        {event.what_to_bring && (
          <div>
            <h4 className="font-semibold text-white mb-2">What to Bring</h4>
            <p className="text-gray-300 text-sm">{event.what_to_bring}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => handleApproval('reject')}
          disabled={isProcessing}
          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <>
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </>
          )}
        </Button>
        
        <Button
          onClick={() => handleApproval('approve')}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}