'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search, X } from 'lucide-react'
import { useState } from 'react'

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'conference', label: 'Conference' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'networking', label: 'Networking' },
]

const eventTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'In-Person' },
  { value: 'hybrid', label: 'Hybrid' },
]

const dateRanges = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
]

interface EventFiltersProps {
  searchParams: {
    category?: string
    date?: string
    location?: string
    type?: string
  }
}

export function EventFilters({ searchParams }: EventFiltersProps) {
  const router = useRouter()
  const searchParamsHook = useSearchParams()
  
  const [category, setCategory] = useState(searchParams.category || 'all')
  const [dateRange, setDateRange] = useState(searchParams.date || 'all')
  const [eventType, setEventType] = useState(searchParams.type || 'all')
  const [location, setLocation] = useState(searchParams.location || '')

  const applyFilters = () => {
    const params = new URLSearchParams(searchParamsHook.toString())
    
    if (category !== 'all') params.set('category', category)
    else params.delete('category')
    
    if (dateRange !== 'all') params.set('date', dateRange)
    else params.delete('date')
    
    if (eventType !== 'all') params.set('type', eventType)
    else params.delete('type')
    
    if (location) params.set('location', location)
    else params.delete('location')
    
    router.push(`/events?${params.toString()}`)
  }

  const clearFilters = () => {
    setCategory('all')
    setDateRange('all')
    setEventType('all')
    setLocation('')
    router.push('/events')
  }

  const hasActiveFilters = category !== 'all' || dateRange !== 'all' || eventType !== 'all' || location

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-gray-600">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date Range
          </label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {dateRanges.map((range) => (
                <SelectItem key={range.value} value={range.value} className="text-white hover:bg-gray-600">
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Type
          </label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-600">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white pl-10"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={applyFilters}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}