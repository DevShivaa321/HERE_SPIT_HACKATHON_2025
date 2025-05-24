"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface HereStreetViewProps {
  className?: string
  coordinates: [number, number]
  heading?: number
  onStreetViewReady?: (streetView: any) => void
}

export function HereStreetView({ className, coordinates, heading = 0, onStreetViewReady }: HereStreetViewProps) {
  const streetViewRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [streetView, setStreetView] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadHereMaps = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if HERE Maps is already loaded
        if (window.H && window.H.service && window.H.service.Platform) {
          if (isMounted) {
            setMapLoaded(true)
            setLoading(false)
          }
          return
        }

        // Load HERE Maps scripts sequentially
        const scripts = [
          "https://js.api.here.com/v3/3.1/mapsjs-core.js",
          "https://js.api.here.com/v3/3.1/mapsjs-service.js",
          "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
          "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
        ]

        for (const scriptSrc of scripts) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = scriptSrc
            script.async = true
            script.onload = resolve
            script.onerror = () => reject(new Error(`Failed to load ${scriptSrc}`))
            document.head.appendChild(script)
          })
        }

        // Load CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.type = "text/css"
        link.href = "https://js.api.here.com/v3/3.1/mapsjs-ui.css"
        document.head.appendChild(link)

        // Wait a bit for scripts to initialize
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (isMounted && window.H && window.H.service && window.H.service.Platform) {
          setMapLoaded(true)
        } else {
          throw new Error("HERE Maps failed to initialize")
        }
      } catch (err) {
        console.error("Error loading HERE Maps:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load HERE Maps")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadHereMaps()

    return () => {
      isMounted = false
      if (streetView) {
        try {
          streetView.dispose()
        } catch (err) {
          console.error("Error disposing street view:", err)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (mapLoaded && streetViewRef.current && !streetView && window.H) {
      try {
        // Initialize the platform with the API key
        const platform = new window.H.service.Platform({
          apikey: "4HRRKtdBCVTtcAydKcNJ_LdkeaS0lMMTs1u9VEz2iKo",
        })

        // Get default layers
        const defaultLayers = platform.createDefaultLayers()

        // Create a regular map instead of panorama (since panorama is not directly available)
        const map = new window.H.Map(streetViewRef.current, defaultLayers.vector.normal.map, {
          zoom: 18,
          center: { lat: coordinates[0], lng: coordinates[1] },
          pixelRatio: window.devicePixelRatio || 1,
        })

        // Add map behavior
        const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map))

        // Add UI components
        const ui = window.H.ui.UI.createDefault(map, defaultLayers)

        // Create a marker at the location
        const marker = new window.H.map.Marker({ lat: coordinates[0], lng: coordinates[1] })
        map.addObject(marker)

        // Set the map heading/rotation
        map.getViewModel().setLookAtData({
          position: { lat: coordinates[0], lng: coordinates[1] },
          heading: heading,
          tilt: 60, // Tilt to simulate street view perspective
          zoom: 19,
        })

        // Add resize listener
        const resizeListener = () => {
          try {
            map.getViewPort().resize()
          } catch (err) {
            console.warn("Error resizing map:", err)
          }
        }
        window.addEventListener("resize", resizeListener)

        setStreetView(map)

        // Call onStreetViewReady callback if provided
        if (onStreetViewReady) {
          onStreetViewReady(map)
        }

        // Cleanup function
        return () => {
          window.removeEventListener("resize", resizeListener)
        }
      } catch (err) {
        console.error("Error initializing HERE Maps:", err)
        setError("Failed to initialize street view")
      }
    }
  }, [mapLoaded, coordinates, heading, onStreetViewReady])

  // Update heading when it changes
  useEffect(() => {
    if (streetView && heading !== undefined) {
      try {
        streetView.getViewModel().setLookAtData({
          position: { lat: coordinates[0], lng: coordinates[1] },
          heading: heading,
          tilt: 60,
          zoom: 19,
        })
      } catch (err) {
        console.warn("Error updating street view heading:", err)
      }
    }
  }, [streetView, heading, coordinates])

  if (error) {
    return (
      <div
        className={cn(
          "w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center",
          className,
        )}
      >
        <div className="text-white text-center p-4">
          <p className="text-lg font-medium">Street View Error</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Please try a different location</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-full min-h-[400px] rounded-xl overflow-hidden relative", className)}>
      <div ref={streetViewRef} className="w-full h-full" />
      {(loading || !mapLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div className="text-sm">Loading Street View...</div>
          </div>
        </div>
      )}
    </div>
  )
}
