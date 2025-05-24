"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data for history
const historyItems = [
  {
    id: 1,
    location: "New York City, NY",
    date: "2023-05-15",
    coordinates: [40.7128, -74.006],
  },
  {
    id: 2,
    location: "San Francisco, CA",
    date: "2023-05-10",
    coordinates: [37.7749, -122.4194],
  },
  {
    id: 3,
    location: "Chicago, IL",
    date: "2023-05-05",
    coordinates: [41.8781, -87.6298],
  },
]

export default function History() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Analysis History</h1>
          <p className="text-muted-foreground">View your previous location analyses and reports.</p>
        </div>

        <div className="grid gap-6">
          {historyItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{item.location}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Coordinates</div>
                      <div className="font-medium">
                        {item.coordinates[0].toFixed(4)}, {item.coordinates[1].toFixed(4)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Analysis Date</div>
                      <div className="font-medium">{new Date(item.date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard?location=${encodeURIComponent(item.location)}&lat=${item.coordinates[0]}&lng=${item.coordinates[1]}`}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    View Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {historyItems.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-4">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No analysis history</h3>
                <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                  You haven&apos;t analyzed any locations yet. Go to the dashboard to analyze your first location.
                </p>
                <Link href="/dashboard" className="mt-4">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Go to Dashboard
                  </button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
