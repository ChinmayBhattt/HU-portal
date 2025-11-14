"use client"

import { BlogPostCard } from '@/components/blog/blog-post-card'
import { BlogSidebar } from '@/components/blog/blog-sidebar'
import { motion, Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  author_id: string
  author_name: string
  author_avatar?: string
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
  tags: string[]
  category: string
  read_time: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient()
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      
      if (data) {
        setPosts(data as BlogPost[])
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

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
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 mb-6">
              <span className="text-purple-400 text-sm font-medium">Blog</span>
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-white mb-6">
            Insights from the
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {' '}Tech Community
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest trends, tutorials, event recaps, and insights from India's vibrant tech community.
          </motion.p>
        </div>
      </motion.section>

      {/* Blog Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {posts && posts.length > 0 ? (
                  posts.map((post, index) => (
                    <motion.div key={post.id} variants={itemVariants}>
                      <BlogPostCard post={post} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-lg mb-4">
                      No blog posts available yet.
                    </div>
                    <p className="text-gray-500">
                      Check back soon for the latest updates from our community!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar posts={posts || []} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}