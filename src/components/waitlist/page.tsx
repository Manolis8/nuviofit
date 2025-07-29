import { supabase } from "@/components/lib/supabaseClient";
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

const displayName = name.trim() === '' ? 'user' : name.trim()

const { data, error } = await supabase
  .from('waitlist')
  .insert([{ email: email.trim(), name: displayName }])

if (error) {
  console.error(error)
  alert('Something went wrong. Please try again later.')
  setIsLoading(false)
  return
}

setIsSubmitted(true)
setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-teal-50 to-blue-100">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 sm:mb-8 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </Link>

          <div className="max-w-2xl mx-auto text-center py-8 sm:py-20">
            <div className="mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-violet-400 to-teal-400 rounded-full flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">🎉</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
                You're In! 🚀
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
                Welcome to the NuvioFit waitlist! We'll notify you the moment early access reopens.
              </p>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl sm:rounded-3xl mx-3 sm:mx-0">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">What happens next?</h3>
                <div className="space-y-3 sm:space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-violet-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">You'll get an email confirmation shortly</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">We'll send exclusive content while you wait</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">You'll be first to know when spots open up</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 sm:mt-8 px-3 sm:px-0">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-teal-500 hover:from-violet-600 hover:to-teal-600 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Back
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 sm:mb-8 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          Back
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Headline Section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 leading-tight">
                You Just Missed It...
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                But don't worry — the future of health is coming back soon.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start">
            {/* Waitlist Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl sm:rounded-3xl mx-2 sm:mx-0">
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                    Join the Waitlist 🚀
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We're opening up spots again soon for a few more people who want to transform their fitness with
                    NuvioFit's AI-driven coaching. Leave your email and you'll be the first to know.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      type="text"
                      placeholder="Your name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 sm:pl-12 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-white/50"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      type="email"
                      placeholder="Your email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 sm:pl-12 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-teal-400 focus:ring-teal-400 bg-white/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!email || isLoading}
                    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-violet-500 to-teal-500 hover:from-violet-600 hover:to-teal-600 text-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
            <div className="space-y-6 sm:space-y-8 mx-2 sm:mx-0">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-2xl sm:rounded-3xl">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">What You'll Get</h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-violet-400 to-teal-400 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                          ⚡ Instant Notifications
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Be the first to know when early access reopens
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">💬 Exclusive Content</h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Get tips and insights from the NuvioFit team
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-violet-400 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🔐 Hidden Perks</h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Unlock special benefits when we launch paid plans
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reinforcement Section */}
              <Card className="bg-gradient-to-r from-violet-500/10 to-teal-500/10 backdrop-blur-sm border-0 shadow-xl rounded-2xl sm:rounded-3xl">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                    NuvioFit is More Than Fitness
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    We're building the future of health — AI-generated workouts, smart coaching, integrated mindset
                    tracking, and deep personalization based on your energy, goals, and schedule. Join thousands who are
                    already transforming their lives with intelligent fitness technology.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 sm:mt-16 md:mt-20 text-center px-2 sm:px-0">
           {/* 
           <div className="mb-6 sm:mb-8">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Follow the Journey</h4>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-violet-200 hover:border-violet-400 hover:bg-violet-50 bg-transparent text-sm sm:text-base py-2 px-4"
                >
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Instagram
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 bg-transparent text-sm sm:text-base py-2 px-4"
                >
                  <Twitter className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 bg-transparent text-sm sm:text-base py-2 px-4"
                >
                  <Youtube className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  YouTube
                </Button>
              </div>
            </div>
            */}

            <div className="text-gray-500 text-xs sm:text-sm px-4">
              <p>&copy; 2024 NuvioFit. Building the future of health, one workout at a time.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
