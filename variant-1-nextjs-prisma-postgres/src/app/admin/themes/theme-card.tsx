
"use client"

import { Theme } from "@prisma/client"
import { ThemeConfig } from "@/types/theme"
import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

interface ThemeCardProps {
  theme: Theme
  onSelect?: (theme: Theme) => void
}

export function ThemeCard({ theme, onSelect }: ThemeCardProps) {
  let config: ThemeConfig | null = null
  try {
    config = JSON.parse(theme.config) as ThemeConfig
  } catch (e) {
    console.error("Failed to parse theme config", e)
  }

  if (!config) return <div className="p-4 border border-red-500">Invalid Config</div>

  const { colors, assets } = config

  // Helper to get color style
  const style = {
    "--preview-bg": colors.background,
    "--preview-fg": colors.foreground,
    "--preview-primary": colors.primary,
    "--preview-muted": colors.muted,
    "--preview-border": colors.border,
    "--preview-radius": colors.radius,
  } as React.CSSProperties

  return (
    <div 
      className={`border rounded-lg overflow-hidden flex flex-col justify-between transition-all h-full ${
        theme.isActive ? "border-primary ring-2 ring-primary ring-offset-2" : "hover:border-primary/50"
      } ${onSelect ? "cursor-pointer" : ""}`}
      onClick={() => onSelect?.(theme)}
    >
      {/* Preview Window */}
      <div 
        className="aspect-video w-full relative border-b overflow-hidden"
        style={style}
      >
        <ThemePreview layout={theme.layout} backgroundImage={assets?.backgroundImage} />
      </div>

      {/* Info & Action */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg leading-none">{theme.name}</h3>
            {theme.isPremium && (
              <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-medium">PREMIUM</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground capitalize">{theme.category} • {theme.layout}</p>
        </div>
        
        <div className="mt-auto">
          {theme.isActive ? (
             <div className="w-full h-8 flex items-center justify-center bg-secondary text-secondary-foreground text-xs font-medium rounded">
               Active
             </div>
          ) : (
            <div className="w-full h-8 flex items-center justify-center border border-input bg-background text-muted-foreground text-xs rounded opacity-50">
              Click to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ThemePreview({ layout, scale = 1, backgroundImage, sidebarImage }: { layout: string, scale?: number, backgroundImage?: string, sidebarImage?: string }) {
  const Card = () => (
    <div 
      className={`w-16 p-2 rounded flex flex-col gap-1.5 shadow-sm bg-[var(--preview-bg)] border border-[var(--preview-border)] origin-center relative overflow-hidden`}
      style={{ 
        borderRadius: "calc(var(--preview-radius) * 0.5)",
        transform: `scale(${scale})` 
      }}
    >
      {/* If sidebar image exists and we are in full-bg mode (simulating the split card inside), show it */}
      {sidebarImage && layout === "Full-Bg" && (
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-cover bg-center z-0" style={{ backgroundImage: `url(${sidebarImage})` }}>
           <div className="absolute inset-0 bg-black/20" />
        </div>
      )}
      
      <div className={`relative z-10 flex flex-col gap-1.5 ${sidebarImage && layout === "Full-Bg" ? "pl-5" : ""}`}>
        <div className="h-1.5 w-8 bg-[var(--preview-fg)] opacity-80 rounded-sm mb-1" />
        <div className="h-1.5 w-full border border-[var(--preview-border)] rounded-sm" />
        <div className="h-1.5 w-full border border-[var(--preview-border)] rounded-sm" />
        <div className="h-1.5 w-full bg-[var(--preview-primary)] rounded-sm mt-0.5" />
      </div>
    </div>
  )

  const Background = () => (
    <div className="absolute inset-0 bg-[var(--preview-bg)]" />
  )

  const SidePanel = () => (
    <div className="h-full w-full bg-[var(--preview-muted)] relative overflow-hidden flex items-center justify-center">
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      {/* If it's a split layout and we have a sidebar image, use that instead of the background image */}
      {sidebarImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${sidebarImage})` }}
        />
      )}
      
      <div 
        className="w-6 h-6 rounded-full bg-[var(--preview-primary)] opacity-20 origin-center relative z-10" 
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  )

  if (layout === "Split-Left") {
    return (
      <div className="w-full h-full grid grid-cols-2">
        <div className="relative h-full w-full">
            <SidePanel />
        </div>
        <div className="relative flex items-center justify-center bg-[var(--preview-bg)]">
          <Card />
        </div>
      </div>
    )
  }

  if (layout === "Split-Right") {
    return (
      <div className="w-full h-full grid grid-cols-2">
        <div className="relative flex items-center justify-center bg-[var(--preview-bg)]">
          <Card />
        </div>
        <div className="relative h-full w-full">
            <SidePanel />
        </div>
      </div>
    )
  }

  if (layout === "Full-Bg") {
    return (
      <div className="w-full h-full relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[var(--preview-muted)]" />
        {backgroundImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--preview-primary)] opacity-10" />
        )}
        <div className="relative z-10">
          <Card />
        </div>
      </div>
    )
  }

  // Centered (Default)
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-[var(--preview-bg)]">
      {backgroundImage ? (
         <div 
         className="absolute inset-0 bg-cover bg-center opacity-40"
         style={{ backgroundImage: `url(${backgroundImage})` }}
       />
      ) : (
        <div className="absolute inset-0 opacity-5 bg-[var(--preview-fg)]" />
      )}
      <Card />
    </div>
  )
}
