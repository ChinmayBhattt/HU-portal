'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, UserCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const menuItems = [
    {
      icon: UserCircle,
      label: 'Profile',
      href: '/profile',
      onClick: () => router.push('/profile')
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
      onClick: () => router.push('/dashboard/settings')
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      onClick: handleSignOut,
      className: 'text-red-400 hover:text-red-300'
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-medium">
          {user?.email?.split('@')[0] || 'User'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-full mt-2 w-48 bg-gray-800 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl z-50"
            >
              <div className="p-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      item.onClick()
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-white/10 transition-colors duration-200 ${
                      item.className || 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}