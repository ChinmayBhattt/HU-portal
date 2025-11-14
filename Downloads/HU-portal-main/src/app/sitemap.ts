import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Get all published events
  const { data: events } = await supabase
    .from('events')
    .select('id, updated_at')
    .eq('is_published', true)

  // Get all published blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('is_published', true)

  const currentDate = new Date()

  // Static pages
  const staticPages = [
    {
      url: 'https://hackersunity.in',
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://hackersunity.in/events',
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://hackersunity.in/blog',
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://hackersunity.in/about',
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://hackersunity.in/contact',
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://hackersunity.in/community-guidelines',
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Dynamic event pages
  const eventPages = events?.map((event) => ({
    url: `https://hackersunity.in/events/${event.id}`,
    lastModified: new Date(event.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // Dynamic blog post pages
  const blogPages = blogPosts?.map((post) => ({
    url: `https://hackersunity.in/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [...staticPages, ...eventPages, ...blogPages]
}