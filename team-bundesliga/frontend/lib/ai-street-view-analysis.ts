export interface StreetViewDetectedObject {
  id: string
  type: "building" | "pedestrian" | "vehicle" | "infrastructure" | "vegetation"
  subtype?: string
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence: number
  properties: Record<string, any>
  distance?: number
}

export interface StreetViewYOLOResult {
  buildings: StreetViewDetectedObject[]
  pedestrians: StreetViewDetectedObject[]
  vehicles: StreetViewDetectedObject[]
  infrastructure: StreetViewDetectedObject[]
  vegetation: StreetViewDetectedObject[]
  totalObjects: number
  processingTime: number
  confidence: number
  imageProcessed: boolean
}

export interface StreetViewAnalysisResult {
  yoloDetection: StreetViewYOLOResult
  analysis: {
    urbanDensity: "low" | "medium" | "high"
    trafficLevel: "light" | "moderate" | "heavy"
    pedestrianActivity: "low" | "moderate" | "high"
    buildingTypes: string[]
    infrastructureQuality: "poor" | "fair" | "good" | "excellent"
    timeOfDay: "morning" | "afternoon" | "evening" | "night"
    weatherConditions: "clear" | "cloudy" | "rainy" | "foggy"
  }
  metadata: {
    location: string
    coordinates: [number, number]
    heading: number
    pitch: number
    timestamp: number
  }
}

// Simulate YOLO-like object detection for Google Street View
export async function analyzeStreetViewWithAI(
  location: string,
  coordinates: [number, number],
  heading = 0,
  pitch = 0,
): Promise<StreetViewAnalysisResult> {
  const startTime = Date.now()

  try {
    console.log(`Starting Google Street View YOLO analysis for ${location} at heading ${heading}°, pitch ${pitch}°`)

    // Generate street view objects based on location, heading, and pitch
    const streetViewObjects = generateStreetViewObjects(location, coordinates, heading, pitch)

    const processingTime = Date.now() - startTime

    // Create the analysis result
    const result: StreetViewAnalysisResult = {
      yoloDetection: {
        buildings: streetViewObjects.buildings,
        pedestrians: streetViewObjects.pedestrians,
        vehicles: streetViewObjects.vehicles,
        infrastructure: streetViewObjects.infrastructure,
        vegetation: streetViewObjects.vegetation,
        totalObjects: streetViewObjects.totalObjects,
        processingTime,
        confidence: 0.94, // Higher confidence with Google Street View
        imageProcessed: true,
      },
      analysis: {
        urbanDensity: determineUrbanDensity(streetViewObjects),
        trafficLevel: determineTrafficLevel(streetViewObjects.vehicles.length),
        pedestrianActivity: determinePedestrianActivity(streetViewObjects.pedestrians.length),
        buildingTypes: extractBuildingTypes(streetViewObjects.buildings),
        infrastructureQuality: determineInfrastructureQuality(streetViewObjects.infrastructure),
        timeOfDay: determineTimeOfDay(),
        weatherConditions: determineWeatherConditions(),
      },
      metadata: {
        location,
        coordinates,
        heading,
        pitch,
        timestamp: Date.now(),
      },
    }

    console.log(`Google Street View analysis completed in ${processingTime}ms`)
    console.log(`Detected ${result.yoloDetection.totalObjects} objects`)

    return result
  } catch (error) {
    console.error("Google Street View Analysis Error:", error)
    throw new Error(`Failed to analyze street view: ${error.message}`)
  }
}

// Generate realistic street view objects based on location, heading, and pitch
function generateStreetViewObjects(location: string, coordinates: [number, number], heading: number, pitch: number) {
  // Determine location characteristics
  const isUrban = isUrbanLocation(location)
  const isCommercial = isCommercialLocation(location)
  const isResidential = isResidentialLocation(location)

  // Base object counts adjusted for location type and viewing angle
  const objectCounts = {
    buildings: isUrban ? 5 : 3,
    pedestrians: isUrban ? (isCommercial ? 10 : 6) : 2,
    vehicles: isUrban ? (isCommercial ? 8 : 4) : 3,
    infrastructure: isUrban ? 7 : 4,
    vegetation: isUrban ? 4 : 8,
  }

  // Adjust counts based on pitch (looking up shows more buildings, looking down shows more ground objects)
  const pitchFactor = (pitch + 90) / 180 // Normalize pitch to 0-1
  objectCounts.buildings = Math.floor(objectCounts.buildings * (0.5 + pitchFactor))
  objectCounts.pedestrians = Math.floor(objectCounts.pedestrians * (1.5 - pitchFactor))
  objectCounts.vehicles = Math.floor(objectCounts.vehicles * (1.2 - pitchFactor * 0.4))

  // Add some randomness based on heading
  const headingFactor = (Math.sin((heading / 180) * Math.PI) + 1) / 2

  Object.keys(objectCounts).forEach((key) => {
    const variance = objectCounts[key as keyof typeof objectCounts] * 0.4
    objectCounts[key as keyof typeof objectCounts] += Math.floor((headingFactor - 0.5) * variance)
    objectCounts[key as keyof typeof objectCounts] = Math.max(0, objectCounts[key as keyof typeof objectCounts])
  })

  // Generate objects with improved positioning for panoramic view
  const buildings = generatePanoramicBuildingObjects(objectCounts.buildings, isCommercial, isResidential, pitch)
  const pedestrians = generatePanoramicPedestrianObjects(objectCounts.pedestrians, pitch)
  const vehicles = generatePanoramicVehicleObjects(objectCounts.vehicles, pitch)
  const infrastructure = generatePanoramicInfrastructureObjects(objectCounts.infrastructure, isUrban, pitch)
  const vegetation = generatePanoramicVegetationObjects(objectCounts.vegetation, isUrban, pitch)

  const totalObjects =
    buildings.length + pedestrians.length + vehicles.length + infrastructure.length + vegetation.length

  return {
    buildings,
    pedestrians,
    vehicles,
    infrastructure,
    vegetation,
    totalObjects,
  }
}

// Helper functions for location characteristics
function isUrbanLocation(location: string): boolean {
  const urbanKeywords = ["city", "downtown", "urban", "metro", "manhattan", "center", "square", "avenue"]
  return urbanKeywords.some((keyword) => location.toLowerCase().includes(keyword))
}

function isCommercialLocation(location: string): boolean {
  const commercialKeywords = ["mall", "shopping", "business", "commercial", "store", "market", "plaza"]
  return commercialKeywords.some((keyword) => location.toLowerCase().includes(keyword))
}

function isResidentialLocation(location: string): boolean {
  const residentialKeywords = ["residential", "neighborhood", "suburb", "housing", "homes", "street"]
  return residentialKeywords.some((keyword) => location.toLowerCase().includes(keyword))
}

// Generate building objects optimized for panoramic street view
function generatePanoramicBuildingObjects(
  count: number,
  isCommercial: boolean,
  isResidential: boolean,
  pitch: number,
): StreetViewDetectedObject[] {
  const buildings: StreetViewDetectedObject[] = []

  // Building types based on location
  let buildingTypes: string[]
  if (isCommercial) {
    buildingTypes = ["storefront", "office_building", "restaurant", "hotel", "retail", "bank"]
  } else if (isResidential) {
    buildingTypes = ["apartment", "house", "townhouse", "residential", "condo"]
  } else {
    buildingTypes = ["mixed_use", "office_building", "institutional", "industrial", "government"]
  }

  // Canvas dimensions for panoramic view
  const canvasWidth = 800
  const canvasHeight = 500

  for (let i = 0; i < count; i++) {
    // Buildings in panoramic view are distributed across the horizontal field
    const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)]

    // Adjust building size based on pitch
    const pitchMultiplier = Math.max(0.3, 1 + pitch / 90)
    const baseHeight = 120 + Math.random() * 180
    const height = baseHeight * pitchMultiplier
    const width = 80 + Math.random() * 200

    // Position buildings across the panoramic view
    const x = (i / count) * canvasWidth + (Math.random() - 0.5) * 100
    const y = Math.max(0, canvasHeight / 2 - height + Math.random() * 80)

    // Building properties enhanced for street view
    const properties: Record<string, any> = {
      buildingType,
      stories: Math.floor(2 + Math.random() * 15),
      hasEntrance: Math.random() > 0.2,
      material: ["brick", "concrete", "glass", "stone", "wood", "steel"][Math.floor(Math.random() * 6)],
      condition: ["poor", "fair", "good", "excellent"][Math.floor(Math.random() * 4)],
      hasSignage:
        buildingType.includes("store") || buildingType.includes("restaurant")
          ? Math.random() > 0.1
          : Math.random() > 0.7,
      architecturalStyle: ["modern", "classical", "contemporary", "traditional"][Math.floor(Math.random() * 4)],
    }

    buildings.push({
      id: `building_${i}`,
      type: "building",
      subtype: buildingType,
      boundingBox: {
        x: Math.max(0, Math.min(canvasWidth - width, x)),
        y: Math.max(0, y),
        width,
        height,
      },
      confidence: 0.88 + Math.random() * 0.11,
      properties,
      distance: 5 + Math.random() * 25,
    })
  }

  return buildings
}

// Generate pedestrian objects for panoramic view
function generatePanoramicPedestrianObjects(count: number, pitch: number): StreetViewDetectedObject[] {
  const pedestrians: StreetViewDetectedObject[] = []

  // Canvas dimensions
  const canvasWidth = 800
  const canvasHeight = 500

  // Pedestrian types
  const pedestrianTypes = ["walking", "standing", "sitting", "cycling", "jogging", "waiting"]

  for (let i = 0; i < count; i++) {
    // Adjust pedestrian visibility based on pitch
    if (pitch > 30 && Math.random() > 0.6) continue // Less visible when looking up

    // Pedestrian dimensions
    const baseHeight = 60 + Math.random() * 80
    const height = baseHeight * Math.max(0.5, 1 - pitch / 180)
    const width = height / 3.5

    // Position pedestrians realistically in street view
    const x = Math.random() * (canvasWidth - width)
    const y = canvasHeight - height - Math.random() * 50

    // Enhanced pedestrian properties
    const pedestrianType = pedestrianTypes[Math.floor(Math.random() * pedestrianTypes.length)]
    const properties: Record<string, any> = {
      activity: pedestrianType,
      isGroup: Math.random() > 0.75,
      hasBackpack: Math.random() > 0.6,
      direction: ["towards", "away", "crossing", "parallel"][Math.floor(Math.random() * 4)],
      clothing: ["casual", "business", "athletic", "formal"][Math.floor(Math.random() * 4)],
      age: ["child", "adult", "elderly"][Math.floor(Math.random() * 3)],
    }

    pedestrians.push({
      id: `pedestrian_${i}`,
      type: "pedestrian",
      subtype: pedestrianType,
      boundingBox: {
        x,
        y,
        width,
        height,
      },
      confidence: 0.78 + Math.random() * 0.2,
      properties,
      distance: 1 + Math.random() * 20,
    })
  }

  return pedestrians
}

// Generate vehicle objects for panoramic view
function generatePanoramicVehicleObjects(count: number, pitch: number): StreetViewDetectedObject[] {
  const vehicles: StreetViewDetectedObject[] = []

  // Canvas dimensions
  const canvasWidth = 800
  const canvasHeight = 500

  // Vehicle types
  const vehicleTypes = ["car", "truck", "bus", "motorcycle", "taxi", "delivery_van", "suv", "bicycle"]

  for (let i = 0; i < count; i++) {
    // Vehicle type
    const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]

    // Vehicle dimensions based on type and pitch
    let baseWidth: number
    let baseHeight: number

    switch (vehicleType) {
      case "truck":
      case "bus":
        baseWidth = 100 + Math.random() * 80
        baseHeight = 60 + Math.random() * 40
        break
      case "motorcycle":
      case "bicycle":
        baseWidth = 40 + Math.random() * 30
        baseHeight = 40 + Math.random() * 30
        break
      default: // car, taxi, delivery_van, suv
        baseWidth = 70 + Math.random() * 50
        baseHeight = 45 + Math.random() * 25
    }

    // Adjust size based on pitch
    const pitchFactor = Math.max(0.4, 1 - Math.abs(pitch) / 180)
    const width = baseWidth * pitchFactor
    const height = baseHeight * pitchFactor

    // Position vehicles on the road
    const x = Math.random() * (canvasWidth - width)
    const y = canvasHeight - height - Math.random() * 30

    // Enhanced vehicle properties
    const properties: Record<string, any> = {
      vehicleType,
      color: ["red", "blue", "black", "white", "silver", "gray", "green", "yellow"][Math.floor(Math.random() * 8)],
      direction: ["towards", "away", "parked", "turning"][Math.floor(Math.random() * 4)],
      isMoving: Math.random() > 0.25,
      hasLights: Math.random() > 0.7,
      condition: ["poor", "fair", "good", "excellent"][Math.floor(Math.random() * 4)],
    }

    vehicles.push({
      id: `vehicle_${i}`,
      type: "vehicle",
      subtype: vehicleType,
      boundingBox: {
        x,
        y,
        width,
        height,
      },
      confidence: 0.82 + Math.random() * 0.16,
      properties,
      distance: 2 + Math.random() * 25,
    })
  }

  return vehicles
}

// Generate infrastructure objects for panoramic view
function generatePanoramicInfrastructureObjects(
  count: number,
  isUrban: boolean,
  pitch: number,
): StreetViewDetectedObject[] {
  const infrastructure: StreetViewDetectedObject[] = []

  // Canvas dimensions
  const canvasWidth = 800
  const canvasHeight = 500

  // Infrastructure types based on urban/rural setting
  let infraTypes: string[]
  if (isUrban) {
    infraTypes = [
      "traffic_light",
      "street_sign",
      "bus_stop",
      "bench",
      "trash_can",
      "street_lamp",
      "fire_hydrant",
      "crosswalk",
      "parking_meter",
    ]
  } else {
    infraTypes = ["street_sign", "utility_pole", "mailbox", "fence", "street_lamp", "stop_sign"]
  }

  for (let i = 0; i < count; i++) {
    // Infrastructure type
    const infraType = infraTypes[Math.floor(Math.random() * infraTypes.length)]

    // Dimensions and position based on type and pitch
    let width: number
    let height: number
    let x: number
    let y: number

    switch (infraType) {
      case "traffic_light":
        width = 25 + Math.random() * 15
        height = 80 + Math.random() * 40
        x = Math.random() * (canvasWidth - width)
        y = 30 + Math.random() * 100
        break
      case "street_lamp":
        width = 15 + Math.random() * 10
        height = 120 + Math.random() * 80
        x = 50 + Math.random() * (canvasWidth - 100)
        y = 10 + Math.random() * 50
        break
      case "utility_pole":
        width = 12 + Math.random() * 8
        height = 180 + Math.random() * 120
        x = 100 + Math.random() * (canvasWidth - 200)
        y = 0
        break
      default: // street_sign, bus_stop, bench, trash_can, fire_hydrant, mailbox, fence, crosswalk, parking_meter, stop_sign
        width = 25 + Math.random() * 50
        height = 40 + Math.random() * 60
        x = Math.random() * (canvasWidth - width)
        y = canvasHeight - height - Math.random() * 100
    }

    // Adjust based on pitch
    if (pitch > 20) {
      height *= 1.2 // Taller objects more visible when looking up
    }

    // Enhanced infrastructure properties
    const properties: Record<string, any> = {
      infraType,
      material: ["metal", "plastic", "concrete", "wood", "aluminum"][Math.floor(Math.random() * 5)],
      condition: ["poor", "fair", "good", "excellent"][Math.floor(Math.random() * 4)],
      hasText: infraType.includes("sign") ? Math.random() > 0.1 : Math.random() > 0.8,
      isIlluminated: ["traffic_light", "street_lamp"].includes(infraType) ? Math.random() > 0.2 : false,
    }

    infrastructure.push({
      id: `infrastructure_${i}`,
      type: "infrastructure",
      subtype: infraType,
      boundingBox: {
        x: Math.max(0, Math.min(canvasWidth - width, x)),
        y: Math.max(0, Math.min(canvasHeight - height, y)),
        width,
        height,
      },
      confidence: 0.76 + Math.random() * 0.22,
      properties,
      distance: 1 + Math.random() * 15,
    })
  }

  return infrastructure
}

// Generate vegetation objects for panoramic view
function generatePanoramicVegetationObjects(
  count: number,
  isUrban: boolean,
  pitch: number,
): StreetViewDetectedObject[] {
  const vegetation: StreetViewDetectedObject[] = []

  // Canvas dimensions
  const canvasWidth = 800
  const canvasHeight = 500

  // Vegetation types
  let vegTypes: string[]
  if (isUrban) {
    vegTypes = ["street_tree", "planter", "small_bush", "flower_bed", "hedge", "lawn"]
  } else {
    vegTypes = ["tree", "bush", "grass", "forest", "hedge", "wildflowers"]
  }

  for (let i = 0; i < count; i++) {
    // Vegetation type
    const vegType = vegTypes[Math.floor(Math.random() * vegTypes.length)]

    // Dimensions and position based on type and pitch
    let width: number
    let height: number
    let x: number
    let y: number

    switch (vegType) {
      case "tree":
      case "street_tree":
        width = 60 + Math.random() * 120
        height = 120 + Math.random() * 250
        x = Math.random() > 0.5 ? Math.random() * 150 : canvasWidth - width - Math.random() * 150
        y = Math.max(0, canvasHeight / 2 - height)
        break
      case "forest":
        width = 250 + Math.random() * 300
        height = 180 + Math.random() * 150
        x = Math.random() > 0.5 ? -100 : canvasWidth - width + 100
        y = 30 + Math.random() * 100
        break
      default: // bush, grass, planter, small_bush, flower_bed, hedge, lawn, wildflowers
        width = 40 + Math.random() * 80
        height = 25 + Math.random() * 60
        x = Math.random() * (canvasWidth - width)
        y = canvasHeight - height - Math.random() * 80
    }

    // Adjust based on pitch
    if (pitch < -20) {
      height *= 0.7 // Ground vegetation less visible when looking down
    }

    // Enhanced vegetation properties
    const properties: Record<string, any> = {
      vegType,
      size: ["small", "medium", "large"][Math.floor(Math.random() * 3)],
      health: ["poor", "fair", "good", "excellent"][Math.floor(Math.random() * 4)],
      season: ["spring", "summer", "fall", "winter"][Math.floor(Math.random() * 4)],
      hasFlowers: ["flower_bed", "wildflowers"].includes(vegType) ? true : Math.random() > 0.7,
    }

    vegetation.push({
      id: `vegetation_${i}`,
      type: "vegetation",
      subtype: vegType,
      boundingBox: {
        x: Math.max(0, Math.min(canvasWidth - width, x)),
        y: Math.max(0, Math.min(canvasHeight - height, y)),
        width,
        height,
      },
      confidence: 0.72 + Math.random() * 0.26,
      properties,
      distance: 1 + Math.random() * 20,
    })
  }

  return vegetation
}

// Enhanced analysis helper functions
function determineUrbanDensity(objects: any): "low" | "medium" | "high" {
  const totalObjects = objects.totalObjects
  const buildingCount = objects.buildings.length
  const infrastructureCount = objects.infrastructure.length

  if (buildingCount >= 5 || infrastructureCount >= 6 || totalObjects >= 20) return "high"
  if (buildingCount >= 3 || infrastructureCount >= 4 || totalObjects >= 12) return "medium"
  return "low"
}

function determineTrafficLevel(vehicleCount: number): "light" | "moderate" | "heavy" {
  if (vehicleCount >= 6) return "heavy"
  if (vehicleCount >= 3) return "moderate"
  return "light"
}

function determinePedestrianActivity(pedestrianCount: number): "low" | "moderate" | "high" {
  if (pedestrianCount >= 8) return "high"
  if (pedestrianCount >= 4) return "moderate"
  return "low"
}

function extractBuildingTypes(buildings: StreetViewDetectedObject[]): string[] {
  const types = new Set<string>()

  buildings.forEach((building) => {
    if (building.subtype) {
      types.add(building.subtype)
    }
  })

  return Array.from(types)
}

function determineInfrastructureQuality(
  infrastructure: StreetViewDetectedObject[],
): "poor" | "fair" | "good" | "excellent" {
  if (infrastructure.length === 0) return "fair"

  // Calculate average condition
  let totalScore = 0
  const conditionScores: Record<string, number> = {
    poor: 1,
    fair: 2,
    good: 3,
    excellent: 4,
  }

  infrastructure.forEach((item) => {
    totalScore += conditionScores[item.properties.condition || "fair"]
  })

  const averageScore = totalScore / infrastructure.length

  if (averageScore >= 3.5) return "excellent"
  if (averageScore >= 2.5) return "good"
  if (averageScore >= 1.5) return "fair"
  return "poor"
}

function determineTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours()

  if (hour >= 6 && hour < 12) return "morning"
  if (hour >= 12 && hour < 17) return "afternoon"
  if (hour >= 17 && hour < 21) return "evening"
  return "night"
}

function determineWeatherConditions(): "clear" | "cloudy" | "rainy" | "foggy" {
  // Simulate weather detection based on random factors
  const conditions = ["clear", "cloudy", "rainy", "foggy"]
  const weights = [0.5, 0.3, 0.15, 0.05] // Clear weather is most common

  const random = Math.random()
  let cumulativeWeight = 0

  for (let i = 0; i < conditions.length; i++) {
    cumulativeWeight += weights[i]
    if (random <= cumulativeWeight) {
      return conditions[i] as "clear" | "cloudy" | "rainy" | "foggy"
    }
  }

  return "clear"
}
