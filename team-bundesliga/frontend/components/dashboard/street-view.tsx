"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Building,
  User,
  Car,
  Zap,
  Map,
  Eye,
  EyeOff,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { analyzeStreetViewWithAI, type StreetViewAnalysisResult } from "@/lib/ai-street-view-analysis"
import { GoogleStreetView } from "@/components/ui/google-street-view"

interface StreetViewProps {
  location: string
  coordinates: [number, number]
  isLoading: boolean
}

export function StreetView({ location, coordinates, isLoading }: StreetViewProps) {
  const [analysisData, setAnalysisData] = useState<StreetViewAnalysisResult | null>(null)
  const [layerVisibility, setLayerVisibility] = useState({
    buildings: true,
    pedestrians: true,
    vehicles: true,
    infrastructure: true,
    vegetation: true,
  })
  const [googleStreetView, setGoogleStreetView] = useState<any>(null)
  const [heading, setHeading] = useState(0)
  const [pitch, setPitch] = useState(0)
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isLoading && coordinates && location) {
      // Start AI analysis with Google Street View data
      analyzeStreetViewWithAI(location, coordinates, heading, pitch).then(setAnalysisData).catch(console.error)
    }
  }, [isLoading, coordinates, location, heading, pitch])

  useEffect(() => {
    if (analysisData && canvasRef.current && googleStreetView) {
      drawYOLODetections()
    }
  }, [analysisData, layerVisibility, googleStreetView])

  const drawYOLODetections = () => {
    const canvas = canvasRef.current
    if (!canvas || !analysisData || !googleStreetView) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions to match container
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // Draw YOLO detections
    const drawDetections = (objects: any[], color: string, type: string) => {
      if (!layerVisibility[type as keyof typeof layerVisibility]) return

      objects.forEach((obj) => {
        // Scale bounding box to canvas size
        const scaleX = canvas.width / 800
        const scaleY = canvas.height / 500

        const x = obj.boundingBox.x * scaleX
        const y = obj.boundingBox.y * scaleY
        const width = obj.boundingBox.width * scaleX
        const height = obj.boundingBox.height * scaleY

        // Draw bounding box
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, width, height)

        // Draw confidence score
        ctx.fillStyle = color
        ctx.font = "12px Arial"
        ctx.fillText(`${(obj.confidence * 100).toFixed(0)}%`, x, y - 5)

        // Draw object type
        ctx.fillText(obj.subtype || type, x, y + height + 15)
      })
    }

    if (analysisData.yoloDetection) {
      drawDetections(analysisData.yoloDetection.buildings, "#8B5CF6", "buildings")
      drawDetections(analysisData.yoloDetection.pedestrians, "#10B981", "pedestrians")
      drawDetections(analysisData.yoloDetection.vehicles, "#EF4444", "vehicles")
      drawDetections(analysisData.yoloDetection.infrastructure, "#6B7280", "infrastructure")
      drawDetections(analysisData.yoloDetection.vegetation, "#84CC16", "vegetation")
    }
  }

  const toggleLayer = (layer: keyof typeof layerVisibility) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  const handleStreetViewReady = (streetView: any) => {
    setGoogleStreetView(streetView)
  }

  const rotateView = (degrees: number) => {
    setHeading((prev) => (prev + degrees + 360) % 360)
  }

  const adjustPitch = (degrees: number) => {
    setPitch((prev) => Math.max(-90, Math.min(90, prev + degrees)))
  }

  const adjustZoom = (delta: number) => {
    setZoom((prev) => Math.max(0, Math.min(5, prev + delta)))
  }

  if (!location && !isLoading) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No location selected</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Enter a location above to generate a street view analysis
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            {isLoading ? <Skeleton className="h-6 w-40" /> : `Street View: ${location}`}
            {analysisData && (
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Map className="h-3 w-3 mr-1" />
                  Google Street View
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
            )}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Google Street View + AI Detection Info */}
          {analysisData?.yoloDetection && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Map className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Google Street View AI Object Detection</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div>Objects: {analysisData.yoloDetection.totalObjects}</div>
                <div>Confidence: {(analysisData.yoloDetection.confidence * 100).toFixed(1)}%</div>
                <div>Processing: {analysisData.yoloDetection.processingTime}ms</div>
                <div>Heading: {heading}°</div>
                <div>Pitch: {pitch}°</div>
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
              variant={layerVisibility.pedestrians ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("pedestrians")}
              className="text-xs"
            >
              {layerVisibility.pedestrians ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
              <User className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">People</span>
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
            <Button
              variant={layerVisibility.infrastructure ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("infrastructure")}
              className="text-xs"
            >
              {layerVisibility.infrastructure ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
              <Zap className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Infrastructure</span>
            </Button>
          </div>

          {/* Navigation Controls */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-lg">
            {/* Rotation Controls */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium">Rotation</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => rotateView(-45)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => rotateView(180)}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => rotateView(45)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pitch Controls */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium">Pitch</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => adjustPitch(15)}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => adjustPitch(-15)}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium">Zoom</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => adjustZoom(1)}>
                  +
                </Button>
                <Button variant="outline" size="sm" onClick={() => adjustZoom(-1)}>
                  -
                </Button>
              </div>
            </div>
          </div>

          {/* Street View with AI Overlay */}
          <div className="relative w-full h-[400px] md:h-[500px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <>
                <GoogleStreetView
                  coordinates={coordinates}
                  heading={heading}
                  pitch={pitch}
                  zoom={zoom}
                  className="w-full h-full absolute inset-0"
                  onStreetViewReady={handleStreetViewReady}
                />
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-full absolute inset-0 z-10 pointer-events-none"
                />
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            AI object detection overlaid on Google Street View imagery
          </div>

          {/* Analysis Summary */}
          {analysisData && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  Buildings
                </h4>
                <p className="text-2xl font-bold text-purple-800">{analysisData.yoloDetection.buildings.length}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  People
                </h4>
                <p className="text-2xl font-bold text-green-800">{analysisData.yoloDetection.pedestrians.length}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Car className="h-4 w-4 text-red-600" />
                  Vehicles
                </h4>
                <p className="text-2xl font-bold text-red-800">{analysisData.yoloDetection.vehicles.length}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gray-600" />
                  Infrastructure
                </h4>
                <p className="text-2xl font-bold text-gray-800">{analysisData.yoloDetection.infrastructure.length}</p>
              </div>

              <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-lime-600" />
                  Vegetation
                </h4>
                <p className="text-2xl font-bold text-lime-800">{analysisData.yoloDetection.vegetation.length}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
