import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Plus, Calendar, Users, BarChart3, Settings, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  const actions = [
    {
      href: '/dashboard/create-event',
      icon: Plus,
      title: 'Create Event',
      description: 'Start organizing your next amazing event',
      color: 'from-purple-600 to-blue-600'
    },
    {
      href: '/dashboard/registrations',
      icon: Users,
      title: 'View Registrations',
      description: 'Manage attendee registrations',
      color: 'from-green-600 to-emerald-600'
    },
    {
      href: '/dashboard/analytics',
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track event performance',
      color: 'from-orange-600 to-red-600'
    },
    {
      href: '/dashboard/settings',
      icon: Settings,
      title: 'Settings',
      description: 'Configure your organizer profile',
      color: 'from-gray-600 to-gray-700'
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
      
      <div className="space-y-4">
        {actions.map((action) => (
          <motion.div key={action.href} variants={itemVariants}>
            <Link
              href={action.href}
              className="block p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-br ${action.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {action.description}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <Link href="/dashboard/create-event">
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}