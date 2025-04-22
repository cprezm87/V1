"use client"

import type React from "react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
  children?: React.ReactNode
}

export default function Spotlight({ className, children }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const updateSpotlightPosition = (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const x = event.clientX - containerRect.left
    const y = event.clientY - containerRect.top

    setPosition({ x, y })
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(true)
    setOpacity(1)
    updateSpotlightPosition(event)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isHovering) {
      updateSpotlightPosition(event)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setOpacity(0)
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute -inset-px z-10 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(131, 255, 0, 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}
