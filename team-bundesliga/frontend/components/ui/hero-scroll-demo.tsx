"use client"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { MapDemo } from "@/components/ui/demo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Analyze Locations with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                AI-Powered Precision
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Get comprehensive insights on any location with satellite imagery, construction mapping, population data,
              air quality metrics, and road development analysis.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="group bg-purple-600 text-white hover:bg-purple-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="text-purple-600 hover:bg-purple-50">
                  Learn More
                </Button>
              </Link>
            </div>
          </>
        }
      >
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-grid-white/10"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-full flex items-center justify-center">
              <MapDemo coordinates={[40.7589, -73.9851]} location="New York City" />
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  )
}
