"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface GoogleStreetViewProps {
  className?: string
  coordinates: [number, number]
  heading?: number
  pitch?: number
  zoom?: number
  onStreetViewReady?: (streetView: any) => void
}

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

export function GoogleStreetView({
  className,
  coordinates,
  heading = 0,
  pitch = 0,
  zoom = 1,
  onStreetViewReady,
}: GoogleStreetViewProps) {
  const streetViewRef = useRef<HTMLDivElement>(null)
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false)
  const [streetView, setStreetView] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadGoogleMaps = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          if (isMounted) {
            setGoogleMapsLoaded(true)
            setLoading(false)
          }
          return
        }

        // Create a global callback function
        window.initGoogleMaps = () => {
          if (isMounted) {
            setGoogleMapsLoaded(true)
            setLoading(false)
          }
        }

        // Load Google Maps JavaScript API
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaJzuU17R8&libraries=geometry&callback=initGoogleMaps`
        script.async = true
        script.defer = true
        script.onerror = () => {
          if (isMounted) {
            setError("Failed to load Google Maps API")
            setLoading(false)
          }
        }

        document.head.appendChild(script)
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load Google Maps")
          setLoading(false)
        }
      }
    }

    loadGoogleMaps()

    return () => {
      isMounted = false
      if (streetView) {
        try {
          // Clean up street view
          streetView.setVisible(false)
        } catch (err) {
          console.error("Error disposing street view:", err)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (googleMapsLoaded && streetViewRef.current && !streetView && window.google) {
      try {
        // Create Street View panorama
        const panorama = new window.google.maps.StreetViewPanorama(streetViewRef.current, {
          position: { lat: coordinates[0], lng: coordinates[1] },
          pov: {
            heading: heading,
            pitch: pitch,
          },
          zoom: zoom,
          visible: true,
          enableCloseButton: false,
          showRoadLabels: true,
          motionTracking: false,
          motionTrackingControl: false,
        })

        // Check if Street View data is available
        const streetViewService = new window.google.maps.StreetViewService()
        streetViewService.getPanorama(
          {
            location: { lat: coordinates[0], lng: coordinates[1] },
            radius: 50,
          },
          (data: any, status: any) => {
            if (status === "OK") {
              panorama.setPano(data.location.pano)
              panorama.setPov({
                heading: heading,
                pitch: pitch,
              })
              panorama.setZoom(zoom)

              setStreetView(panorama)

              // Call onStreetViewReady callback if provided
              if (onStreetViewReady) {
                onStreetViewReady(panorama)
              }
            } else {
              setError("No Street View imagery available at this location")
            }
          },
        )
      } catch (err) {
        console.error("Error initializing Google Street View:", err)
        setError("Failed to initialize Street View")
      }
    }
  }, [googleMapsLoaded, coordinates, heading, pitch, zoom, onStreetViewReady])

  // Update view when heading, pitch, or zoom changes
  useEffect(() => {
    if (streetView && (heading !== undefined || pitch !== undefined || zoom !== undefined)) {
      try {
        streetView.setPov({
          heading: heading,
          pitch: pitch,
        })
        streetView.setZoom(zoom)
      } catch (err) {
        console.warn("Error updating street view:", err)
      }
    }
  }, [streetView, heading, pitch, zoom])

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
      {(loading || !googleMapsLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div className="text-sm">Loading Google Street View...</div>
          </div>
        </div>
      )}
    </div>
  )
}
