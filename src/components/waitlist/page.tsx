import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mail, User, Zap, MessageCircle, Lock, Instagram, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

export default function WaitlistPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-teal-50 to-blue-100">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-violet-400 to-teal-400 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-teal-600 bg-clip-text text-transparent mb-4">
                You're In! 🚀
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Welcome to the NuvioFit waitlist! We'll notify you the moment early access reopens.
              </p>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">What happens next?</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">You'll get an email confirmation shortly</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">We'll send exclusive content while you wait</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">You'll be first to know when spots open up</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-violet-500 to-teal-500 hover:from-violet-600 hover:to-teal-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-teal-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Headline Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
                You Just Missed It... 😔
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                But don't worry — the future of health is coming back soon.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Waitlist Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
              <CardContent className="p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Join the Waitlist 🚀</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We're opening up spots again soon for a few more people who want to transform their fitness with
                    NuvioFit's AI-driven coaching. Leave your email and you'll be the first to know.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Your name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-12 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-white/50"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      placeholder="Your email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-teal-400 focus:ring-teal-400 bg-white/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!email || isLoading}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-violet-500 to-teal-500 hover:from-violet-600 hover:to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Joining...
                      </div>
                    ) : (
                      "Join the Waitlist 🚀"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <div className="space-y-8">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">What You'll Get</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-teal-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">⚡ Instant Notifications</h4>
                        <p className="text-gray-600">Be the first to know when early access reopens</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">💬 Exclusive Content</h4>
                        <p className="text-gray-600">Get tips and insights from the NuvioFit team</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-violet-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">🔐 Hidden Perks</h4>
                        <p className="text-gray-600">Unlock special benefits when we launch paid plans</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reinforcement Section */}
              <Card className="bg-gradient-to-r from-violet-500/10 to-teal-500/10 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-teal-600 bg-clip-text text-transparent mb-4">
                    NuvioFit is More Than Fitness
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We're building the future of health — AI-generated workouts, smart coaching, integrated mindset
                    tracking, and deep personalization based on your energy, goals, and schedule. Join thousands who are
                    already transforming their lives with intelligent fitness technology.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 text-center">
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Follow the Journey</h4>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-violet-200 hover:border-violet-400 hover:bg-violet-50 bg-transparent"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 bg-transparent"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 bg-transparent"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  YouTube
                </Button>
              </div>
            </div>

            <div className="text-gray-500 text-sm">
              <p>&copy; 2024 NuvioFit. Building the future of health, one workout at a time.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
