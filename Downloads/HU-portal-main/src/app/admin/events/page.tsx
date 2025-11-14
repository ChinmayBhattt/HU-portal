import { createClient } from '@/lib/supabase/server'
import { EventApprovalCard } from '@/components/admin/event-approval-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, CheckCircle, XCircle } from 'lucide-react'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  
  // Get pending events (public submissions)
  const { data: pendingEvents } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'pending')
    .eq('submission_type', 'public')
    .order('created_at', { ascending: false })

  // Get approved/rejected events for history
  const { data: processedEvents } = await supabase
    .from('events')
    .select('*')
    .in('status', ['approved', 'rejected'])
    .eq('submission_type', 'public')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-3xl font-bold text-white">Event Submissions</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-gray-400">Review and approve public event submissions</p>
        </div>

        {/* Pending Events */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
            Pending Review ({pendingEvents?.length || 0})
          </h2>
          
          {pendingEvents && pendingEvents.length > 0 ? (
            <div className="grid gap-6">
              {pendingEvents.map((event) => (
                <EventApprovalCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No pending event submissions</p>
            </div>
          )}
        </div>

        {/* Processed Events History */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            Recent History
          </h2>
          
          {processedEvents && processedEvents.length > 0 ? (
            <div className="grid gap-4">
              {processedEvents.map((event) => (
                <div key={event.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{event.title}</h3>
                    <p className="text-gray-400 text-sm">by {event.organizer_name} • {event.organizer_email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.status === 'approved' ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Approved</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400">
                        <XCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Rejected</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No processed submissions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}