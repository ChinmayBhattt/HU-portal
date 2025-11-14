import { HeroSection } from '@/components/home/hero-section'
import { UpcomingEvents } from '@/components/home/upcoming-events'
import { generateSEO } from '@/lib/seo/seo-config'
import { Metadata } from 'next'
import { StructuredData } from '@/components/seo/structured-data'

export const metadata: Metadata = generateSEO({
  title: 'Home',
  description: 'Join India\'s fastest growing hacker community. Create, discover, and attend amazing tech events, workshops, and hackathons.',
  url: '/',
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <StructuredData type="website" data={{}} />
      <StructuredData type="organization" data={{}} />
      <HeroSection />
      <UpcomingEvents />
    </div>
  )
}
