import { motion, Variants } from 'framer-motion'

interface DashboardStatsProps {
  totalEvents: number
  totalRegistrations: number
  upcomingEvents: number
  pastEvents: number
}

export function DashboardStats({ totalEvents, totalRegistrations, upcomingEvents, pastEvents }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Events',
      value: totalEvents,
      color: 'from-purple-500 to-blue-500',
      icon: '📅'
    },
    {
      label: 'Total Registrations',
      value: totalRegistrations,
      color: 'from-green-500 to-emerald-500',
      icon: '👥'
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents,
      color: 'from-orange-500 to-red-500',
      icon: '🚀'
    },
    {
      label: 'Past Events',
      value: pastEvents,
      color: 'from-gray-500 to-gray-600',
      icon: '✅'
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="text-right">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                className="text-3xl font-bold text-white"
              >
                {stat.value}
              </motion.div>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}