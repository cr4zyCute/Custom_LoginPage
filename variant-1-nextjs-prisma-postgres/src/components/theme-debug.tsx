
"use client"

import { useEffect } from "react"

export function ThemeDebug() {
  useEffect(() => {
    const root = document.documentElement
    console.log("Current Theme Variables:")
    console.log("--primary:", getComputedStyle(root).getPropertyValue("--primary"))
    console.log("--background:", getComputedStyle(root).getPropertyValue("--background"))
  }, [])
  
  return null
}
