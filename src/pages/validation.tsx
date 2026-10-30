import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Linkedin, Twitter } from "lucide-react";
import {
  ArrowLeft,
  Mail,
  User,
  Zap,
  CheckCircle,
  Users,
  Shield,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Validation() {
const { getClient } = useSupabaseClientWithAuth();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [interestedInPaying, setInterestedInPaying] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

const displayName = name.trim() === '' ? 'user' : name.trim()

        const supabaseAuthClient = await getClient();

const { data, error } = await supabaseAuthClient
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg, #63B3ED 0%, #9F7AEA 50%, #38B2AC 100%)" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="max-w-2xl mx-auto text-center py-8 sm:py-20">
            <div className="mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
              >
                You're In! Welcome to NuvioFit
              </h1>
              <p
                className="text-lg sm:text-xl text-white mb-6 sm:mb-8 px-4"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
              >
                Thank you for helping us validate this idea. Your feedback will shape the future of AI fitness.
              </p>
            </div>

            <Card className="bg-black/20 backdrop-blur-md border-white/20 shadow-xl mx-4 sm:mx-0">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">What happens next?</h3>
                <div className="space-y-3 sm:space-y-4 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white">We'll send you updates on our development progress</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white">You'll get first access when we launch (if we launch)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white">Your input will help us build exactly what you need</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 sm:mt-8 px-4 sm:px-0">
              <Link to="/">
                <Button className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/40 border border-white/30 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-medium w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #63B3ED 0%, #9F7AEA 50%, #38B2AC 100%)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
            <div className="mb-6 sm:mb-8">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 text-balance leading-tight"
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }}
              >
                Help Us Build the Future of Fitness
              </h1>
              <p
                className="text-lg sm:text-xl md:text-2xl text-white max-w-3xl mx-auto text-pretty leading-relaxed"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
              >
                We're exploring AI-powered personalized workouts. Your interest helps us decide if this is worth
                building.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span
                  className="text-base sm:text-lg font-semibold text-white"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Idea Validation Phase
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span
                  className="text-base sm:text-lg font-semibold text-white"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Building Community
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span
                  className="text-base sm:text-lg font-semibold text-white"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  AI-Powered Vision
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12 sm:mb-16 px-4 sm:px-0">
            {/* Waitlist Form */}
            <Card className="bg-black/20 backdrop-blur-md border-white/20 shadow-2xl">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Show Your Interest</h2>
                  <p className="text-white leading-relaxed text-sm sm:text-base">
                    Help us validate this concept. If enough people are interested, we'll build it. Give us your opinion! We would love to hear from you!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      type="text"
                      placeholder="Your name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 sm:pl-12 py-3 sm:py-4 text-base sm:text-lg bg-black/30 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      type="email"
                      placeholder="Your email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 sm:pl-12 py-3 sm:py-4 text-base sm:text-lg bg-black/30 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-white font-medium flex items-start sm:items-center gap-2 text-sm sm:text-base">
                      <DollarSign className="w-4 h-4 mt-0.5 sm:mt-0 flex-shrink-0" />
                      <span>Would you pay $19/month for AI-powered personalized workouts?</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        "Yes, definitely interested",
                        "Maybe, depends on features",
                        "No, prefer free options",
                        "Not sure yet",
                      ].map((option) => (
                        <label key={option} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value={option}
                            checked={interestedInPaying === option}
                            onChange={(e) => setInterestedInPaying(e.target.value)}
                            className="w-4 h-4 text-white mt-0.5 flex-shrink-0"
                          />
                          <span className="text-white text-sm sm:text-base">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!email || isLoading}
                    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold bg-black/30 backdrop-blur-sm text-white hover:bg-black/40 border border-white/30 shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                          style={{
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                        <span className="text-sm sm:text-base">Validating Interest...</span>
                      </div>
                    ) : (
                      "Count Me In 🚀"
                    )}
                  </Button>
                </form>

                <p className="text-xs sm:text-sm text-white/70 mt-3 sm:mt-4 text-center">
                  Honest feedback helps us build better products.
                </p>
              </CardContent>
            </Card>

            {/* Benefits Section */}
            <div className="space-y-6 sm:space-y-8">
              <Card className="bg-black/20 backdrop-blur-md border-white/20 shadow-xl">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">What We're Planning</h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">
                          AI That Actually Learns
                        </h4>
                        <p className="text-white text-sm sm:text-base">
                          Workouts that adapt based on your progress, schedule, and preferences. No more generic
                          routines.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Real Personalization</h4>
                        <p className="text-white">
                          Not just "beginner/intermediate/advanced" but truly personalized to your body, goals, and
                          life.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Built With Your Input</h4>
                        <p className="text-white">
                          If we build this, it'll be based on real feedback from people like you, not assumptions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center">
                    <h4 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">Honest Question:</h4>
                    <p className="text-white italic text-sm sm:text-base">
                      "Would you actually use and pay for AI-powered personalized workouts, or is this just another
                      fitness app idea that sounds good but won't get used?"
                    </p>
                    <p className="text-white/70 text-xs sm:text-sm mt-3 sm:mt-4">
                      Your honest answer helps us make the right decision.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-0">
            <h2
              className="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-12"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  question: "Is this actually going to happen?",
                  answer:
                    "Only if enough people show genuine interest and willingness to pay. We're not building something nobody wants.",
                },
                {
                  question: "Why should I trust you'll deliver?",
                  answer:
                    "Fair question. We're being transparent about this being validation phase. If we can't deliver, we'll be honest about it.",
                },
                {
                  question: "What makes this different from existing apps?",
                  answer:
                    "Most fitness apps give you generic workouts with basic customization. We're exploring true AI personalization that learns and adapts to you specifically.",
                },
                {
                  question: "How much would it really cost?",
                  answer:
                    "We're thinking $19/month, but that depends on development costs and what features people actually want. Early supporters would get better pricing.",
                },
              ].map((faq, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-md border-white/20">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-black/10 transition-colors"
                    >
                      <span className="font-semibold text-white text-sm sm:text-base pr-4">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <p className="text-white text-sm sm:text-base">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center px-4 sm:px-0">
            <Card className="bg-black/20 backdrop-blur-md border-white/20 shadow-xl max-w-4xl mx-auto">
              <CardContent className="p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Help Us Make the Right Decision
                </h2>
                <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Your interest (or opinion) helps us decide whether to invest time and money into building this.
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white text-sm sm:text-base">Validation phase - be part of the decision</span>
                </div>
                <Button
                  onClick={() => document.querySelector("h2")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/40 border border-white/30 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                >
                  Share Your Interest
                </Button>
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <span className="text-white text-sm sm:text-base">Contact us at <a 
                  href="mailto:contact@nuviofit.com" 
                  className="underline hover:text-white"
                >
                  contact@nuviofit.com
                </a>
                or   <a href="https://www.instagram.com/nuviofit" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram size={22} />
                              </a> </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <footer className="mt-16 sm:mt-20 text-center px-4 sm:px-0">
            <div className="text-white/70 text-xs sm:text-sm">
              <p>&copy; 2025 NuvioFit Concept. Validating ideas before building them.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

const spin = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
