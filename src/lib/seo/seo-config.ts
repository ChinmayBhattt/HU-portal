import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

const siteConfig = {
  name: 'Hackers Unity',
  title: 'Hackers Unity - Where Hackers Unite to Ignite the Future',
  description: 'Join India\'s fastest growing hacker community. Create, discover, and attend amazing tech events, workshops, and hackathons.',
  keywords: ['hackers', 'tech events', 'hackathons', 'workshops', 'community', 'innovation', 'India', 'developers', 'tech community'],
  url: 'https://hackersunity.in',
  image: 'https://hackersunity.in/og-image.jpg',
  twitter: '@hackersunity',
  locale: 'en_IN',
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const pageDescription = description || siteConfig.description
  const pageImage = image || siteConfig.image
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...keywords, ...siteConfig.keywords],
    authors: author ? [{ name: author }] : undefined,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: siteConfig.locale,
      type,
      publishedTime,
      modifiedTime,
      section,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: siteConfig.twitter,
      site: siteConfig.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-site-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  }
}

export const defaultSEO = generateSEO()