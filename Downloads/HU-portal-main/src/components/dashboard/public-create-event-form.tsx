'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, Variants } from 'framer-motion'
import { Calendar, MapPin, Users, Upload, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createPublicClient } from '@/lib/supabase/public-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  full_description: z.string().min(50, 'Full description must be at least 50 characters'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  location: z.string().min(2, 'Location is required'),
  location_type: z.enum(['online', 'in_person', 'hybrid']),
  max_attendees: z.number().min(1, 'Maximum attendees must be at least 1'),
  event_type: z.string().min(2, 'Event type is required'),
  category: z.string().min(2, 'Category is required'),
  meeting_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  venue_details: z.string().optional(),
  requirements: z.string().optional(),
  what_to_bring: z.string().optional(),
  organizer_name: z.string().min(2, 'Organizer name is required'),
  organizer_email: z.string().email('Valid email is required'),
  organizer_phone: z.string().optional()
})

type EventFormData = z.infer<typeof eventSchema>

export function PublicCreateEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createPublicClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      location_type: 'online',
      max_attendees: 50,
      category: 'technology',
      event_type: 'workshop'
    }
  })

  const locationType = watch('location_type')

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)

    console.log('Form submission data:', data)
    console.log('Form errors:', errors)

    try {
      let imageUrl = ''

      // Upload image if provided
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Date.now()}.${fileExt}`
          const filePath = `event-images/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('event-images')
            .upload(filePath, imageFile)

          if (uploadError) {
            console.warn('Image upload failed:', uploadError)
            // Continue without image - don't fail the entire submission
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('event-images')
              .getPublicUrl(filePath)

            imageUrl = publicUrl
          }
        } catch (uploadErr) {
          console.warn('Image upload error:', uploadErr)
          // Continue without image
        }
      }

      // Parse the datetime to extract date and time
      const startDateTime = new Date(data.start_date)
      const endDateTime = new Date(data.end_date)
      
      const eventDate = startDateTime.toISOString().split('T')[0] // YYYY-MM-DD format
      const startTime = startDateTime.toTimeString().slice(0, 5) // HH:MM format
      const endTime = endDateTime.toTimeString().slice(0, 5) // HH:MM format

      // Build minimal required data first
      const insertData: any = {
        title: data.title,
        description: data.description,
        category: data.category,
        date: eventDate,
        time: startTime,
        location: data.location,
        event_type: data.location_type, // Map location_type to event_type
        max_capacity: data.max_attendees, // Map max_attendees to max_capacity
        is_published: false, // Always false for public submissions
        organizer_name: data.organizer_name,
        organizer_email: data.organizer_email,
        submission_type: 'public',
        status: 'pending' // Require approval for public submissions
      }

      // Only add optional fields if they have values
      if (data.meeting_url) insertData.meeting_url = data.meeting_url
      if (imageUrl) insertData.banner_url = imageUrl
      if (data.organizer_phone) insertData.organizer_phone = data.organizer_phone

      console.log('Inserting event data:', insertData)

      // Create event with organizer info for unauthenticated users
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert(insertData)
        .select()
        .single()

      if (eventError) {
        throw eventError
      }

      toast.success('Event submitted successfully! It will be reviewed before publishing.')
      router.push('/events')
    } catch (error: any) {
      console.error('Event creation error:', error)
      console.error('Error details:', error.message, error.details, error.hint)
      toast.error(`Failed to create event: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Basic Event Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Basic Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Title *
            </label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Type *
            </label>
            <select
              {...register('event_type')}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="workshop">Workshop</option>
              <option value="hackathon">Hackathon</option>
              <option value="meetup">Meetup</option>
              <option value="conference">Conference</option>
              <option value="webinar">Webinar</option>
            </select>
            {errors.event_type && (
              <p className="text-red-400 text-sm mt-1">{errors.event_type.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Short Description *
          </label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
            placeholder="Brief description of your event"
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Description *
          </label>
          <textarea
            {...register('full_description')}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
            placeholder="Detailed description of your event"
          />
          {errors.full_description && (
            <p className="text-red-400 text-sm mt-1">{errors.full_description.message}</p>
          )}
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Date and Time
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date & Time *
            </label>
            <input
              {...register('start_date')}
              type="datetime-local"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.start_date && (
              <p className="text-red-400 text-sm mt-1">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date & Time *
            </label>
            <input
              {...register('end_date')}
              type="datetime-local"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.end_date && (
              <p className="text-red-400 text-sm mt-1">{errors.end_date.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Location
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location Type *
            </label>
            <select
              {...register('location_type')}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setValue('location_type', e.target.value as any)}
            >
              <option value="online">Online</option>
              <option value="in_person">In Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <input
              {...register('location')}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Event location or platform"
            />
            {errors.location && (
              <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>

        {locationType === 'online' || locationType === 'hybrid' ? (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meeting URL
            </label>
            <input
              {...register('meeting_url')}
              type="url"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://meet.google.com/... or Zoom link"
            />
            {errors.meeting_url && (
              <p className="text-red-400 text-sm mt-1">{errors.meeting_url.message}</p>
            )}
          </div>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Venue Details
          </label>
          <textarea
            {...register('venue_details')}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
            placeholder="Detailed venue information, parking, accessibility, etc."
          />
        </div>
      </div>

      {/* Capacity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Capacity
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Attendees *
            </label>
            <input
              {...register('max_attendees', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="50"
            />
            {errors.max_attendees && (
              <p className="text-red-400 text-sm mt-1">{errors.max_attendees.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizer Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          Organizer Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name *
            </label>
            <input
              {...register('organizer_name')}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your full name"
            />
            {errors.organizer_name && (
              <p className="text-red-400 text-sm mt-1">{errors.organizer_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Email *
            </label>
            <input
              {...register('organizer_email')}
              type="email"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
            />
            {errors.organizer_email && (
              <p className="text-red-400 text-sm mt-1">{errors.organizer_email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number (Optional)
          </label>
          <input
            {...register('organizer_phone')}
            type="tel"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your contact number"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Additional Information
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Requirements
          </label>
          <textarea
            {...register('requirements')}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
            placeholder="What participants need to know or prepare"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What to Bring
          </label>
          <textarea
            {...register('what_to_bring')}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
            placeholder="Laptop, notebook, water bottle, etc."
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Event Image
        </h2>
        
        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {imageFile ? (
              <div className="text-white">
                <p className="font-medium">{imageFile.name}</p>
                <p className="text-sm text-gray-400 mt-1">Click to change image</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-white font-medium">Upload event image</p>
                <p className="text-gray-400 text-sm">Click to select an image</p>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10"
          onClick={() => router.push('/events')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Send className="w-4 h-4 mr-2 animate-pulse" />
              Submitting...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Submit Event
            </>
          )}
        </Button>
      </div>
      
      {/* Debug button for testing */}
      <Button
        type="button"
        onClick={() => {
          const testData = {
            title: 'Test Event',
            description: 'This is a test event',
            full_description: 'This is a detailed description of the test event that is long enough to meet the validation requirements',
            start_date: '2024-12-01T14:00',
            end_date: '2024-12-01T16:00',
            location: 'Online',
            location_type: 'online' as const,
            max_attendees: 50,
            event_type: 'workshop',
            category: 'technology',
            meeting_url: 'https://meet.google.com/test',
            venue_details: '',
            requirements: 'Bring laptop',
            what_to_bring: 'Laptop and notebook',
            organizer_name: 'Test Organizer',
            organizer_email: 'test@example.com',
            organizer_phone: '+1234567890'
          }
          console.log('Testing with data:', testData)
          onSubmit(testData)
        }}
        className="bg-yellow-600 hover:bg-yellow-700 text-white mt-4"
      >
        Test Submit (Debug)
      </Button>
    </motion.form>
  )
}