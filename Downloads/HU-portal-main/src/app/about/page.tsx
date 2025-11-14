"use client"

import { motion, Variants } from 'framer-motion'
import { Users, Target, Zap, Globe, Heart, Star } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To unite hackers, developers, and tech enthusiasts across India, fostering innovation, collaboration, and continuous learning in the rapidly evolving tech landscape."
    },
    {
      icon: Users,
      title: "Our Community",
      description: "A vibrant ecosystem of 10,000+ members including students, professionals, and industry experts who share knowledge, build projects, and grow together."
    },
    {
      icon: Zap,
      title: "Our Impact",
      description: "Organized 50+ successful events, hackathons, and workshops, empowering thousands of developers with cutting-edge skills and industry connections."
    },
    {
      icon: Globe,
      title: "Our Vision",
      description: "To become India's largest and most influential hacker community, driving technological innovation and creating opportunities for developers nationwide."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Community Members" },
    { number: "50+", label: "Events Organized" },
    { number: "100+", label: "Projects Built" },
    { number: "25+", label: "Partner Companies" }
  ]

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
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 mb-6">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">About Hackers Unity</span>
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-white mb-6">
            Uniting India's
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {' '}Hacker Community
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Hackers Unity is India's premier tech community platform where developers, hackers, and tech enthusiasts come together to learn, build, and innovate. We believe in the power of community-driven learning and collaborative problem-solving.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-white">Community Driven</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white">Innovation Focused</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-white">Nationwide Reach</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our core values drive everything we do and shape the community we're building together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join the Movement?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Become part of India's fastest growing hacker community. Learn, build, and innovate with thousands of like-minded developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Join Community
              </button>
              <button className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300">
                Browse Events
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}