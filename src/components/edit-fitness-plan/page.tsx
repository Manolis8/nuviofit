import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Zap, Calendar, Clock, Target, Save, X } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/components/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

interface WorkoutDay {
  day: string
  title: string
  exercises: string[]
  duration: string
  intensity: "Low" | "Medium" | "High"
}

const initialFitnessPlan: WorkoutDay[] = [
  {
    day: "Monday",
    title: "Upper Body Strength",
    exercises: ["Push-ups", "Pull-ups", "Dumbbell Press", "Bicep Curls"],
    duration: "45 min",
    intensity: "High",
  },
  {
    day: "Tuesday",
    title: "Cardio & Core",
    exercises: ["Running", "Planks", "Mountain Climbers", "Burpees"],
    duration: "30 min",
    intensity: "Medium",
  },
  {
    day: "Wednesday",
    title: "Lower Body Power",
    exercises: ["Squats", "Lunges", "Deadlifts", "Calf Raises"],
    duration: "50 min",
    intensity: "High",
  },
  {
    day: "Thursday",
    title: "Active Recovery",
    exercises: ["Yoga", "Stretching", "Light Walking", "Foam Rolling"],
    duration: "25 min",
    intensity: "Low",
  },
  {
    day: "Friday",
    title: "Full Body Circuit",
    exercises: ["Kettlebell Swings", "Box Jumps", "Battle Ropes", "Med Ball Slams"],
    duration: "40 min",
    intensity: "High",
  },
  {
    day: "Saturday",
    title: "Flexibility & Balance",
    exercises: ["Pilates", "Balance Poses", "Deep Stretching", "Meditation"],
    duration: "35 min",
    intensity: "Low",
  },
  {
    day: "Sunday",
    title: "Rest Day",
    exercises: ["Complete Rest", "Light Stretching", "Hydration Focus", "Recovery"],
    duration: "15 min",
    intensity: "Low",
  },
]

const LoadingSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="relative overflow-hidden border-b border-gray-200 pb-4 sm:pb-6">
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse flex-shrink-0">
            <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded-full opacity-50"></div>
          </div>
          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="h-5 sm:h-6 w-32 sm:w-48 rounded bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded opacity-50"></div>
              </div>
              <div className="h-4 sm:h-5 w-12 sm:w-16 rounded-full bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded-full opacity-50"></div>
              </div>
            </div>
            <div className="h-3 sm:h-4 w-16 sm:w-24 rounded bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
              <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded opacity-50"></div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="h-3 w-24 sm:w-32 rounded bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded opacity-50"></div>
              </div>
              <div className="h-3 w-20 sm:w-28 rounded bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"></div>
      </div>
    ))}
  </div>
)

const IntensityBadge = ({ intensity }: { intensity: "Low" | "Medium" | "High" }) => {
  const colors = {
    Low: "from-green-400 to-emerald-300 text-green-800",
    Medium: "from-yellow-400 to-orange-300 text-orange-800",
    High: "from-red-400 to-pink-300 text-red-800",
  }

  return (
    <span
      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colors[intensity]} shadow-sm`}
    >
      {intensity}
    </span>
  )
}

export default function EditFitnessPlanPage() {
    const { user } = useUser();
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [hasUsedOnce, setHasUsedOnce] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [fitnessPlan, setFitnessPlan] = useState<string>(""); 



useEffect(() => {
  const fetchFitnessPlan = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("onboarding_responses")
      .select("fitness_plan")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching fitness plan:", error);
      return;
    }

    if (data?.fitness_plan) {
      let fullText = data.fitness_plan;

      // Find the starting index of "Day 1" (case sensitive)
      const startIndex = fullText.indexOf("Day 1");

      // If "Day 1" found, slice from there; else show full text
      const planText = startIndex !== -1 ? fullText.slice(startIndex) : fullText;

      setPrompt(planText);
      setFitnessPlan(planText);
    }
  };

  fetchFitnessPlan();
}, [user]);


  // Prevent navigation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges])

const handleSubmit = async () => {
  if (!prompt.trim() || hasUsedOnce) return;

  setIsLoading(true);
  setHasUsedOnce(true);

  setTimeout(() => {
    const updatedPlan = fitnessPlan + "\n\nAI Optimized Exercise Added.";
    setFitnessPlan(updatedPlan);
    setHasChanges(true);
    setIsLoading(false);
    setPrompt("");
  }, 3000);
};


  const handleSavePlan = () => {
    setHasChanges(false)
    setShowSaveDialog(true)
    setTimeout(() => {
      setShowSaveDialog(false)
    }, 2000)
  }

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?")
      if (confirmLeave) {
      }
    } else {
    }
  }

  const wordCount = prompt.split(" ").filter((word) => word.length > 0).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Save Success Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Save className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Plan Saved Successfully!</h3>
              <p className="text-sm sm:text-base text-gray-600">Your fitness plan has been updated and saved.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            < Link href="/workout-page">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 bg-transparent text-xs sm:text-sm px-2 sm:px-3"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Back
            </Button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-400 flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent truncate">
                  AI Fitness Plan Editor
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm truncate">Customize your workout with AI assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Side - 7-Day Plan in One Big Div */}
<div className="space-y-4 sm:space-y-6">
  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">7-Day Fitness Plan</h2>
  </div>

  <Card className="border-gray-200 bg-white shadow-sm">
    <CardContent className="p-3 sm:p-6">
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="animate-fadeIn text-gray-700 text-sm sm:text-base whitespace-pre-line">
          {fitnessPlan}
        </div>
      )}
    </CardContent>
  </Card>

  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
    <Link href="/workout-page">
      <Button
        disabled={!hasChanges}
        className="bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Plan
      </Button>
    </Link>
    <Link href="/workout-page">
      <Button
        variant="outline"
        className="border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 px-6 sm:px-8 py-2.5 sm:py-2 bg-transparent text-sm sm:text-base"
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </Link>
  </div>
</div>



          {/* Right Side - AI Input Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-400">
                <Send className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Customize Your Plan</h2>
            </div>

            {!hasUsedOnce ? (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      What would you like to change about your fitness plan?
                    </label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., 'Add more cardio exercises to Tuesday and Thursday', 'Make the workouts shorter', 'Focus more on upper body strength'..."
                      className="min-h-[150px] sm:min-h-[200px] bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none text-sm sm:text-base"
                      maxLength={1250} 
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${wordCount > 200? "text-red-500" : "text-gray-500"}`}>
                        {wordCount}/200 words
                      </span>
                      <span className="text-gray-400">{prompt.length}/900 characters</span>    
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || wordCount > 200 || isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs sm:text-sm">AI is updating your plan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Update Fitness Plan
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Plan Updated!</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Your fitness plan has been customized with AI. You can only use the AI assistant once per
                        month.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong>Tip:</strong> Save your plan to keep the changes, or cancel to discard them.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
