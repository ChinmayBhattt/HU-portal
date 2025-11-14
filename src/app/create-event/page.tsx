import { SimplePublicEventForm } from '@/components/dashboard/simple-public-event-form'

export default function PublicCreateEventPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Create New Event</h1>
            <p className="text-gray-300 text-lg">Organize your next amazing tech event</p>
            <p className="text-gray-400 text-sm mt-2">Your event will be reviewed and published after approval</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
            <SimplePublicEventForm />
          </div>
        </div>
      </div>
    </div>
  )
}