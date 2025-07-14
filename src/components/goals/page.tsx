import { motion } from "framer-motion"
import { Bell, ChefHat, Utensils, Apple } from "lucide-react"
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"; 
import { supabase } from "@/components/lib/supabaseClient";
import { Brain, Heart, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Target, TrendingUp, Award, Lock } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const placeholderGoals = [
  {
    title: "Lose 5kg",
    progress: 0,
    target: "5kg",
    timeframe: "12 weeks",
    icon: "⚖️",
    category: "Weight Loss",
  },
  {
    title: "Run 10K",
    progress: 0,
    target: "10km",
    timeframe: "8 weeks",
    icon: "🏃‍♀️",
    category: "Cardio",
  },
  {
    title: "Bench Press 80kg",
    progress: 0,
    target: "80kg",
    timeframe: "16 weeks",
    icon: "🏋️‍♂️",
    category: "Strength",
  },
  {
    title: "Daily Meditation",
    progress: 0,
    target: "30 days",
    timeframe: "1 month",
    icon: "🧘‍♀️",
    category: "Mindfulness",
  },
]

export default function GoalsPage() {
const [showPopup, setShowPopup] = useState(false);
    const { user } = useUser();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      async function fetchUsername() {
        if (!user) return;
        setEmail(user.emailAddresses[0]?.emailAddress || "");
  
        const { data, error } = await supabase
          .from("onboarding_responses")
          .select("username")
          .eq("user_id", user.id)
          .single();
  
        if (error) {
          console.error("Error fetching username:", error.message);
        } else if (data?.username) {
          setUsername(data.username);
        }
      }
  
      fetchUsername();
    }, [user]);
  
    const waitlistOptions = [
      "Nutrition",
      "Meditation",
      "Goal Tracking",
      "Smartwatch Sync",
    ];
  
    const handleCheckboxChange = (option: string) => {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setStatus(null);
  
      if (!user?.id) {
        setError("You must be logged in.");
        return;
      }
  
      if (selectedOptions.length === 0) {
        setError("Please select at least one option.");
        return;
      }
  
      setLoading(true);
      setStatus("Sending...");
  
      const { error } = await supabase.from("waitlist_features").insert([
        {
          user_id: user.id,
          email,
          username,
          nutrition: selectedOptions.includes("Nutrition"),
          meditation: selectedOptions.includes("Meditation"),
          goal_tracking: selectedOptions.includes("Goal Tracking"),
          smartwatch_sync: selectedOptions.includes("Smartwatch Sync"),
        },
      ]);
  
      if (error) {
        console.error(error);
        setError("Failed to join waitlist. Try again.");
        setStatus("Failed to send.");
      } else {
        setStatus("Success! We'll notify you.");
        setSelectedOptions([]);
        setTimeout(() => {
          setShowPopup(false);
          setStatus(null);
        }, 1500);
      }
  
      setLoading(false);
    };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-red-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6">
          {/* Coming Soon Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="mb-8">
              <motion.div
                className="text-8xl mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                🎯
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Goal tracking will launch soon
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Stay focused. Advanced goal setting and progress tracking coming to help you achieve your dreams.
              </p>
            </div>
          </motion.div>

          {/* Placeholder Goal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {placeholderGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-none shadow-md bg-white/60 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50" />
                  <div className="absolute top-4 right-4 z-10">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl opacity-50">{goal.icon}</span>
                      <div>
                        <CardTitle className="text-gray-500 dark:text-gray-400">{goal.title}</CardTitle>
                        <CardDescription className="text-gray-400 dark:text-gray-500">
                          {goal.category} • {goal.timeframe}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Progress</span>
                        <span>0 / {goal.target}</span>
                      </div>
                      <Progress value={0} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      <div className="text-center text-sm text-gray-400 mt-4">🔒 Coming soon</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Target className="h-8 w-8 text-orange-500" />,
                title: "Smart Goal Setting",
                description: "AI-powered goal recommendations based on your fitness level",
                emoji: "🎯",
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-green-500" />,
                title: "Progress Tracking",
                description: "Visual progress charts and milestone celebrations",
                emoji: "📈",
              },
              {
                icon: <Award className="h-8 w-8 text-purple-500" />,
                title: "Achievement System",
                description: "Unlock badges and rewards as you reach your goals",
                emoji: "🏆",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="border-none shadow-md bg-white/70 backdrop-blur-sm h-full">
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
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto border-none shadow-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Building Your Success Platform
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our goal tracking system is being crafted to help you achieve extraordinary results. Advanced
                  analytics, AI coaching, and social challenges coming soon.
                </p>
                <Button  onClick={() => setShowPopup(true)} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  🎯 Join Goals Beta Waitlist
                </Button>
                            {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold mb-4">Join the Waitlist</h3>
            <p className="text-gray-600 mb-4">
              Choose which features you look forward launching!
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                {waitlistOptions.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`option-${idx}`}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                    <label htmlFor={`option-${idx}`}>{option}</label>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white rounded p-2"
                >
                  {loading ? "Joining..." : "Join Waitlist"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="border rounded p-2"
                >
                  Cancel
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {status && <p className="text-sm text-center mt-2">{status}</p>}
            </form>
          </div>
        </div>
      )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
