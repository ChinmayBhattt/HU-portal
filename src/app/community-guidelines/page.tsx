"use client"

import { motion, Variants } from 'framer-motion'
import { Shield, Heart, Users, Lightbulb, Handshake, Star } from 'lucide-react'

export default function CommunityGuidelinesPage() {
  const principles = [
    {
      icon: Shield,
      title: "Be Respectful",
      description: "Treat all community members with respect and courtesy. We welcome hackers from all backgrounds, skill levels, and experiences."
    },
    {
      icon: Heart,
      title: "Be Inclusive",
      description: "Create an inclusive environment where everyone feels welcome to learn, share, and contribute regardless of their background."
    },
    {
      icon: Users,
      title: "Collaborate",
      description: "Foster collaboration over competition. Help others learn and grow by sharing knowledge and providing constructive feedback."
    },
    {
      icon: Lightbulb,
      title: "Innovate",
      description: "Encourage creative problem-solving and innovative thinking. Support experimentation and learning from failures."
    },
    {
      icon: Handshake,
      title: "Be Honest",
      description: "Maintain integrity in your work and interactions. Give credit where it's due and be transparent about your contributions."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Strive for excellence in everything you do. Continuously improve your skills and help elevate the community's standards."
    }
  ]

  const guidelines = [
    {
      category: "Event Participation",
      items: [
        "Register only if you genuinely plan to attend events",
        "Arrive on time and respect the schedule",
        "Participate actively in discussions and activities",
        "Follow the event's specific rules and requirements",
        "Be respectful to speakers, organizers, and fellow attendees"
      ]
    },
    {
      category: "Content & Projects",
      items: [
        "Share original work and give proper attribution",
        "Respect intellectual property rights",
        "Provide constructive feedback on others' projects",
        "Document your code and projects clearly",
        "Help others understand complex concepts patiently"
      ]
    },
    {
      category: "Communication",
      items: [
        "Use welcoming and inclusive language",
        "Be respectful of differing viewpoints and experiences",
        "Gracefully accept constructive criticism",
        "Focus on what is best for the community",
        "Show empathy towards other community members"
      ]
    },
    {
      category: "Safety & Security",
      items: [
        "Report any harassment or inappropriate behavior",
        "Keep discussions and projects legal and ethical",
        "Respect others' privacy and personal information",
        "Use secure coding practices in shared projects",
        "Help maintain a safe environment for everyone"
      ]
    }
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
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Community Guidelines</span>
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-white mb-6">
            Building a
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {' '}Positive Community
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            These guidelines help us maintain a welcoming, inclusive, and productive environment for all members of the Hackers Unity community.
          </motion.p>
        </div>
      </motion.section>

      {/* Core Principles */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Principles
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              These principles guide our community interactions and help us create an environment where everyone can thrive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <principle.icon className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 text-center group-hover:text-purple-300 transition-colors">
                  {principle.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-center">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Detailed Guidelines */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Community Guidelines
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Specific guidelines for different aspects of community participation and engagement.
            </p>
          </motion.div>

          <div className="space-y-12">
            {guidelines.map((section, index) => (
              <motion.div
                key={section.category}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-semibold text-white mb-6">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enforcement & Reporting */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Enforcement & Reporting
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              How we maintain community standards and handle violations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Reporting Issues
              </h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  If you witness or experience behavior that violates our community guidelines, please report it to our moderation team.
                </p>
                <div className="space-y-2">
                  <p>• Email us at <span className="text-purple-400">report@hackersunity.in</span></p>
                  <p>• Use the report feature in our platform</p>
                  <p>• Contact any organizer or moderator directly</p>
                </div>
                <p>
                  All reports are confidential and will be handled promptly and professionally.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Enforcement Actions
              </h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Depending on the severity and frequency of violations, we may take the following actions:
                </p>
                <div className="space-y-2">
                  <p>• Warning or temporary suspension</p>
                  <p>• Removal from specific events or discussions</p>
                  <p>• Permanent ban from the community</p>
                  <p>• Reporting to authorities if necessary</p>
                </div>
                <p>
                  We always aim to educate first, but serious violations may result in immediate removal.
                </p>
              </div>
            </motion.div>
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
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              By joining Hackers Unity, you agree to uphold these community guidelines and help us create an amazing environment for everyone.
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