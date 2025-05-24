declare namespace H {
  namespace service {
    class Platform {
      constructor(options: { apikey: string })
      createDefaultLayers(): any
    }
  }

  namespace map {
    class Map {
      constructor(
        element: HTMLElement,
        layer: any,
        options: { zoom: number; center: { lat: number; lng: number }; pixelRatio: number },
      )
      addObject(object: any): void
      removeObject(object: any): void
      setBaseLayer(layer: any): void
      getViewPort(): any
      dispose(): void
    }

    class Marker {
      constructor(coords: { lat: number; lng: number })
    }
  }

  namespace mapevents {
    class MapEvents {
      constructor(map: H.map.Map)
    }

    class Behavior {
      constructor(mapEvents: MapEvents)
    }
  }

  namespace ui {
    class UI {
      static createDefault(map: H.map.Map, layers: any): UI
    }
  }
}

interface Window {
  H: typeof H
}
