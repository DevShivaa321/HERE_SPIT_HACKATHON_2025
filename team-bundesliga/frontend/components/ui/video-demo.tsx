"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface VideoMapDemoProps {
  className?: string
}

export function VideoMapDemo({ className }: VideoMapDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoadedData = () => {
        setIsLoaded(true)
      }

      video.addEventListener("loadeddata", handleLoadedData)

      // Auto play the video
      video.play().catch(console.error)

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData)
      }
    }
  }, [])

  return (
    <div className={cn("relative flex size-full items-center justify-center overflow-hidden rounded-lg", className)}>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-white to-gray-200 bg-clip-text text-center text-2xl md:text-4xl font-semibold leading-none text-transparent drop-shadow-lg">
          HERE Map Rendering
        </span>
      </div>

      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          autoPlay
          loop
          muted
          playsInline
          poster="/placeholder.svg?height=600&width=800"
        >
          <source src="/videos/here-map-rendering.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white rounded-lg">
            <div className="animate-pulse">Loading video...</div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(147,51,234,0.1),rgba(255,255,255,0))] rounded-lg" />
    </div>
  )
}
