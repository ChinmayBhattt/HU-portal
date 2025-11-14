import { Search, Calendar, Tag, TrendingUp } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { format } from 'date-fns'

interface BlogSidebarProps {
  posts: Array<{
    id: string
    title: string
    slug: string
    category: string
    tags: string[]
    published_at: string
    created_at: string
  }>
}

export function BlogSidebar({ posts }: BlogSidebarProps) {
  // Get unique categories and tags
  const categories = [...new Set(posts.map(post => post.category))]
  const allTags = posts.flatMap(post => post.tags || [])
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const popularTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)

  const recentPosts = posts
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
    .slice(0, 5)

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.aside
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Search */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2 text-purple-400" />
          Search Posts
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search blog posts..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </motion.div>

      {/* Categories */}
      {categories.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 capitalize"
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-purple-400" />
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(([tag, count]) => (
              <button
                key={tag}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-sm rounded-full border border-white/20 transition-colors duration-200"
              >
                {tag}
                <span className="ml-1 text-xs text-gray-400">({count})</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Recent Posts
          </h3>
          <div className="space-y-4">
            {recentPosts.map((post) => {
              const publishedDate = new Date(post.published_at || post.created_at)
              return (
                <div key={post.id} className="group">
                  <a
                    href={`/blog/${post.slug}`}
                    className="block text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <h4 className="font-medium text-sm mb-1 group-hover:text-purple-300 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{format(publishedDate, 'MMM d, yyyy')}</span>
                    </div>
                  </a>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.aside>
  )
}