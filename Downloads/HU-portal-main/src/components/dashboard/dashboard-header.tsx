import { UserNav } from '@/components/dashboard/user-nav'

export function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Hackers Unity
          </h1>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Organizer Dashboard</span>
        </div>
        <UserNav />
      </div>
    </header>
  )
}