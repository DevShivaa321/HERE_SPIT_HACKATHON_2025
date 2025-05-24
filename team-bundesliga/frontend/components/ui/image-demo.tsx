"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageMapDemoProps {
  className?: string
}

export function ImageMapDemo({ className }: ImageMapDemoProps) {
  return (
    <div className={cn("relative flex size-full items-center justify-center overflow-hidden rounded-lg", className)}>
      <div className="relative w-full h-full">
        <Image
          src="/images/map-demo.png"
          alt="Map Analysis Demo"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      </div>
    </div>
  )
}
