"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface LocationSearchProps {
  onLocationSelect: (location: string, coordinates: [number, number]) => void
}

const HERE_API_KEY = "4HRRKtdBCVTtcAydKcNJ_LdkeaS0lMMTs1u9VEz2iKo"

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Use HERE Geocoding API for real coordinates
      const geocodeUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&apiKey=${HERE_API_KEY}&limit=1`

      const response = await fetch(geocodeUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const location = data.items[0]
        const coordinates: [number, number] = [location.position.lat, location.position.lng]
        const displayName = location.title || location.address?.label || query

        onLocationSelect(displayName, coordinates)

        toast({
          title: "Location found",
          description: `Analyzing ${displayName}`,
        })
      } else {
        throw new Error("Location not found")
      }
    } catch (error) {
      console.error("HERE Geocoding error:", error)

      toast({
        title: "Error",
        description: "Could not find the location. Please try a different search term.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-lg space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter a location (e.g., Times Square New York, Eiffel Tower Paris)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          "Analyze Location"
        )}
      </Button>
    </form>
  )
}
