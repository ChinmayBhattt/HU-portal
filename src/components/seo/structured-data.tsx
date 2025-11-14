import { Event } from '@/lib/supabase/types'

interface StructuredDataProps {
  type: 'website' | 'organization' | 'event' | 'article'
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData: any = {}

  switch (type) {
    case 'website':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Hackers Unity',
        url: 'https://hackersunity.in',
        description: 'India\'s fastest growing hacker community platform',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://hackersunity.in/events?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }
      break

    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Hackers Unity',
        url: 'https://hackersunity.in',
        logo: 'https://hackersunity.in/logo.png',
        description: 'India\'s premier tech community platform',
        sameAs: [
          'https://twitter.com/hackersunity',
          'https://linkedin.com/company/hackers-unity',
          'https://github.com/hackers-unity',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-98765-43210',
          contactType: 'customer service',
          email: 'hello@hackersunity.in',
        },
      }
      break

    case 'event':
      const event = data as Event
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: event.description,
        startDate: event.date,
        endDate: event.date,
        location: {
          '@type': 'Place',
          name: event.location,
          address: event.location,
        },
        image: event.banner_url,
        url: `https://hackersunity.in/events/${event.id}`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: event.event_type === 'online' 
          ? 'https://schema.org/OnlineEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
        organizer: {
          '@type': 'Organization',
          name: 'Hackers Unity',
          url: 'https://hackersunity.in',
        },
        offers: {
          '@type': 'Offer',
          url: `https://hackersunity.in/events/${event.id}`,
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          validFrom: event.created_at,
        },
      }
      break

    case 'article':
      const article = data
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        author: {
          '@type': 'Person',
          name: article.author_name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Hackers Unity',
          logo: {
            '@type': 'ImageObject',
            url: 'https://hackersunity.in/logo.png',
          },
        },
        datePublished: article.published_at || article.created_at,
        dateModified: article.updated_at,
        image: article.featured_image,
        url: `https://hackersunity.in/blog/${article.slug}`,
      }
      break
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}