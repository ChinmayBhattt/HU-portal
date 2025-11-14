'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HackersUnityLogo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { Calendar, Users, Plus, User, LogOut, Info, MessageCircle, BookOpen, FileText, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/discover', label: 'Discover', icon: Users },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: MessageCircle },
    { href: '/community-guidelines', label: 'Guidelines', icon: FileText },
  ]

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <HackersUnityLogo variant="icon" />
              <span className="text-white font-semibold">Hackers Unity</span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/create-event">
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/create-event">
                    <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/20 backdrop-blur-md">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      href="/create-event"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Event</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/create-event"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Event</span>
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}