"use client"

import { useState, useEffect } from "react"
import { Theme } from "@prisma/client"
import { ThemeConfig } from "@/types/theme"
import { ThemeCard, ThemePreview } from "./theme-card"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Upload, ImagePlus, Loader2, Grid2X2 } from "lucide-react"

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1603909223429-69bb7101f420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Forest (Dark)
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2070&q=80", // Fern (Light)
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2070&q=80", // Abstract Green
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2070&q=80", // Mountains
  "https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&w=2070&q=80", // Geometric
  "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2070&q=80"  // Plant
]
import { useFormStatus } from "react-dom"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { uploadFile } from "@/actions/upload-actions"
import { updateThemeBackground } from "@/actions/theme-actions"
import { useRouter } from "next/navigation"

interface ThemesGridProps {
  themes: Theme[]
  activateAction: (formData: FormData) => Promise<void>
}

export function ThemesGrid({ themes, activateAction }: ThemesGridProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)

  // Sync selectedTheme when themes prop updates (e.g. after background upload)
  useEffect(() => {
    if (selectedTheme) {
      const updatedTheme = themes.find(t => t.id === selectedTheme.id)
      if (updatedTheme) {
        setSelectedTheme(updatedTheme)
      }
    }
  }, [themes])

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
            key={selectedTheme.id}
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  
  let config: ThemeConfig | null = null
  try {
    config = JSON.parse(theme.config) as ThemeConfig
  } catch (e) {
    console.error("Failed to parse theme config", e)
  }

  if (!config) return null

  const { colors, assets } = config

  const style = {
    "--preview-bg": colors.background,
    "--preview-fg": colors.foreground,
    "--preview-primary": colors.primary,
    "--preview-muted": colors.muted,
    "--preview-border": colors.border,
    "--preview-radius": colors.radius,
  } as React.CSSProperties

  const slides = [
    { type: 'preview', label: 'Schematic' },
    { type: 'gallery', label: 'Gallery' },
    { type: 'custom', label: 'Background' }
  ]

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const uploadRes = await uploadFile(formData)
    if (uploadRes.success && uploadRes.url) {
        await updateThemeBackground(theme.id, uploadRes.url)
        router.refresh()
    } else {
        console.error("Upload failed:", uploadRes.error)
        // Ideally show a toast here
    }
    setIsUploading(false)
  }

  const handleSelectSample = async (url: string) => {
    setIsUploading(true)
    await updateThemeBackground(theme.id, url)
    router.refresh()
    setIsUploading(false)
  }

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
        <div className="lg:col-span-3 relative p-8 flex flex-col items-center justify-center border-r group" style={{ borderColor: "var(--preview-border)" }}>
          <div className="w-full aspect-video shadow-2xl rounded-lg overflow-hidden border relative mb-8" style={{ borderColor: "var(--preview-border)", backgroundColor: "var(--preview-bg)" }}>
            {/* Navigation Buttons */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/50 hover:bg-background border shadow-sm transition-all opacity-0 group-hover:opacity-100"
                style={{ color: "var(--preview-fg)", borderColor: "var(--preview-border)" }}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/50 hover:bg-background border shadow-sm transition-all opacity-0 group-hover:opacity-100"
                style={{ color: "var(--preview-fg)", borderColor: "var(--preview-border)" }}
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {currentSlide === 0 && (
                <motion.div
                  key="schematic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  <ThemePreview layout={theme.layout} scale={3} backgroundImage={assets?.backgroundImage} sidebarImage={assets?.sidebarImage} />
                </motion.div>
              )}
              
              {currentSlide === 1 && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex flex-col items-center justify-center bg-muted/20 p-6 overflow-y-auto"
                >
                  <h3 className="text-lg font-semibold mb-4 text-center">Select Background</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg">
                    {SAMPLE_IMAGES.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSample(url)}
                        disabled={isUploading}
                        className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all group ${
                          assets?.backgroundImage === url 
                            ? "border-primary ring-2 ring-primary ring-offset-2" 
                            : "border-transparent hover:border-primary/50"
                        }`}
                      >
                        <img 
                          src={url} 
                          alt={`Sample ${idx + 1}`} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        {isUploading && assets?.backgroundImage === url && (
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                           </div>
                        )}
                        {assets?.backgroundImage === url && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                            ACTIVE
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentSlide === 2 && (
                <motion.div
                  key="custom"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center bg-black/5 relative group/upload"
                >
                  {assets?.backgroundImage ? (
                    <>
                        <img 
                        src={assets.backgroundImage} 
                        alt="Theme Background" 
                        className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                                <div className="bg-background text-foreground px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-muted transition-colors">
                                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                                    <span>Change Image</span>
                                </div>
                            </label>
                        </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">No Custom Background</p>
                      <label className="mt-3 cursor-pointer">
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                             {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            <span>Upload Image</span>
                        </div>
                      </label>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4">
            {slides.map((slide, idx) => (
                <button
                    key={idx}
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                    }}
                    className={`relative w-16 h-12 rounded border-2 transition-all overflow-hidden ${
                        currentSlide === idx 
                        ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-[var(--preview-bg)]" 
                        : "border-muted hover:border-primary/50"
                    }`}
                    style={{ 
                        borderColor: currentSlide === idx ? "var(--preview-primary)" : "var(--preview-border)"
                    }}
                >
                    {idx === 0 && (
                        <div className="w-full h-full bg-[var(--preview-bg)] flex items-center justify-center">
                            <div className="w-8 h-6 border rounded-sm" style={{ borderColor: "var(--preview-border)" }} />
                        </div>
                    )}
                    {idx === 1 && (
                        <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                             <Grid2X2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                    )}
                    {idx === 2 && (
                        <div className="w-full h-full bg-black/5 flex items-center justify-center">
                             {assets?.backgroundImage ? (
                                <img src={assets.backgroundImage} className="w-full h-full object-cover" />
                             ) : (
                                <Upload className="w-4 h-4 text-muted-foreground" />
                             )}
                        </div>
                    )}
                </button>
            ))}
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
