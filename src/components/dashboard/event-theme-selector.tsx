'use client'

import { useState } from 'react'
import { Palette, Type, Sparkles, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EventTheme {
  id: string
  name: string
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  font: string
  style: 'minimal' | 'gradient' | 'pattern' | 'emoji' | 'confetti'
}

export const themes: EventTheme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-200',
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#111827'
    },
    font: 'font-sans',
    style: 'minimal'
  },
  {
    id: 'quantum',
    name: 'Quantum',
    preview: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
    colors: {
      primary: '#8b5cf6',
      secondary: '#3b82f6',
      accent: '#06b6d4',
      background: '#0f172a',
      text: '#ffffff'
    },
    font: 'font-sans',
    style: 'gradient'
  },
  {
    id: 'warp',
    name: 'Warp',
    preview: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500',
    colors: {
      primary: '#ec4899',
      secondary: '#ef4444',
      accent: '#f59e0b',
      background: '#1f2937',
      text: '#ffffff'
    },
    font: 'font-bold',
    style: 'gradient'
  },
  {
    id: 'emoji',
    name: 'Emoji',
    preview: 'bg-gradient-to-br from-green-400 to-blue-500',
    colors: {
      primary: '#10b981',
      secondary: '#3b82f6',
      accent: '#f59e0b',
      background: '#f9fafb',
      text: '#1f2937'
    },
    font: 'font-sans',
    style: 'emoji'
  },
  {
    id: 'confetti',
    name: 'Confetti',
    preview: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      accent: '#f97316',
      background: '#fef7ff',
      text: '#1f2937'
    },
    font: 'font-sans',
    style: 'confetti'
  },
  {
    id: 'pattern',
    name: 'Pattern',
    preview: 'bg-gradient-to-br from-slate-800 via-gray-900 to-black',
    colors: {
      primary: '#64748b',
      secondary: '#94a3b8',
      accent: '#f1f5f9',
      background: '#0f172a',
      text: '#f8fafc'
    },
    font: 'font-mono',
    style: 'pattern'
  }
]

interface EventThemeSelectorProps {
  selectedTheme: EventTheme
  onThemeChange: (theme: EventTheme) => void
}

export function EventThemeSelector({ selectedTheme, onThemeChange }: EventThemeSelectorProps) {
  const [showThemePanel, setShowThemePanel] = useState(false)

  const getThemeIcon = (style: string) => {
    switch (style) {
      case 'minimal':
        return <Type className="w-4 h-4" />
      case 'gradient':
        return <Sparkles className="w-4 h-4" />
      case 'pattern':
        return <ImageIcon className="w-4 h-4" />
      default:
        return <Palette className="w-4 h-4" />
    }
  }

  return (
    <div className="relative">
      {/* Theme Selector Button */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowThemePanel(!showThemePanel)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
        >
          <Palette className="w-4 h-4" />
          <span className="text-sm font-medium">Theme</span>
          <span className="text-xs text-gray-300">{selectedTheme.name}</span>
          <svg
            className={cn("w-4 h-4 transition-transform", showThemePanel && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Color Preview */}
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: selectedTheme.colors.primary }}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: selectedTheme.colors.secondary }}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/30"
            style={{ backgroundColor: selectedTheme.colors.accent }}
          />
        </div>
      </div>

      {/* Theme Panel */}
      {showThemePanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl z-50">
          {/* Theme Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme)
                  setShowThemePanel(false)
                }}
                className={cn(
                  "relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                  selectedTheme.id === theme.id
                    ? "border-purple-500 ring-2 ring-purple-500/50"
                    : "border-gray-600 hover:border-gray-500"
                )}
              >
                <div className={cn("w-full h-12 rounded-md mb-2", theme.preview)} />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white font-medium">{theme.name}</span>
                  {getThemeIcon(theme.style)}
                </div>
              </button>
            ))}
          </div>

          {/* Theme Controls */}
          <div className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <div className="flex items-center gap-2 px-2 py-1 bg-gray-800 rounded-lg">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedTheme.colors.primary }}
                  />
                  <span className="text-xs text-gray-300">Custom</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Font</label>
                <select className="w-full px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg border border-gray-600">
                  <option>Nunito</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}