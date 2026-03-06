import * as React from "react"
import { cn } from "@/lib/utils"

interface ModalLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ModalLayout({ children, className }: ModalLayoutProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className={cn(
          "relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg sm:p-8",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
