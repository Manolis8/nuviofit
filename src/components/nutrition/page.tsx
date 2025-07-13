import { motion } from "framer-motion"
import { Bell, ChefHat, Utensils, Apple } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState } from "react";

export default function NutritionPage() {
    const [showPopup, setShowPopup] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  message: "",
});
const [status, setStatus] = useState<string | null>(null);

async function sendWaitlist(data: typeof formData) {
  try {
    const res = await fetch("http://localhost:5000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to send");
    return await res.json();
  } catch (err) {
    throw err;
  }
}

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
<Button
  onClick={() => setShowPopup(true)}
  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
>
  🔔 Notify me when it's ready
</Button>

              </CardContent>
            </Card>

            {showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-lg">
      <h3 className="text-lg font-bold mb-4">Join the Waitlist</h3>
      <p className="text-gray-600 mb-4">Enter your details below to get notified!</p>

      <Input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Your Name"
        className="mb-3"
      />

      <Input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Your Email"
        className="mb-3"
      />

      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Any message (optional)"
        className="w-full p-3 border rounded-lg h-24 resize-none mb-4"
      />

      <div className="flex gap-2">
        <Button
          onClick={async () => {
            setStatus("Sending...");
            try {
              await sendWaitlist(formData);
              setStatus("Success! We'll notify you.");
              setFormData({ name: "", email: "", message: "" });
              setTimeout(() => {
                setShowPopup(false);
                setStatus(null);
              }, 1500);
            } catch {
              setStatus("Failed to send.");
            }
          }}
          className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg rounded-lg"
        >
          Join Waitlist
        </Button>

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </Button>
      </div>

      {status && <p className="text-sm text-center mt-2">{status}</p>}
    </div>
  </div>
)}

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
