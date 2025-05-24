"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from "lucide-react"
import { ImageMapDemo } from "@/components/ui/image-demo"

interface MapViewProps {
  location: string
  coordinates: [number, number]
  isLoading: boolean
}

export function MapView({ location, coordinates, isLoading }: MapViewProps) {
  const [activeTab, setActiveTab] = useState("demo")

  if (!location && !isLoading) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No location selected</h3>
          <p className="text-sm text-muted-foreground mt-2">Enter a location above to generate an analysis</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="demo" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 pt-4 gap-4">
          <h3 className="text-lg font-medium">{isLoading ? <Skeleton className="h-6 w-40" /> : location}</h3>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="demo" className="text-xs md:text-sm">
              Demo
            </TabsTrigger>
            <TabsTrigger value="satellite" className="text-xs md:text-sm">
              Satellite
            </TabsTrigger>
            <TabsTrigger value="construction" className="text-xs md:text-sm">
              Construction
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-4">
          <TabsContent value="demo" className="mt-0">
            <div className="w-full h-[400px] md:h-[500px] rounded-md overflow-hidden">
              <ImageMapDemo className="w-full h-full" />
            </div>
          </TabsContent>

          <TabsContent value="satellite" className="mt-0">
            {isLoading ? (
              <Skeleton className="w-full h-[400px] md:h-[500px]" />
            ) : (
              <div className="w-full h-[400px] md:h-[500px] rounded-md overflow-hidden">
                <ImageMapDemo className="w-full h-full" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="construction" className="mt-0">
            {isLoading ? (
              <Skeleton className="w-full h-[400px] md:h-[500px]" />
            ) : (
              <div className="w-full h-[400px] md:h-[500px] rounded-md overflow-hidden">
                <ImageMapDemo className="w-full h-full" />
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
