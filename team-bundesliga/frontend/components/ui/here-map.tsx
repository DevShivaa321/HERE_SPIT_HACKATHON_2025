"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface HereMapProps {
  className?: string
  theme?: "light" | "dark" | "satellite"
  center?: [number, number]
  zoom?: number
  onMapReady?: (map: any) => void
}

export function HereMap({
  className,
  theme = "dark",
  center = [40.7128, -74.006],
  zoom = 14,
  onMapReady,
}: HereMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
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
      if (map) {
        try {
          map.dispose()
        } catch (err) {
          console.error("Error disposing map:", err)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (mapLoaded && mapRef.current && !map && window.H) {
      try {
        // Initialize the platform with the API key
        const platform = new window.H.service.Platform({
          apikey: "4HRRKtdBCVTtcAydKcNJ_LdkeaS0lMMTs1u9VEz2iKo",
        })

        // Get default map types
        const defaultLayers = platform.createDefaultLayers({
          tileSize: 512,
          ppi: 320,
        })

        // Select the appropriate layer based on theme
        let baseLayer
        switch (theme) {
          case "satellite":
            baseLayer = defaultLayers.raster.satellite.map
            break
          case "light":
            baseLayer = defaultLayers.vector.normal.map
            break
          case "dark":
          default:
            baseLayer = defaultLayers.vector.normal.map
            break
        }

        // Initialize the map
        const newMap = new window.H.Map(mapRef.current, baseLayer, {
          zoom: zoom,
          center: { lat: center[0], lng: center[1] },
          pixelRatio: window.devicePixelRatio || 1,
        })

        // Add behavior control (pan and zoom)
        const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(newMap))

        // Add UI controls
        const ui = window.H.ui.UI.createDefault(newMap, defaultLayers)

        // Add resize listener
        const resizeListener = () => {
          try {
            newMap.getViewPort().resize()
          } catch (err) {
            console.warn("Error resizing map:", err)
          }
        }
        window.addEventListener("resize", resizeListener)

        setMap(newMap)

        // Call onMapReady callback if provided
        if (onMapReady) {
          onMapReady(newMap)
        }

        // Cleanup function
        return () => {
          window.removeEventListener("resize", resizeListener)
        }
      } catch (err) {
        console.error("Error initializing HERE Maps:", err)
        setError("Failed to initialize map")
      }
    }
  }, [mapLoaded, center, zoom, theme, onMapReady])

  // Update map center when coordinates change
  useEffect(() => {
    if (map && center) {
      try {
        map.setCenter({ lat: center[0], lng: center[1] })
        map.setZoom(zoom)
      } catch (err) {
        console.warn("Error updating map center:", err)
      }
    }
  }, [map, center, zoom])

  if (error) {
    return (
      <div
        className={cn(
          "w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center",
          className,
        )}
      >
        <div className="text-white text-center p-4">
          <p className="text-lg font-medium">Map Error</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Please refresh the page to try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-full min-h-[400px] rounded-xl overflow-hidden relative", className)}>
      <div ref={mapRef} className="w-full h-full" style={{ background: theme === "dark" ? "#0F1621" : "#f0f0f0" }} />
      {(loading || !mapLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div className="text-sm">Loading HERE Maps...</div>
          </div>
        </div>
      )}
    </div>
  )
}
