"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Theme, ThemeConfig } from "@/types/theme"

interface ThemeContextType {
  theme: Theme | null
  isDark: boolean
}

const ThemeContext = React.createContext<ThemeContextType>({ theme: null, isDark: false })

interface ThemeProviderProps {
  children: React.ReactNode
  initialTheme?: Theme | null
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme | null>(initialTheme || null)
  const [isDark, setIsDark] = React.useState(false)
  const pathname = usePathname()

  // Sync state when prop changes (Crucial for real-time updates)
  React.useEffect(() => {
    setTheme(initialTheme || null)
  }, [initialTheme])

  // Poll for theme updates to enable real-time changes
  React.useEffect(() => {
    // Skip polling in admin panel
    if (pathname?.startsWith('/admin')) return

    const fetchActiveTheme = async () => {
      try {
        const res = await fetch('/api/active-theme')
        if (!res.ok) return
        
        const activeTheme = await res.json()
        
        setTheme((currentTheme) => {
          if (!currentTheme) return activeTheme
          
          // Check if ID changed
          if (currentTheme.id !== activeTheme.id) return activeTheme
          
          // Check if updated timestamp changed
          const currentUpdated = new Date(currentTheme.updatedAt).getTime()
          const activeUpdated = new Date(activeTheme.updatedAt).getTime()
          
          if (currentUpdated !== activeUpdated) return activeTheme
          
          return currentTheme
        })
      } catch (error) {
        console.error('Failed to poll active theme:', error)
      }
    }

    // Initial fetch
    fetchActiveTheme()

    // Poll every 2 seconds
    const intervalId = setInterval(fetchActiveTheme, 2000)
    
    return () => clearInterval(intervalId)
  }, [pathname])

  React.useEffect(() => {
    const root = document.documentElement

    // If we are in the admin panel, force the default light theme styles
    // so it always looks consistent regardless of the active theme or system preference
    if (pathname?.startsWith('/admin')) {
      const defaultTheme = {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '222.2 84% 4.9%',
        '--primary': '222.2 47.4% 11.2%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '210 40% 96.1%',
        '--secondary-foreground': '222.2 47.4% 11.2%',
        '--muted': '210 40% 96.1%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 96.1%',
        '--accent-foreground': '222.2 47.4% 11.2%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--ring': '222.2 84% 4.9%',
        '--radius': '0.5rem',
      }
      
      Object.entries(defaultTheme).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
      return
    }

    if (theme && theme.config) {
      try {
        const rawConfig = theme.config as unknown
        const config: ThemeConfig = typeof rawConfig === 'string' 
          ? JSON.parse(rawConfig) 
          : rawConfig as ThemeConfig

        // Helper to apply colors
        const applyColors = (colors: ThemeConfig['colors']) => {
          Object.entries(colors).forEach(([key, value]) => {
            const varName = key === 'mutedForeground' ? 'muted-foreground' : 
                            key === 'primaryForeground' ? 'primary-foreground' :
                            key === 'secondaryForeground' ? 'secondary-foreground' :
                            key === 'accentForeground' ? 'accent-foreground' :
                            key === 'destructiveForeground' ? 'destructive-foreground' :
                            key;
            
            root.style.setProperty(`--${varName}`, value)
          })
        }

        // Apply colors based on system preference if darkColors exists
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        const updateTheme = () => {
          setIsDark(mediaQuery.matches)
          if (config.darkColors && mediaQuery.matches) {
            applyColors(config.darkColors)
          } else {
            applyColors(config.colors)
          }
        }

        // Initial apply
        updateTheme()

        // Listen for changes
        mediaQuery.addEventListener('change', updateTheme)

        // Apply typography
        if (config.typography) {
            root.style.setProperty('--font-sans', config.typography.fontFamily)
        }
        
        return () => mediaQuery.removeEventListener('change', updateTheme)

      } catch (e) {
        console.error("Failed to parse theme config", e)
      }
    }
  }, [theme, pathname])

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => React.useContext(ThemeContext)
