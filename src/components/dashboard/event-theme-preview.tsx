'use client'

import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'
import { EventTheme } from './event-theme-selector'

interface EventThemePreviewProps {
  formData: {
    title: string
    description: string
    date: string
    time: string
    location: string
  }
  theme: EventTheme
}

export function EventThemePreview({ formData, theme }: EventThemePreviewProps) {
  const eventDate = formData.date ? new Date(formData.date) : new Date()
  const isUpcoming = eventDate >= new Date()

  const getThemeBackground = () => {
    switch (theme.id) {
      case 'minimal':
        return 'bg-gradient-to-br from-gray-100 to-gray-200'
      case 'quantum':
        return 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
      case 'warp':
        return 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500'
      case 'emoji':
        return 'bg-gradient-to-br from-green-400 to-blue-500'
      case 'confetti':
        return 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
      case 'pattern':
        return 'bg-gradient-to-br from-slate-800 via-gray-900 to-black'
      default:
        return 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
    }
  }

  const getTextColor = () => {
    return theme.colors.text === '#ffffff' ? 'text-white' : 'text-gray-900'
  }

  const getCardBackground = () => {
    return theme.colors.background === '#ffffff' ? 'bg-white' : 'bg-gray-900'
  }

  const getPrimaryColor = () => {
    return `text-[${theme.colors.primary}]`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Preview</h3>
        <div className="text-xs text-gray-400">
          {theme.name} Theme
        </div>
      </div>

      {/* Event Card Preview */}
      <div className={`rounded-xl overflow-hidden border-2 border-white/20 ${getCardBackground()} shadow-2xl`}>
        {/* Header with Theme Background */}
        <div className={`h-32 ${getThemeBackground()} flex items-center justify-center relative`}>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getTextColor()}`}>
              {format(eventDate, 'dd')}
            </div>
            <div className={`text-lg ${getTextColor()}`}>
              {format(eventDate, 'MMM')}
            </div>
          </div>
          
          {/* Event Type Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm border border-white/30">
              Online
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6">
          <h3 className={`text-xl font-bold mb-2 ${getTextColor()}`}>
            {formData.title || 'Your Event Title'}
          </h3>
          
          <p className={`text-sm mb-4 line-clamp-2 ${getTextColor()} opacity-80`}>
            {formData.description || 'Your event description will appear here...'}
          </p>

          <div className={`space-y-2 text-sm ${getTextColor()}`}>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 opacity-70" />
              <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 opacity-70" />
              <span>{formData.time || '12:00 PM'}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 opacity-70" />
              <span>{formData.location || 'Event Location'}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className={`flex items-center text-sm ${getTextColor()} opacity-70`}>
              <Users className="w-4 h-4 mr-1" />
              <span>0 registered</span>
            </div>
            
            <span className={`text-sm font-medium ${getPrimaryColor()}`}>
              View Details →
            </span>
          </div>
        </div>
      </div>

      {/* Theme Info */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Theme: {theme.name}</span>
          <span>Style: {theme.style}</span>
          <span>Font: {theme.font}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: theme.colors.secondary }}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: theme.colors.accent }}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: theme.colors.background }}
          />
        </div>
      </div>
    </div>
  )
}