"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Theme, ThemeConfig } from "@/types/theme"

interface ThemeContextType {
  theme: Theme | null
}

const ThemeContext = React.createContext<ThemeContextType>({ theme: null })

interface ThemeProviderProps {
  children: React.ReactNode
  initialTheme?: Theme | null
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme | null>(initialTheme || null)
  const pathname = usePathname()

  // Sync state when prop changes (Crucial for real-time updates)
  React.useEffect(() => {
    setTheme(initialTheme || null)
  }, [initialTheme])

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

        // Apply colors
        Object.entries(config.colors).forEach(([key, value]) => {
          // Map seed keys to CSS variable names
          const varName = key === 'mutedForeground' ? 'muted-foreground' : 
                          key === 'primaryForeground' ? 'primary-foreground' :
                          key === 'secondaryForeground' ? 'secondary-foreground' :
                          key === 'accentForeground' ? 'accent-foreground' :
                          key === 'destructiveForeground' ? 'destructive-foreground' :
                          key;
          
          root.style.setProperty(`--${varName}`, value)
        })

        // Apply typography
        if (config.typography) {
            root.style.setProperty('--font-sans', config.typography.fontFamily)
        }

      } catch (e) {
        console.error("Failed to parse theme config", e)
      }
    }
  }, [theme, pathname])

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => React.useContext(ThemeContext)
