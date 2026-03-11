
"use client"

import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { ThemeConfig } from "@/types/theme"
import { motion, AnimatePresence } from "framer-motion"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  showSocial?: boolean
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const { theme, isDark } = useTheme()
  const layout = theme?.layout || "Centered" 
  
  // Parse theme config
  let config: ThemeConfig | null = null
  if (theme?.config) {
    try {
      config = typeof theme.config === 'string' ? JSON.parse(theme.config) : theme.config
    } catch (e) {
      console.error("Failed to parse theme config", e)
    }
  }

  // Theme Detection
  const isPlantie = theme?.name === "Healthcare Green"
  const isFinance = theme?.name === "Finance Gold"
  
  // Custom Background Image
  const activeAssets = (isDark && config?.darkAssets) ? config.darkAssets : config?.assets
  const backgroundImage = activeAssets?.backgroundImage
  const sidebarImage = activeAssets?.sidebarImage

  // Common Form Container
  const FormContainer = (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
      "flex w-full flex-col justify-center space-y-6 sm:w-[350px] mx-auto relative z-10",
      (isPlantie || isFinance) && isDark && "text-white",
      (isPlantie || isFinance) && !isDark && "text-foreground"
    )}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className={cn(
          "text-2xl font-semibold tracking-tight",
          (isPlantie || isFinance) && isDark && "text-4xl font-bold tracking-tight mb-2 text-white",
          (isPlantie || isFinance) && !isDark && "text-4xl font-bold tracking-tight mb-2 text-foreground"
        )}>
          {title}
        </h1>
        <p className={cn(
          "text-sm text-muted-foreground",
          (isPlantie || isFinance) && isDark && "text-gray-400",
          (isPlantie || isFinance) && !isDark && "text-muted-foreground"
        )}>
          {description}
        </p>
      </div>
      {children}
    </motion.div>
  )

  // Side Panel (Image/Brand)
  const SidePanel = (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r border-border">
      <div className="absolute inset-0 bg-primary/20" /> 
      {isPlantie && (
         <div className={cn("absolute inset-0 z-10", isDark ? "bg-black/60" : "bg-white/20")} /> 
      )}
      {isFinance && (
         <div className={cn("absolute inset-0 z-10", isDark ? "bg-black/80" : "bg-white/90 backdrop-blur-sm")} /> 
      )}
      
      <div className="relative z-20 flex items-center text-lg font-medium text-foreground">
        {isPlantie ? (
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">P</span>
                </div>
                <span className={cn("font-bold tracking-wider", isDark ? "text-white" : "text-foreground")}>PLANTIE</span>
             </div>
        ) : isFinance ? (
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-primary-foreground font-serif font-bold italic">F</span>
                </div>
                <span className={cn("font-bold tracking-widest uppercase font-serif", isDark ? "text-white" : "text-foreground")}>FINANCE</span>
             </div>
        ) : (
             <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                Acme Inc
             </>
        )}
       
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg text-foreground">
            {isPlantie 
              ? "High quality medical and recreational cannabis with fast and discreet delivery anywhere in the States."
              : "This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
            }
          </p>
          <footer className="text-sm text-foreground">
             {isPlantie ? "Plantie Organic" : "Sofia Davis"}
          </footer>
        </blockquote>
      </div>
    </div>
  )

  // Full-Bg (Used for Plantie)
  if (layout === "Full-Bg") {
    return (
      <div className="relative h-screen flex items-center justify-center bg-muted overflow-hidden">
         {/* Background Image Layer */}
         <AnimatePresence>
           {(isPlantie || backgroundImage) && (
              <motion.div 
                key={backgroundImage || "default-bg"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 bg-cover bg-center z-0 scale-105"
                style={{ 
                    backgroundImage: backgroundImage ? `url("${backgroundImage}")` : 'url("https://images.unsplash.com/photo-1603909223429-69bb7101f420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                    filter: (isPlantie && !isDark) 
                        ? 'brightness(0.95) contrast(1.05)' 
                        : 'brightness(0.25) contrast(1.1)'
                }}
              />
           )}
         </AnimatePresence>
         
         <AnimatePresence>
           {(isPlantie || backgroundImage) && (
              <motion.div 
                key={`overlay-${isDark}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={cn("absolute top-0 left-0 w-full h-full z-0 pointer-events-none", isDark ? "bg-gradient-to-b from-black/50 via-transparent to-black/80" : "bg-gradient-to-b from-white/30 via-transparent to-white/50")} 
              />
           )}
         </AnimatePresence>

         <AnimatePresence>
           {!(isPlantie || backgroundImage) && (
              <motion.div 
                key="no-bg-fallback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-primary/10 backdrop-blur-sm" 
              />
           )}
         </AnimatePresence>

        {/* Form Card */}
        <div className={cn(
          "relative z-10 w-[min(100%,56rem)] overflow-hidden rounded-[28px] border transition-all duration-500",
          isPlantie
            ? (isDark 
                ? "login-card border-white/35 bg-white/20 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
                : "border-white/40 bg-white/60 backdrop-blur-xl shadow-xl") 
            : "bg-background border-border shadow-2xl"
        )}>
          <div className={cn(
            "grid",
            isPlantie || sidebarImage ? "grid-cols-1 md:grid-cols-[280px_1fr]" : "grid-cols-1"
          )}>
            {(isPlantie || sidebarImage) && (
              <div className="relative hidden md:block">
                <AnimatePresence>
                   <motion.div
                     key={sidebarImage || "default-sidebar"}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.7 }}
                     className="absolute inset-0 bg-cover bg-center"
                     style={{
                       backgroundImage: sidebarImage 
                           ? `url("${sidebarImage}")` 
                           : 'url("https://images.unsplash.com/photo-1615486363973-9a7877b3f2ae?auto=format&fit=crop&w=900&q=80")',
                       filter: isDark ? "brightness(0.85) contrast(1.1)" : "brightness(0.95) contrast(1.05)",
                     }}
                   />
                </AnimatePresence>
                <div className={cn("absolute inset-0 pointer-events-none", isDark ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent" : "bg-gradient-to-tr from-white/60 via-white/20 to-transparent")} />
              </div>
            )}

            <div className={cn(
              "p-10",
              isPlantie && "bg-transparent"
            )}>
              {FormContainer}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Split Layouts...
  if (layout === "Split-Left") {
    return (
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {SidePanel}
        <div className="lg:p-8">
          {FormContainer}
        </div>
      </div>
    )
  }

  if (layout === "Split-Right") {
    return (
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {SidePanel}
        <div className="lg:p-8">
          {FormContainer}
        </div>
      </div>
    )
  }

  // Default: Centered
  return (
    <div className="container h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-sm bg-background">
         {FormContainer}
      </div>
    </div>
  )
}
