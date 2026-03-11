"use client"

import { useState, useEffect, useRef } from "react"
import { Theme } from "@prisma/client"
import { ThemeConfig } from "@/types/theme"
import { ThemeCard, ThemePreview } from "./theme-card"
import { Button } from "@/components/ui/button"
import { X, Image as ImageIcon, Upload, ImagePlus, Loader2, Plus, CheckCircle2, AlertCircle } from "lucide-react"

const SAMPLE_IMAGES = {
  "Healthcare Green": [
    "https://images.unsplash.com/photo-1603909223429-69bb7101f420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Cannabis/Health Green
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2070&q=80", // Dark Fern
    "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=2070&q=80", // Succulent/Aloe (Health)
    "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=2070&q=80", // Clean Green Leaf (Health)
    "https://images.unsplash.com/photo-1551970634-747846a548cb?auto=format&fit=crop&w=2070&q=80", // Green-leafed plant (Josefin)
    "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2070&q=80"  // Monstera Plant
  ],
  "Finance Gold": [
    "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=2070&q=80", // Gold Abstract (Default)
    "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=2070&q=80", // Dark Gold Texture
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=2070&q=80", // Dark Crypto/Gold
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=2070&q=80", // Finance Graph
    "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=2070&q=80", // Golden Coins/Bitcoin
    "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=2070&q=80"  // Gold Liquid/Silk
  ],
  "default": [
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1557682224-5b8590cd14b1?auto=format&fit=crop&w=2070&q=80"
  ]
}
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

type ModalState = 
  | { type: 'idle' }
  | { type: 'confirm_save', url: string }
  | { type: 'success_upload', url: string }
  | { type: 'success_save' }
  | { type: 'error', message: string }

function ThemeDetailsModal({ theme, onClose, activateAction }: { theme: Theme, onClose: () => void, activateAction: (formData: FormData) => Promise<void> }) {
  const [isUploading, setIsUploading] = useState(false)
  const [modalState, setModalState] = useState<ModalState>({ type: 'idle' })
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  
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

  // Get sample images based on theme name, fallback to default
  const currentSampleImages = SAMPLE_IMAGES[theme.name as keyof typeof SAMPLE_IMAGES] || SAMPLE_IMAGES.default

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const uploadRes = await uploadFile(formData)
    setIsUploading(false)

    if (uploadRes.success && uploadRes.url) {
        setModalState({ type: 'success_upload', url: uploadRes.url })
    } else {
        setModalState({ type: 'error', message: uploadRes.error || "Upload failed" })
    }
  }

  const handleSelectSample = (url: string) => {
    setModalState({ type: 'confirm_save', url })
  }

  const handleConfirmSave = async (url: string) => {
    setIsUploading(true)
    await updateThemeBackground(theme.id, url)
    router.refresh()
    setIsUploading(false)
    setModalState({ type: 'success_save' })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll-fast
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative w-full max-w-5xl overflow-hidden shadow-2xl rounded-2xl z-10 bg-white text-slate-950 border border-border flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/10">
          <div className="flex items-center gap-3">
             <h2 className="text-xl font-bold tracking-tight">{theme.name}</h2>
             <div className="flex gap-2">
                {theme.isPremium && (
                  <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                    Premium
                  </span>
                )}
                <span className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-border">
                   {theme.category}
                </span>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Left Side - Preview & Background Selection */}
            <div className="lg:w-3/5 flex flex-col border-b lg:border-b-0 lg:border-r bg-muted/5 relative overflow-hidden">
              
              {/* Preview Area */}
              <div className="flex-1 p-8 flex items-center justify-center min-h-[300px] lg:min-h-0 relative">
                 {/* CSS Variables Wrapper for Preview */}
                 <div 
                    className="w-full aspect-video shadow-2xl rounded-xl overflow-hidden border bg-background relative transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]"
                    style={style}
                 >
                    <ThemePreview layout={theme.layout} scale={3} backgroundImage={assets?.backgroundImage} sidebarImage={assets?.sidebarImage} />
                 </div>
              </div>

              {/* Background Selection Strip */}
              <div className="h-[140px] bg-background border-t flex flex-col">
                 <div className="px-4 py-2 border-b">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Background Assets</span>
                 </div>
                 <div className="flex-1 overflow-x-auto p-4 flex items-center gap-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                 >
                    {/* Custom Upload Card */}
                    <label className={`flex-shrink-0 relative w-[120px] h-[80px] rounded-lg overflow-hidden border-2 border-dashed transition-all group flex flex-col items-center justify-center cursor-pointer hover:bg-accent ${
                       assets?.backgroundImage && !currentSampleImages.includes(assets.backgroundImage) 
                         ? "border-primary bg-primary/5" 
                         : "border-muted-foreground/25 hover:border-primary/50"
                    }`}>
                         <input 
                             type="file" 
                             className="hidden" 
                             accept="image/*"
                             onChange={handleFileUpload}
                             disabled={isUploading}
                         />
                         {isUploading ? (
                             <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                         ) : (
                             <div className="flex flex-col items-center gap-1">
                                 <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                 <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary">Upload</span>
                             </div>
                         )}
                    </label>

                    {/* Sample Images */}
                    {currentSampleImages.map((url, idx) => (
                       <button
                         key={idx}
                         onClick={() => handleSelectSample(url)}
                         disabled={isUploading}
                         className={`flex-shrink-0 relative w-[120px] h-[80px] rounded-lg overflow-hidden border-2 transition-all group select-none ${
                           assets?.backgroundImage === url 
                             ? "border-primary ring-2 ring-primary/20" 
                             : "border-transparent hover:border-primary/50"
                         }`}
                         onDragStart={(e) => e.preventDefault()}
                       >
                         <img 
                           src={url} 
                           alt={`Sample ${idx + 1}`} 
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                         />
                         {isUploading && assets?.backgroundImage === url && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                               <Loader2 className="w-4 h-4 animate-spin text-white" />
                            </div>
                         )}
                         {assets?.backgroundImage === url && (
                           <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                             ACTIVE
                           </div>
                         )}
                       </button>
                    ))}
                 </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="lg:w-2/5 flex flex-col bg-white h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-8">
                
                {/* About Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                    About this theme
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {theme.description || "A professionally designed theme with carefully selected colors and assets to enhance your brand identity."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                     <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Layout: <span className="font-medium text-foreground">{theme.layout}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Type: <span className="font-medium text-foreground">{theme.isPremium ? "Premium" : "Standard"}</span>
                     </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-6 pb-8">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Color System
                    </h3>
                  </div>
                  
                  {/* Brand Colors */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Brand Identity</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { k: 'primary', l: 'Primary' }, 
                        { k: 'secondary', l: 'Secondary' },
                        { k: 'accent', l: 'Accent' }
                      ].map(({ k, l }) => {
                         const key = k as keyof typeof colors;
                         const color = colors[key];
                         const fgKey = `${k}Foreground` as keyof typeof colors;
                         const fg = colors[fgKey];
                         
                         if (!color) return null;
                         
                         return (
                           <div key={k} className="flex flex-col p-3 rounded-xl border bg-card/50 hover:bg-card hover:shadow-sm transition-all group">
                              <div className="flex items-start justify-between mb-3">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground">{l}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono uppercase">{color}</span>
                                 </div>
                                 <button 
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-muted rounded-md"
                                    onClick={() => navigator.clipboard.writeText(color)}
                                    title="Copy Color"
                                 >
                                    <div className="w-3 h-3 border-2 border-current rounded-[1px] text-muted-foreground" />
                                 </button>
                              </div>
                              <div className="flex items-center gap-2 mt-auto">
                                 <div 
                                   className="h-12 flex-1 rounded-lg shadow-sm border relative overflow-hidden flex items-center justify-center" 
                                   style={{ backgroundColor: color }}
                                 >
                                    {fg && <span className="text-xs font-medium" style={{ color: fg }}>Aa</span>}
                                 </div>
                                 {fg && (
                                    <div 
                                      className="w-12 h-12 rounded-lg shadow-sm border relative overflow-hidden flex items-center justify-center" 
                                      style={{ backgroundColor: fg }}
                                      title={`Foreground: ${fg}`}
                                    >
                                       <span className="text-xs font-medium" style={{ color: color }}>Aa</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                         )
                      })}
                    </div>
                  </div>

                  {/* Surface & UI Colors */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Interface & Surface</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                       {[
                         { k: 'background', l: 'Background' },
                         { k: 'foreground', l: 'Text' },
                         { k: 'muted', l: 'Muted' },
                         { k: 'border', l: 'Border' },
                         { k: 'input', l: 'Input' },
                         { k: 'ring', l: 'Ring' },
                         { k: 'destructive', l: 'Error' }
                       ].map(({ k, l }) => {
                          const key = k as keyof typeof colors;
                          const color = colors[key];
                          if (!color) return null;
                          
                          return (
                            <div 
                              key={k} 
                              className="group relative flex flex-col gap-1.5 p-1.5 rounded-lg border bg-card/30 hover:bg-card hover:shadow-sm transition-all cursor-pointer"
                              onClick={() => navigator.clipboard.writeText(color)}
                              title={`${l} (${color}) - Click to copy`}
                            >
                               <div 
                                 className="w-full h-8 rounded shadow-sm border relative overflow-hidden group/color" 
                                 style={{ backgroundColor: color }}
                               >
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 bg-black/40 backdrop-blur-[1px] transition-opacity">
                                     <span className="text-[8px] font-bold text-white uppercase tracking-wider">COPY</span>
                                  </div>
                               </div>
                               <div className="flex justify-center">
                                  <span className="text-[10px] text-muted-foreground font-mono uppercase group-hover:text-foreground transition-colors">{color}</span>
                               </div>
                            </div>
                          )
                       })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t bg-muted/10 mt-auto">
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

      {/* Confirmation/Status Modals */}
      <AnimatePresence>
        {modalState.type !== 'idle' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
              onClick={() => modalState.type === 'error' ? setModalState({ type: 'idle' }) : null}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative w-full max-w-sm bg-white text-slate-950 p-6 rounded-xl shadow-xl border border-border z-10 flex flex-col items-center text-center gap-4"
            >
              {modalState.type === 'confirm_save' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Save Changes?</h3>
                  <p className="text-sm text-muted-foreground">
                    Do you want to update the theme background?
                  </p>
                  <div className="flex gap-3 w-full mt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setModalState({ type: 'idle' })}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={() => handleConfirmSave(modalState.url)}>
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save
                    </Button>
                  </div>
                </>
              )}

              {modalState.type === 'success_upload' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Successfully Uploaded</h3>
                  <p className="text-sm text-muted-foreground">
                    Your image has been uploaded successfully.
                  </p>
                  <Button className="w-full mt-2" onClick={() => setModalState({ type: 'confirm_save', url: modalState.url })}>
                    Continue
                  </Button>
                </>
              )}

              {modalState.type === 'success_save' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Successfully Changed</h3>
                  <p className="text-sm text-muted-foreground">
                    The theme background has been updated.
                  </p>
                  <Button className="w-full mt-2" onClick={() => setModalState({ type: 'idle' })}>
                    Done
                  </Button>
                </>
              )}

              {modalState.type === 'error' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    {modalState.message}
                  </p>
                  <Button variant="destructive" className="w-full mt-2" onClick={() => setModalState({ type: 'idle' })}>
                    Close
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
