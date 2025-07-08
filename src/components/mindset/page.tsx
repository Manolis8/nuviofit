"use client"

import { motion } from "framer-motion"
import { Brain, Heart, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MindsetPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6">
          {/* Coming Soon Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="mb-8">
              <motion.div
                className="text-8xl mb-6"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                🧘
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Mental fitness is just as important
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Meditation content launching soon. Your mind deserves the same attention as your body.
              </p>
            </div>

            {/* Meditation Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  title: "Guided Meditation",
                  description: "AI-powered sessions tailored to your mood and goals",
                  emoji: "🎧",
                  gradient: "from-purple-400 to-pink-400",
                },
                {
                  title: "Breathing Exercises",
                  description: "Science-backed techniques for stress relief and focus",
                  emoji: "🌬️",
                  gradient: "from-blue-400 to-cyan-400",
                },
                {
                  title: "Mindful Moments",
                  description: "Quick practices for busy schedules and daily wellness",
                  emoji: "✨",
                  gradient: "from-indigo-400 to-purple-400",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm h-full overflow-hidden">
                    <CardContent className="p-6 text-center relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                      <div className="relative z-10">
                        <div className="text-4xl mb-4">{feature.emoji}</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Join Waitlist */}
            <Card className="max-w-md mx-auto border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Join the Mindset Beta
                </CardTitle>
                <CardDescription>Be among the first to experience our meditation platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input type="email" placeholder="Enter your email" className="text-center" />
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
                  🧘 Join Mindset Beta
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Zen Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center"
          >
            <Card className="max-w-3xl mx-auto border-none shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className="h-6 w-6 text-pink-500" />
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <blockquote className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-200 italic mb-4">
                  "Your thoughts are the architects of your destiny. Build wisely, and your future stands unshakable."
                </blockquote>
                <div className="mt-6 text-4xl">🛠️</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Coming Q1 2025 • Meditation • Mindfulness • Mental Wellness
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
