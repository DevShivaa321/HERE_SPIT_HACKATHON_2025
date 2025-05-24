import Link from "next/link"
import { HeroScrollDemo } from "@/components/ui/hero-scroll-demo"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Building, BarChart3 } from "lucide-react"
import { NavigationDock } from "@/components/ui/navigation-dock"

export default function Home() {
  return (
    <div className="scroll-smooth">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold">MapInsight AI</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Scroll Animation */}
        <HeroScrollDemo />

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50" data-scroll-section data-scroll-delay="0.15" data-scroll>
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                Powerful Location Analysis
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform provides comprehensive insights for urban planning, real estate development, and
                environmental monitoring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 animate-on-scroll">
                <div className="rounded-full bg-purple-100 p-3 w-fit mb-4">
                  <MapPin className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Satellite Imagery</h3>
                <p className="text-gray-600">
                  Access high-resolution satellite imagery of any location to get a clear view of the terrain and
                  existing structures.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 animate-on-scroll">
                <div className="rounded-full bg-purple-100 p-3 w-fit mb-4">
                  <Building className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Construction Mapping</h3>
                <p className="text-gray-600">
                  AI-enhanced maps showing all construction and development in the area with detailed annotations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 animate-on-scroll">
                <div className="rounded-full bg-purple-100 p-3 w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Comprehensive Analysis</h3>
                <p className="text-gray-600">
                  Get detailed reports on population density, air quality metrics, and road development status.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20" data-scroll-section data-scroll-delay="0.25" data-scroll>
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">How It Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform uses advanced AI to analyze locations and provide valuable insights in just a few simple
                steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-purple-50 p-8 rounded-xl shadow-md border border-purple-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-in-left">
                <div className="rounded-full bg-purple-100 p-4 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">Enter Location</h3>
                <p className="text-gray-600 text-center">
                  Simply enter any address or coordinates to begin the analysis process. Our system accepts various
                  formats including street addresses, landmarks, and GPS coordinates.
                </p>
              </div>

              <div className="bg-purple-50 p-8 rounded-xl shadow-md border border-purple-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in">
                <div className="rounded-full bg-purple-100 p-4 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">AI Processing</h3>
                <p className="text-gray-600 text-center">
                  Our AI analyzes satellite imagery and combines it with various data sources including government
                  databases, environmental reports, and real-time sensors to create a comprehensive analysis.
                </p>
              </div>

              <div className="bg-purple-50 p-8 rounded-xl shadow-md border border-purple-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-in-right">
                <div className="rounded-full bg-purple-100 p-4 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">Get Insights</h3>
                <p className="text-gray-600 text-center">
                  Receive comprehensive reports and visualizations about the location, including population data, air
                  quality metrics, construction mapping, and infrastructure development status.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-20 bg-gray-50"
          data-scroll-section
          data-scroll-delay="0.15"
          data-scroll
        >
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">What Our Users Say</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Trusted by urban planners, real estate developers, and environmental researchers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 animate-on-scroll">
                <p className="italic text-gray-600 mb-4">
                  "MapInsight AI has revolutionized how we approach urban development projects. The construction mapping
                  feature saved us months of manual survey work."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="font-semibold text-purple-600">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-600">Urban Planner</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 animate-on-scroll">
                <p className="italic text-gray-600 mb-4">
                  "The environmental analysis provided by MapInsight AI helped us identify optimal locations for our
                  sustainable housing project."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="font-semibold text-purple-600">JS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jane Smith</p>
                    <p className="text-sm text-gray-600">Real Estate Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20" data-scroll-section data-scroll-delay="0.05" data-scroll>
          <div className="container">
            <div className="bg-purple-50 rounded-lg p-8 md:p-12 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900">
                Ready to Analyze Your Location?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mb-8">
                Join thousands of professionals who use MapInsight AI for location analysis and planning.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="group bg-purple-600 text-white hover:bg-purple-700">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MapPin className="h-5 w-5 text-purple-500" />
            <span className="text-lg font-bold">MapInsight AI</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Contact Us
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-gray-600">
            © {new Date().getFullYear()} MapInsight AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Navigation Dock */}
      <NavigationDock />
    </div>
  )
}
