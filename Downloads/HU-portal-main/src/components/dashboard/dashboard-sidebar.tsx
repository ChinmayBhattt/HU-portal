'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Plus, Users, BarChart3, Settings, Home, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardSidebarProps {
  isOrganizer?: boolean
}

const sidebarItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/events', icon: Calendar, label: 'My Events' },
  { href: '/dashboard/create-event', icon: Plus, label: 'Create Event' },
  { href: '/dashboard/registrations', icon: Users, label: 'Registrations' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

const organizerItems = [
  { href: '/admin/events', icon: Shield, label: 'Review Submissions' },
]

export function DashboardSidebar({ isOrganizer }: DashboardSidebarProps) {
  const pathname = usePathname()

  const allItems = isOrganizer ? [...sidebarItems, ...organizerItems] : sidebarItems

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-gray-800/50 backdrop-blur-sm border-r border-white/10">
      <nav className="p-6">
        <ul className="space-y-2">
          {allItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <motion.li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}