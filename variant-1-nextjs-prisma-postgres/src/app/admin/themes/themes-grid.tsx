"use client"

import { useState } from "react"
import { Theme } from "@prisma/client"
import { ThemeConfig } from "@/types/theme"
import { ThemeCard, ThemePreview } from "./theme-card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useFormStatus } from "react-dom"
import { motion, AnimatePresence, Variants } from "framer-motion"

interface ThemesGridProps {
  themes: Theme[]
  activateAction: (formData: FormData) => Promise<void>
}

export function ThemesGrid({ themes, activateAction }: ThemesGridProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {themes.map((theme) => (
          <motion.div key={theme.id} variants={item}>
            <ThemeCard 
              theme={theme} 
              onSelect={setSelectedTheme}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedTheme && (
          <ThemeDetailsModal 
            key="theme-details-modal"
            theme={selectedTheme} 
            onClose={() => setSelectedTheme(null)} 
            activateAction={activateAction}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function ThemeDetailsModal({ theme, onClose, activateAction }: { theme: Theme, onClose: () => void, activateAction: (formData: FormData) => Promise<void> }) {
  let config: ThemeConfig | null = null
  try {
    config = JSON.parse(theme.config) as ThemeConfig
  } catch (e) {
    console.error("Failed to parse theme config", e)
  }

  if (!config) return null

  const { colors } = config

  const style = {
    "--preview-bg": colors.background,
    "--preview-fg": colors.foreground,
    "--preview-primary": colors.primary,
    "--preview-muted": colors.muted,
    "--preview-border": colors.border,
    "--preview-radius": colors.radius,
  } as React.CSSProperties

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative w-full max-w-5xl overflow-hidden shadow-2xl rounded-lg z-10"
        style={{
          ...style,
          backgroundColor: "var(--preview-bg)",
          color: "var(--preview-fg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
      <div className="relative grid grid-cols-1 lg:grid-cols-5 h-[80vh] max-h-[700px]">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full hover:opacity-80 transition-opacity shadow-sm border"
          style={{
            backgroundColor: "var(--preview-bg)",
            color: "var(--preview-fg)",
            borderColor: "var(--preview-border)"
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side - Preview */}
        <div className="lg:col-span-3 relative p-8 flex items-center justify-center border-r" style={{ borderColor: "var(--preview-border)" }}>
          <div className="w-full aspect-video shadow-2xl rounded-lg overflow-hidden border" style={{ borderColor: "var(--preview-border)", backgroundColor: "var(--preview-bg)" }}>
            <ThemePreview layout={theme.layout} scale={3} />
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="lg:col-span-2 p-6 flex flex-col h-full overflow-y-auto">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold">{theme.name}</h2>
              {theme.isPremium && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium border border-yellow-200">
                  PREMIUM
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium border">
                {theme.category}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium border">
                {theme.layout}
              </span>
            </div>
            
            {theme.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">{theme.description}</p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Color Palette
              <span className="text-xs font-normal text-muted-foreground">({Object.keys(colors).filter(k => k !== 'radius').length} colors)</span>
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(colors).map(([key, value]) => {
                if (typeof value !== 'string' || key === 'radius') return null;
                return (
                  <div key={key} className="flex items-center gap-3 p-2 rounded-md border bg-background/50 hover:bg-background transition-colors">
                    <div 
                      className="w-8 h-8 rounded-full shadow-sm border shrink-0" 
                      style={{ backgroundColor: value }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium capitalize truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">{value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--preview-border)" }}>
            <form action={async (formData) => {
                await activateAction(formData);
                onClose();
            }}>
                <input type="hidden" name="themeId" value={theme.id} />
                <ModalSubmitButton isActive={theme.isActive} />
            </form>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  )
}

function ModalSubmitButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      className="w-full" 
      size="lg"
      disabled={isActive || pending}
      variant={isActive ? "secondary" : "default"}
    >
      {pending ? "Activating..." : isActive ? "Active Theme" : "Activate Theme"}
    </Button>
  )
}
