import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Calendar, User, Clock, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

interface BlogPostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    author_id: string
    author_name: string
    author_avatar?: string
    featured_image?: string
    tags: string[]
    category: string
    is_published: boolean
    published_at: string
    created_at: string
    updated_at: string
    read_time: number
  }
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const publishedDate = new Date(post.published_at || post.created_at)

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      {/* Featured Image */}
      {post.featured_image && (
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      <div className="p-8">
        {/* Category and Tags */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30">
            {post.category}
          </span>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>{post.read_time} min read</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author and Date */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <p className="text-white font-medium">{post.author_name}</p>
              <p className="text-gray-400 text-sm">
                <Calendar className="w-3 h-3 inline mr-1" />
                {format(publishedDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md border border-white/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  )
}