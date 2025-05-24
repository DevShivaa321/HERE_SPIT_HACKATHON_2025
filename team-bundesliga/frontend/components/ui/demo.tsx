import { HereMap } from "@/components/ui/here-map"

interface MapDemoProps {
  coordinates?: [number, number]
  location?: string
}

export function MapDemo({ coordinates = [40.7128, -74.006], location }: MapDemoProps) {
  return (
    <div className="relative flex size-full max-w-5xl items-center justify-center overflow-hidden rounded-lg border bg-background shadow-xl">
      <div className="w-full h-full min-h-[300px] md:min-h-[500px]">
        <HereMap theme="dark" center={coordinates} zoom={14} className="w-full h-full" />
      </div>
    </div>
  )
}
