'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { EventThemeSelector, EventTheme, themes } from './event-theme-selector'
import { EventThemePreview } from './event-theme-preview'

export function SimplePublicEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState<EventTheme>(themes[1]) // Default to Quantum theme
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer_name: '',
    organizer_email: '',
    organizer_phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('Submitting simple form:', formData)
      console.log('Environment variables available:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      })
      
      // Create a simple event object with theme data
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: 'technology', // Default category
        date: formData.date,
        time: formData.time,
        location: formData.location,
        event_type: 'online', // Default type
        max_capacity: 50, // Default capacity
        is_published: false,
        organizer_name: formData.organizer_name,
        organizer_email: formData.organizer_email,
        organizer_phone: formData.organizer_phone,
        submission_type: 'public',
        status: 'pending',
        theme_id: selectedTheme.id,
        theme_name: selectedTheme.name,
        theme_colors: selectedTheme.colors,
        theme_font: selectedTheme.font,
        theme_style: selectedTheme.style
      }

      console.log('Event data to insert:', eventData)

      // Use direct fetch to Supabase REST API
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(eventData)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('Submission error:', errorData)
        throw new Error(`Failed to submit event: ${response.status} ${response.statusText}`)
      }

      // Check if response has content before trying to parse JSON
      const responseText = await response.text()
      let result = null
      if (responseText && responseText.trim()) {
        try {
          result = JSON.parse(responseText)
          console.log('Submission success:', result)
        } catch {
          console.log('Response was not JSON, but submission was successful:', responseText)
        }
      } else {
        console.log('Submission successful with empty response')
      }
      
      toast.success('Event submitted successfully! It will be reviewed before publishing.')
      
      // Show success state with navigation option
      setShowSuccess(true)
      
      // Show additional message about viewing the event
      setTimeout(() => {
        toast.info('You can view your submitted event on the Events page while it\'s under review.')
      }, 3000)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        organizer_name: '',
        organizer_email: '',
        organizer_phone: ''
      })
      
    } catch (error) {
      console.error('Form submission error:', error)
      if (error instanceof Error && error.message.includes('Failed to submit event')) {
        toast.error('Failed to submit event. Please check your connection and try again.')
      } else if (error instanceof Error) {
        toast.error(`Failed to submit event: ${error.message}`)
      } else {
        toast.error('Failed to submit event. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create Public Event</h2>
            <EventThemeSelector 
              selectedTheme={selectedTheme} 
              onThemeChange={setSelectedTheme}
            />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                placeholder="Describe your event"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Event location or online link"
                required
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Organizer Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="organizer_name"
                    value={formData.organizer_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="organizer_email"
                    value={formData.organizer_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="organizer_phone"
                    value={formData.organizer_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2 inline" />
                  Submit Event for Review
                </>
              )}
            </Button>

            <p className="text-gray-400 text-sm text-center">
              Your event will be reviewed by our team before being published.
            </p>

            {/* Success Message */}
            {showSuccess && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <h4 className="text-green-400 font-semibold">Event Submitted Successfully!</h4>
                </div>
                <p className="text-green-300 text-sm mb-3">
                  Your event is now under review and will be published after approval.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push('/events')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    View Events
                  </Button>
                  <Button
                    onClick={() => setShowSuccess(false)}
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-sm py-2 px-4 rounded-lg"
                  >
                    Submit Another Event
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Column - Preview */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <EventThemePreview 
            formData={formData} 
            theme={selectedTheme}
          />
        </div>
      </div>
    </div>
  )
}