"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Dumbbell,
  Target,
  Clock,
  Zap,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AboutYouPage() {
  const router = useRouter()
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null)

  const personas = [
    {
      id: "professionals",
      title: "Busy Professionals",
      icon: Briefcase,
      description: "Efficient workouts that fit your schedule",
    },
    {
      id: "students",
      title: "Students",
      icon: GraduationCap,
      description: "Flexible fitness around your studies",
    },
    {
      id: "parents",
      title: "Parents",
      icon: Heart,
      description: "Family-friendly wellness solutions",
    },
    {
      id: "beginners",
      title: "Fitness Beginners",
      icon: Users,
      description: "Start your journey with confidence",
    },
    {
      id: "athletes",
      title: "Experienced Athletes",
      icon: Dumbbell,
      description: "Advanced training optimization",
    },
    {
      id: "everyone",
      title: "Anyone Seeking Personalization",
      icon: Target,
      description: "Tailored plans for unique needs",
    },
  ]

  const whyItWorks = [
    {
      icon: Target,
      title: "Personalized Fitness Plans",
      description:
        "NuvioFit creates workouts tailored just for you — your goals, schedule, and energy levels. No more guessing or generic routines.",
    },
    {
      icon: Clock,
      title: "Built for Real Life",
      description: "Whether you have 15 minutes or an hour, NuvioFit adjusts your workouts to your needs.",
    },
    {
      icon: TrendingUp,
      title: "Coming Soon",
      description:
        "Nutrition, mindset coaching, and recovery guidance — all designed to fit seamlessly into your lifestyle.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-['Poppins'] leading-tight">
            It's All About{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">YOU</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Personalized wellness that fits your lifestyle, your goals, your day.
          </p>
        </div>

        {/* User Personas Section */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Made for Everyone</h2>

          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto pb-4 space-x-4 px-4 -mx-4">
              {personas.map((persona) => {
                const IconComponent = persona.icon
                return (
                  <Card
                    key={persona.id}
                    className="flex-shrink-0 w-48 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-blue-200"
                  >
                    <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">{persona.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{persona.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {personas.map((persona) => {
              const IconComponent = persona.icon
              return (
                <Card
                  key={persona.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
                    hoveredPersona === persona.id ? "border-blue-400 shadow-lg" : "hover:border-blue-200"
                  }`}
                  onMouseEnter={() => setHoveredPersona(persona.id)}
                  onMouseLeave={() => setHoveredPersona(null)}
                >
                  <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">{persona.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{persona.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Why It Works Section */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Why It Works</h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Content */}
            <div className="space-y-8">
              {whyItWorks.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right: Engaging Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 h-80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-3xl"></div>
                <div className="text-center z-10">
                  <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Perfect Plan</h3>
                  <p className="text-gray-600 max-w-xs mx-auto">
                    Tailored workouts that adapt to your life, not the other way around
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Block */}
        <Card className="mb-16 bg-gradient-to-r from-gray-50 to-blue-50 border-none shadow-lg max-w-4xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MK</span>
                </div>
              </div>

              {/* Content */}
              <div className="text-center md:text-left flex-1">
                <blockquote className="text-lg md:text-xl text-gray-700 italic mb-4 leading-relaxed">
                  "NuvioFit made fitness fit my busy life — finally a plan that listens to me."
                </blockquote>
                <div>
                  <p className="font-semibold text-gray-900">Maria K.</p>
                  <p className="text-sm text-gray-600">Working Mom & Marketing Director</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
            onClick={() => router.push("/questionnaire")}
          >
            See Your Personalized Plan
            <Zap className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Join thousands who've discovered fitness that actually fits their life
          </p>
        </div>
      </div>

      {/* Subtle Background Elements */}
      <div className="fixed top-1/4 left-4 w-16 h-16 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-4 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse delay-1000 pointer-events-none"></div>
    </div>
  )
}
