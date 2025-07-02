"use client"

import { motion } from "framer-motion"
import { Bell, ChefHat, Utensils, Apple } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NutritionPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6">
          {/* Coming Soon Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <div className="text-8xl mb-4">🥗</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Nutrition plans are cooking...
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Coming soon! We're preparing something delicious for your health journey.
              </p>
            </div>

            {/* Notify Me Card */}
            <Card className="max-w-md mx-auto border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Get Notified
                </CardTitle>
                <CardDescription>Be the first to know when nutrition features launch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input type="email" placeholder="Enter your email" className="text-center" />
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  🔔 Notify me when it's ready
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <ChefHat className="h-8 w-8 text-orange-500" />,
                title: "AI Meal Planning",
                description: "Personalized meal plans based on your goals and preferences",
                emoji: "👨‍🍳",
              },
              {
                icon: <Utensils className="h-8 w-8 text-green-500" />,
                title: "Recipe Library",
                description: "Thousands of healthy recipes with step-by-step instructions",
                emoji: "📚",
              },
              {
                icon: <Apple className="h-8 w-8 text-red-500" />,
                title: "Nutrition Tracking",
                description: "Track calories, macros, and nutrients with smart logging",
                emoji: "📊",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-none shadow-md bg-white/60 backdrop-blur-sm h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 text-4xl">{feature.emoji}</div>
                    <div className="mb-3">{feature.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Construction Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto border-none shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Under Construction</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our nutrition experts and AI developers are working hard to bring you the most comprehensive nutrition
                  platform. Expected launch: Q2 2024.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["🥑", "🍎", "🥕", "🥬", "🍓", "🥜", "🐟", "🍗"].map((emoji, index) => (
                    <motion.span
                      key={index}
                      className="text-2xl"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: index * 0.2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
