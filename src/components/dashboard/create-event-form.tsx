'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, Variants } from 'framer-motion'
import { Calendar, MapPin, Users, Upload, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
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
  is_published: z.boolean()
})

type EventFormData = z.infer<typeof eventSchema>

export function CreateEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClient()

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
      event_type: 'workshop',
      is_published: false
    }
  })

  const locationType = watch('location_type')

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)

    try {
      let imageUrl = ''

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `event-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // Create event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          ...data,
          image_url: imageUrl,
          organizer_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      if (eventError) {
        throw eventError
      }

      toast.success(data.is_published ? 'Event published successfully!' : 'Event saved as draft!')
      router.push(`/dashboard/events/${event.id}`)

    } catch (error) {
      console.error('Event creation error:', error)
      toast.error('Failed to create event. Please try again.')
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Title *
              </label>
              <input
                {...register('title')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Detailed description of your event"
              />
              {errors.full_description && (
                <p className="text-red-400 text-sm mt-1">{errors.full_description.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Event Details */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-white mb-6">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date & Time *
              </label>
              <input
                {...register('start_date')}
                type="datetime-local"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.end_date && (
                <p className="text-red-400 text-sm mt-1">{errors.end_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <input
                {...register('location')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Event location"
              />
              {errors.location && (
                <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location Type *
              </label>
              <select
                {...register('location_type')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="online">Online</option>
                <option value="in_person">In Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {errors.location_type && (
                <p className="text-red-400 text-sm mt-1">{errors.location_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Attendees *
              </label>
              <input
                {...register('max_attendees', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="50"
              />
              {errors.max_attendees && (
                <p className="text-red-400 text-sm mt-1">{errors.max_attendees.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Type *
              </label>
              <select
                {...register('event_type')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="workshop">Workshop</option>
                <option value="hackathon">Hackathon</option>
                <option value="meetup">Meetup</option>
                <option value="conference">Conference</option>
                <option value="webinar">Webinar</option>
                <option value="panel">Panel Discussion</option>
              </select>
              {errors.event_type && (
                <p className="text-red-400 text-sm mt-1">{errors.event_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            {locationType === 'online' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meeting URL
                </label>
                <input
                  {...register('meeting_url')}
                  type="url"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://meet.google.com/..."
                />
                {errors.meeting_url && (
                  <p className="text-red-400 text-sm mt-1">{errors.meeting_url.message}</p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-white mb-6">Additional Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Venue Details
              </label>
              <textarea
                {...register('venue_details')}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Detailed venue information, directions, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requirements
              </label>
              <textarea
                {...register('requirements')}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Any requirements for attendees"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What to Bring
              </label>
              <textarea
                {...register('what_to_bring')}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Items attendees should bring"
              />
            </div>
          </div>
        </motion.div>

        {/* Event Image */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-white mb-6">Event Image</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Event Image
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/30 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block mt-3 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Choose File
                </label>
              </div>
              {imageFile && (
                <p className="text-green-400 text-sm mt-2">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex items-center space-x-4 pt-6 border-t border-white/10">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => {
              setValue('is_published', true)
              handleSubmit(onSubmit)()
            }}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <>
              <Send className="w-4 h-4 mr-2" />
              Publish Event
            </>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}