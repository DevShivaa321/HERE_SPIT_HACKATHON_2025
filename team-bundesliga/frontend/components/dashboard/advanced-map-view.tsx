"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Building,
  TreePine,
  Waves,
  RouteIcon as Road,
  Download,
  Eye,
  EyeOff,
  Zap,
  Car,
  Map,
} from "lucide-react"
import { analyzeLocationWithAI, type MapAnalysisResult } from "@/lib/ai-map-analysis"
import { HereMap } from "@/components/ui/here-map"

interface AdvancedMapViewProps {
  location: string
  coordinates: [number, number]
  isLoading: boolean
}

export function AdvancedMapView({ location, coordinates, isLoading }: AdvancedMapViewProps) {
  const [activeTab, setActiveTab] = useState("demo")
  const [analysisData, setAnalysisData] = useState<MapAnalysisResult | null>(null)
  const [layerVisibility, setLayerVisibility] = useState({
    buildings: true,
    roads: true,
    vegetation: true,
    water: true,
    vehicles: true,
    infrastructure: true,
  })
  const [hereMap, setHereMap] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isLoading && coordinates && location) {
      // Start AI analysis with HERE Maps data
      analyzeLocationWithAI(location, coordinates).then(setAnalysisData).catch(console.error)
    }
  }, [isLoading, coordinates, location])

  useEffect(() => {
    if (analysisData && canvasRef.current && hereMap) {
      drawYOLODetections()
    }
  }, [analysisData, layerVisibility, hereMap])

  const drawYOLODetections = () => {
    const canvas = canvasRef.current
    if (!canvas || !analysisData || !hereMap) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw YOLO detections
    const drawDetections = (objects: any[], color: string, type: string) => {
      if (!layerVisibility[type as keyof typeof layerVisibility]) return

      objects.forEach((obj) => {
        // Convert geo coordinates to screen coordinates
        try {
          const screenPoint = hereMap.geoToScreen(new window.H.geo.Point(obj.coordinates[0], obj.coordinates[1]))

          if (screenPoint) {
            // Draw bounding box
            ctx.strokeStyle = color
            ctx.lineWidth = 2
            ctx.strokeRect(
              screenPoint.x - obj.boundingBox.width / 2,
              screenPoint.y - obj.boundingBox.height / 2,
              obj.boundingBox.width / 4,
              obj.boundingBox.height / 4,
            )

            // Draw confidence score
            ctx.fillStyle = color
            ctx.font = "10px Arial"
            ctx.fillText(
              `${(obj.confidence * 100).toFixed(0)}%`,
              screenPoint.x - 15,
              screenPoint.y - obj.boundingBox.height / 2 - 5,
            )

            // Draw object type
            ctx.fillText(obj.subtype || type, screenPoint.x - 20, screenPoint.y + obj.boundingBox.height / 2 + 15)
          }
        } catch (error) {
          // Silently handle coordinate conversion errors
        }
      })
    }

    if (analysisData.yoloDetection) {
      drawDetections(analysisData.yoloDetection.buildings, "#8B5CF6", "buildings")
      drawDetections(analysisData.yoloDetection.roads, "#F59E0B", "roads")
      drawDetections(analysisData.yoloDetection.trees, "#10B981", "vegetation")
      drawDetections(analysisData.yoloDetection.water, "#3B82F6", "water")
      drawDetections(analysisData.yoloDetection.vehicles, "#EF4444", "vehicles")
      drawDetections(analysisData.yoloDetection.infrastructure, "#6B7280", "infrastructure")
    }
  }

  const toggleLayer = (layer: keyof typeof layerVisibility) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  const handleMapReady = (map: any) => {
    setHereMap(map)
  }

  if (!location && !isLoading) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No location selected</h3>
          <p className="text-sm text-muted-foreground mt-2">Enter a location above to generate an AI analysis</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            {isLoading ? <Skeleton className="h-6 w-40" /> : location}
            {analysisData && (
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Map className="h-3 w-3 mr-1" />
                  HERE Maps
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs defaultValue="demo" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="demo" className="text-xs md:text-sm">
              Live Map
            </TabsTrigger>
            <TabsTrigger value="satellite" className="text-xs md:text-sm">
              Satellite
            </TabsTrigger>
            <TabsTrigger value="enhanced" className="text-xs md:text-sm">
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs md:text-sm">
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="mt-4">
            <div className="w-full h-[400px] md:h-[500px] rounded-md overflow-hidden">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <HereMap
                  theme="light"
                  center={coordinates}
                  zoom={15}
                  className="w-full h-full"
                  onMapReady={handleMapReady}
                />
              )}
            </div>
            {!isLoading && (
              <div className="mt-2 text-xs text-muted-foreground text-center">
                Live HERE Maps data • Interactive map with real-time information
              </div>
            )}
          </TabsContent>

          <TabsContent value="satellite" className="mt-4">
            {isLoading ? (
              <Skeleton className="w-full h-[400px] md:h-[500px]" />
            ) : (
              <div className="w-full h-[400px] md:h-[500px] rounded-md overflow-hidden">
                <HereMap theme="satellite" center={coordinates} zoom={16} className="w-full h-full" />
              </div>
            )}
            {!isLoading && (
              <div className="mt-2 text-xs text-muted-foreground text-center">
                HERE Maps satellite imagery • High-resolution aerial view
              </div>
            )}
          </TabsContent>

          <TabsContent value="enhanced" className="mt-4">
            {isLoading ? (
              <Skeleton className="w-full h-[400px] md:h-[500px]" />
            ) : (
              <div className="space-y-4">
                {/* HERE Maps + AI Detection Info */}
                {analysisData?.yoloDetection && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Map className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">HERE Maps + AI Object Detection</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>Objects: {analysisData.yoloDetection.totalObjects}</div>
                      <div>Confidence: {(analysisData.yoloDetection.confidence * 100).toFixed(1)}%</div>
                      <div>Processing: {analysisData.yoloDetection.processingTime}ms</div>
                      <div>Data Source: HERE Maps API</div>
                    </div>
                  </div>
                )}

                {/* Layer Controls */}
                <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                  <Button
                    variant={layerVisibility.buildings ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer("buildings")}
                    className="text-xs"
                  >
                    {layerVisibility.buildings ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    <Building className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Buildings</span>
                  </Button>
                  <Button
                    variant={layerVisibility.roads ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer("roads")}
                    className="text-xs"
                  >
                    {layerVisibility.roads ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    <Road className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Roads</span>
                  </Button>
                  <Button
                    variant={layerVisibility.vegetation ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer("vegetation")}
                    className="text-xs"
                  >
                    {layerVisibility.vegetation ? (
                      <Eye className="h-3 w-3 mr-1" />
                    ) : (
                      <EyeOff className="h-3 w-3 mr-1" />
                    )}
                    <TreePine className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Trees</span>
                  </Button>
                  <Button
                    variant={layerVisibility.water ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer("water")}
                    className="text-xs"
                  >
                    {layerVisibility.water ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    <Waves className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Water</span>
                  </Button>
                  <Button
                    variant={layerVisibility.vehicles ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer("vehicles")}
                    className="text-xs"
                  >
                    {layerVisibility.vehicles ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    <Car className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Vehicles</span>
                  </Button>
                </div>

                {/* Enhanced Map with AI Overlay */}
                <div className="relative w-full h-[400px] md:h-[500px]">
                  <HereMap
                    theme="satellite"
                    center={coordinates}
                    zoom={18}
                    className="w-full h-full absolute inset-0"
                    onMapReady={handleMapReady}
                  />
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="w-full h-full absolute inset-0 z-10 pointer-events-none"
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  AI object detection overlaid on HERE Maps satellite imagery
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            {isLoading || !analysisData ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* HERE Maps Data Source Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Map className="h-4 w-4 text-blue-600" />
                    Data Sources
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Geocoding:</span> HERE Maps API
                    </div>
                    <div>
                      <span className="font-medium">Places:</span> HERE Places API
                    </div>
                    <div>
                      <span className="font-medium">Routing:</span> HERE Routing API
                    </div>
                  </div>
                </div>

                {/* AI Detection Summary */}
                {analysisData.yoloDetection && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        Buildings
                      </h4>
                      <p className="text-2xl font-bold text-purple-800">
                        {analysisData.yoloDetection.buildings.length}
                      </p>
                      <p className="text-xs text-purple-600">
                        Avg. confidence:{" "}
                        {(
                          (analysisData.yoloDetection.buildings.reduce((acc, b) => acc + b.confidence, 0) /
                            analysisData.yoloDetection.buildings.length) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <TreePine className="h-4 w-4 text-green-600" />
                        Trees
                      </h4>
                      <p className="text-2xl font-bold text-green-800">{analysisData.yoloDetection.trees.length}</p>
                      <p className="text-xs text-green-600">
                        Coverage:{" "}
                        {(
                          (analysisData.yoloDetection.trees.length / analysisData.yoloDetection.totalObjects) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Road className="h-4 w-4 text-blue-600" />
                        Roads
                      </h4>
                      <p className="text-2xl font-bold text-blue-800">{analysisData.yoloDetection.roads.length}</p>
                      <p className="text-xs text-blue-600">Infrastructure density</p>
                    </div>

                    <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Waves className="h-4 w-4 text-cyan-600" />
                        Water Bodies
                      </h4>
                      <p className="text-2xl font-bold text-cyan-800">{analysisData.yoloDetection.water.length}</p>
                      <p className="text-xs text-cyan-600">Natural features</p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Car className="h-4 w-4 text-red-600" />
                        Vehicles
                      </h4>
                      <p className="text-2xl font-bold text-red-800">{analysisData.yoloDetection.vehicles.length}</p>
                      <p className="text-xs text-red-600">Traffic density</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gray-600" />
                        Infrastructure
                      </h4>
                      <p className="text-2xl font-bold text-gray-800">
                        {analysisData.yoloDetection.infrastructure.length}
                      </p>
                      <p className="text-xs text-gray-600">Utilities & structures</p>
                    </div>
                  </div>
                )}

                {/* Analysis Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Development Level</h4>
                    <p className="text-2xl font-bold capitalize">{analysisData.analysis.developmentLevel}</p>
                    <p className="text-xs text-muted-foreground">
                      Infrastructure Score: {analysisData.analysis.infrastructureScore}/100
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Environmental Score</h4>
                    <p className="text-2xl font-bold">{analysisData.analysis.environmentalScore}/100</p>
                    <p className="text-xs text-muted-foreground">
                      Air Quality Index: {analysisData.analysis.airQualityIndex}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
