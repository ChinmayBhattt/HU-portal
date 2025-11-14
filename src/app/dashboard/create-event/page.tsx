import { CreateEventForm } from '@/components/dashboard/create-event-form'

export default function CreateEventPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
        <p className="text-gray-400">Organize your next amazing tech event</p>
      </div>

      <div className="max-w-4xl">
        <CreateEventForm />
      </div>
    </div>
  )
}