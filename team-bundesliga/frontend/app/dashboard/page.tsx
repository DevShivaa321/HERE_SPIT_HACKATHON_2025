"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { LocationSearch } from "@/components/dashboard/location-search"
import { AdvancedMapView } from "@/components/dashboard/advanced-map-view"
import { AnalysisReport } from "@/components/dashboard/analysis-report"
import { StreetView } from "@/components/dashboard/street-view"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeView, setActiveView] = useState<"map" | "street">("map")

  const handleLocationSelect = (loc: string, coords: [number, number]) => {
    setIsLoading(true)
    setLocation(loc)
    setCoordinates(coords)

    // Simulate loading time for the analysis
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Location Analysis</h1>
          <p className="text-muted-foreground mb-6">
            Enter a location to generate an AI-powered analysis with satellite imagery, street view, construction
            mapping, and environmental data.
          </p>

          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "map" | "street")} className="mb-6">
          <TabsList>
            <TabsTrigger value="map">Aerial View</TabsTrigger>
            <TabsTrigger value="street">Street View</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {activeView === "map" ? (
              <AdvancedMapView
                location={location}
                coordinates={coordinates || [40.7128, -74.006]}
                isLoading={isLoading}
              />
            ) : (
              <StreetView location={location} coordinates={coordinates || [40.7128, -74.006]} isLoading={isLoading} />
            )}
          </div>

          <div>
            <AnalysisReport location={location} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  )
}
