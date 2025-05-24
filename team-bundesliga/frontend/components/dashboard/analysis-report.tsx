"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Users, Wind, RouteIcon as Road } from "lucide-react"

interface AnalysisReportProps {
  location: string
  isLoading: boolean
}

interface AnalysisData {
  population: {
    total: number
    density: number
    growth: number
  }
  airQuality: {
    index: number
    rating: string
    pollutants: {
      pm25: number
      pm10: number
      o3: number
      no2: number
    }
  }
  roadDevelopment: {
    totalRoads: number
    mainRoads: number
    localRoads: number
    condition: string
    congestionLevel: number
  }
}

export function AnalysisReport({ location, isLoading }: AnalysisReportProps) {
  const [data, setData] = useState<AnalysisData | null>(null)

  useEffect(() => {
    if (!isLoading && location) {
      // Simulate API call to get analysis data
      const timer = setTimeout(() => {
        // Mock data for demo purposes
        setData({
          population: {
            total: Math.floor(Math.random() * 500000) + 100000,
            density: Math.floor(Math.random() * 5000) + 1000,
            growth: (Math.random() * 5).toFixed(1),
          },
          airQuality: {
            index: Math.floor(Math.random() * 150) + 20,
            rating: ["Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy"][Math.floor(Math.random() * 4)],
            pollutants: {
              pm25: Math.floor(Math.random() * 50) + 5,
              pm10: Math.floor(Math.random() * 100) + 10,
              o3: Math.floor(Math.random() * 60) + 20,
              no2: Math.floor(Math.random() * 40) + 10,
            },
          },
          roadDevelopment: {
            totalRoads: Math.floor(Math.random() * 500) + 100,
            mainRoads: Math.floor(Math.random() * 50) + 10,
            localRoads: Math.floor(Math.random() * 450) + 90,
            condition: ["Excellent", "Good", "Fair", "Poor"][Math.floor(Math.random() * 4)],
            congestionLevel: Math.floor(Math.random() * 100),
          },
        })
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      setData(null)
    }
  }, [isLoading, location])

  if (!location && !isLoading) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="population">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="population">Population</TabsTrigger>
            <TabsTrigger value="airQuality">Air Quality</TabsTrigger>
            <TabsTrigger value="roadDevelopment">Road Development</TabsTrigger>
          </TabsList>

          <TabsContent value="population" className="mt-4">
            {isLoading || !data ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Population Statistics</h4>
                    <p className="text-sm text-muted-foreground">Demographic data for {location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Population</div>
                    <div className="text-2xl font-bold mt-1">{data.population.total.toLocaleString()}</div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Population Density</div>
                    <div className="text-2xl font-bold mt-1">{data.population.density.toLocaleString()} /km²</div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Annual Growth</div>
                    <div className="text-2xl font-bold mt-1">{data.population.growth}%</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Population Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    This area has a {data.population.density > 3000 ? "high" : "moderate"} population density with a{" "}
                    {Number.parseFloat(data.population.growth) > 2.5 ? "rapid" : "steady"} growth rate. The demographic
                    distribution suggests a {Math.random() > 0.5 ? "younger" : "balanced"} population profile.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="airQuality" className="mt-4">
            {isLoading || !data ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Wind className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Air Quality Index</h4>
                    <p className="text-sm text-muted-foreground">Current air quality in {location}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-muted-foreground">AQI</div>
                    <div className="text-sm font-medium">{data.airQuality.rating}</div>
                  </div>
                  <Progress
                    value={data.airQuality.index}
                    max={300}
                    className={`h-3 ${
                      data.airQuality.index < 50
                        ? "bg-green-100"
                        : data.airQuality.index < 100
                          ? "bg-yellow-100"
                          : data.airQuality.index < 150
                            ? "bg-orange-100"
                            : "bg-red-100"
                    }`}
                  />
                  <div className="flex justify-between mt-1">
                    <div className="text-xs">Good</div>
                    <div className="text-xs">Hazardous</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">PM2.5</div>
                    <div className="text-xl font-bold mt-1">{data.airQuality.pollutants.pm25} µg/m³</div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">PM10</div>
                    <div className="text-xl font-bold mt-1">{data.airQuality.pollutants.pm10} µg/m³</div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Ozone (O₃)</div>
                    <div className="text-xl font-bold mt-1">{data.airQuality.pollutants.o3} ppb</div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Nitrogen Dioxide (NO₂)</div>
                    <div className="text-xl font-bold mt-1">{data.airQuality.pollutants.no2} ppb</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="roadDevelopment" className="mt-4">
            {isLoading || !data ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Road className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Road Infrastructure</h4>
                    <p className="text-sm text-muted-foreground">Transportation network in {location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Roads</div>
                    <div className="text-2xl font-bold mt-1">{data.roadDevelopment.totalRoads} km</div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Main Roads</div>
                    <div className="text-2xl font-bold mt-1">{data.roadDevelopment.mainRoads} km</div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Local Roads</div>
                    <div className="text-2xl font-bold mt-1">{data.roadDevelopment.localRoads} km</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Road Condition</div>
                    <div className="text-sm font-medium">{data.roadDevelopment.condition}</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Congestion Level</div>
                    <div className="text-sm font-medium">
                      {data.roadDevelopment.congestionLevel < 30
                        ? "Low"
                        : data.roadDevelopment.congestionLevel < 70
                          ? "Moderate"
                          : "High"}
                    </div>
                  </div>
                  <Progress
                    value={data.roadDevelopment.congestionLevel}
                    max={100}
                    className={`h-3 ${
                      data.roadDevelopment.congestionLevel < 30
                        ? "bg-green-100"
                        : data.roadDevelopment.congestionLevel < 70
                          ? "bg-yellow-100"
                          : "bg-red-100"
                    }`}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
