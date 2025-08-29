import { ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, SkipForward, X, Play, Pause, RotateCcw } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { supabase } from "@/components/lib/supabaseClient";
import { useUser } from "@clerk/clerk-react"
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"

// Enhanced motivational messages
const motivationalMessages = [
  "Let's get that set strong! 💪",
  "You've got this🔥",
  "Train like who you want to become 🔁",
  "Every rep is building your future self 🚀",
  "Push through the burn — that's where growth happens 💥",
  "Your discipline today creates tomorrow's strength 🌟",
  "Mind over muscle — you're stronger than you think 🧠",
  "Champions are made in moments like this ⚡",
  "One more rep, one step closer to greatness 🎯",
  "Your consistency is your superpower 🔥",
]

// Set completion messages
const setCompletionMessages = [
  "Crushing it! 🔥",
  "Beast mode activated! 💪",
  "That's how it's done! ⚡",
  "Unstoppable! 🚀",
  "Power move! 💥",
  "Excellence in action! 🌟",
]


// Improved Timer component for rest periods and time-based exercises
function RestTimer({
  duration,
  isActive,
  onComplete,
  onSkip,
}: {
  duration: number
  isActive: boolean
  onComplete: () => void
  onSkip: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const pauseTimeRef = useRef<number | null>(null)


  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration)
      setIsRunning(true)
      setHasCompleted(false)
      startTimeRef.current = Date.now()
    }
  }, [isActive, duration])

  useEffect(() => {
    if (!isRunning || !isActive || hasCompleted || startTimeRef.current === null) return

    const tick = () => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTimeRef.current!) / 1000)
      const remaining = Math.max(duration - elapsed, 0)

      setTimeLeft(remaining)

      if (remaining === 0) {
        setIsRunning(false)
        setHasCompleted(true)
        onComplete()
      }
    }

    tick() // Initial call for immediate UI update

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isRunning, isActive, hasCompleted, duration, onComplete])

  const resetTimer = () => {
    setTimeLeft(duration)
    setIsRunning(true)
    setHasCompleted(false)
    startTimeRef.current = Date.now()
  }

  const toggleTimer = () => {
  if (hasCompleted) return;

  if (isRunning) {
    // Pausing
    pauseTimeRef.current = Date.now();
    setIsRunning(false);
  } else {
    // Resuming
    if (pauseTimeRef.current && startTimeRef.current) {
      const pauseDuration = Date.now() - pauseTimeRef.current;
      startTimeRef.current += pauseDuration; // push start time forward
    }
    pauseTimeRef.current = null;
    setIsRunning(true);
  }
};


  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-100 opacity-50"></div>
        <svg className="w-48 h-48 transform -rotate-90 relative z-10">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="url(#restTimerGradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference * (1 - progress / 100)}`}
            className="transition-all duration-300 ease-linear"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="restTimerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-2">
              {hasCompleted ? "Time's up!" : isRunning ? "Resting..." : "Paused"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={toggleTimer}
          disabled={hasCompleted}
          className={`rounded-full px-6 py-3 shadow-lg transition-all duration-300 ${
            hasCompleted
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold"
          }`}
        >
          {hasCompleted ? "Complete!" : isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>

        <Button
          onClick={resetTimer}
          variant="outline"
          className="rounded-full px-6 py-3 border-2 border-orange-300 hover:bg-orange-50"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          onClick={onSkip}
          variant="outline"
          className="rounded-full px-6 py-3 border-2 border-blue-300 hover:bg-blue-50 text-blue-600"
        >
          Skip Rest
        </Button>
      </div>
    </div>
  )
}

// Improved Timer component for time-based exercises (like Plank)
function ExerciseTimer({
  duration,
  isActive,
  onComplete,
  onReset,
}: {
  duration: number
  isActive: boolean
  onComplete: () => void
  onReset: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  const startTimeRef = useRef<number | null>(null)
  const pauseTimeRef = useRef<number | null>(null)

  // When component activates (user starts exercise)
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration)
      setIsRunning(true)
      setHasCompleted(false)
      startTimeRef.current = Date.now()
    }
  }, [isActive, duration])

  // Countdown loop
  useEffect(() => {
    if (!isRunning || !isActive || hasCompleted || startTimeRef.current === null) return

    const tick = () => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTimeRef.current!) / 1000)
      const remaining = Math.max(duration - elapsed, 0)

      setTimeLeft(remaining)

      if (remaining === 0) {
        setIsRunning(false)
        setHasCompleted(true)
        onComplete()
      }
    }

    tick()

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isRunning, isActive, hasCompleted, duration, onComplete])

  const toggleTimer = () => {
    if (hasCompleted) return

    if (isRunning) {
      // Pause
      pauseTimeRef.current = Date.now()
      setIsRunning(false)
    } else {
      // Resume
      if (pauseTimeRef.current && startTimeRef.current) {
        const pauseDuration = Date.now() - pauseTimeRef.current
        startTimeRef.current += pauseDuration // shift start forward
      }
      pauseTimeRef.current = null
      setIsRunning(true)
    }
  }

const resetTimer = () => {
  setHasCompleted(false)
  setTimeLeft(duration)
  setIsRunning(true) // auto-start the countdown
  startTimeRef.current = Date.now()
  pauseTimeRef.current = null
  onReset()
}


  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 via-cyan-100 to-emerald-100"></div>
        <svg className="w-40 h-40 transform -rotate-90 relative z-10">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#exerciseTimerGradient)"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            className="transition-all duration-300 ease-linear"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="exerciseTimerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {hasCompleted ? "Done!" : isRunning ? "Hold it!" : "Paused"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={toggleTimer}
          disabled={hasCompleted}
          className={`rounded-full px-6 py-3 shadow-lg font-bold ${
            hasCompleted
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white"
          }`}
        >
          {hasCompleted ? "Complete!" : isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button onClick={resetTimer} variant="outline" className="rounded-full px-6 py-3 border-2">
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default function WorkoutPage() {
const navigate = useNavigate()
    const { getClient } = useSupabaseClientWithAuth();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isResting, setIsResting] = useState(false)
  
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [motivationIndex, setMotivationIndex] = useState(0)
  const [workoutCompleted, setWorkoutCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [weeklyProgress] = useState(3) // 3 of 5 days completed
  const [currentStreak] = useState(3)
const [totalExercises, setTotalExercises] = useState(0);
const { user } = useUser()
const [todayExercises, setTodayExercises] = useState<
  {
    id: number;
    emoji: string;
    name: string;
    scheme: string;
    resttime: string;
    sets: number;
    reps: number;
    duration: number;
    isTimeBased: boolean;
    focusArea?: string;
    category?: string;
    instructions?: string;
    aiTip?: string;
  }[]
>([]);
const currentExercise = todayExercises[currentExerciseIndex] || {}

const isLastExercise = currentExerciseIndex === todayExercises.length - 1
const [workoutLevel, setWorkoutLevel] = useState("");

  const isLastSet = currentSet === currentExercise.sets
const totalSets = todayExercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)
const [completedExercises, setCompletedExercises] = useState<number[]>([]);
const [completedSets, setCompletedSets] = useState(0);
const [caloriesBurned, setCaloriesBurned] = useState(0);

  const progressPercentage = ((completedSets + (currentSet - 1)) / totalSets) * 100
  const [parsedExerciseCount, setParsedExerciseCount] = useState<number>(0); 
  const [parsedDuration, setParsedDuration] = useState<number>(0); 
  const [todayWorkoutFocus, setTodayWorkoutFocus] = useState<string>("")
const [todayTotalCalories, setTodayTotalCalories] = useState<number>(0)

  // Update elapsed time
  useEffect(() => {
    if (workoutStartTime && !workoutCompleted) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [workoutStartTime, workoutCompleted])

  const startWorkout = () => {
    setWorkoutStartTime(Date.now())
  }

  const completeSet = () => {
  // Show celebration
  setShowCelebration(true)
  setTimeout(() => setShowCelebration(false), 1500)

  // Update progress
  setCompletedSets((prev) => prev + 1)

  // Rotate motivation message
  setMotivationIndex((prev) => (prev + 1) % motivationalMessages.length)

  if (isLastSet) {
    // Complete exercise
    setCompletedExercises((prev) => [...prev, currentExercise.id])

    if (isLastExercise) {
      // Workout complete
      setTimeout(() => setWorkoutCompleted(true), 1000)
    } else {
      // Move to next exercise
      setTimeout(() => {
        setCurrentExerciseIndex((prev) => prev + 1)
        setCurrentSet(1)
        setIsResting(false)
      }, 1000)
    }
  } else {
    setIsResting(true)
  }
}



useEffect(() => {
  let isMounted = true;

  const fetchFitnessPlan = async () => {
            const supabaseAuthClient = await getClient();
    const { data, error } = await supabaseAuthClient
      .from("onboarding_responses")
      .select(`
        workout_level,
        fitness_plan
      `)
      .eq("user_id", user.id)
      .single();

    if (error || !data?.fitness_plan) {
      console.error("❌ Failed to fetch fitness plan", error);
      return;
    }
    if (data?.workout_level) {
      setWorkoutLevel(data.workout_level);
    }


    const planText = data.fitness_plan || "";
    const todayDayNumber = new Date().getDay() === 0 ? 7 : new Date().getDay();
    const todayLabel = `Day ${todayDayNumber}`;

    // Split and isolate today's section
    const planSections = planText.split(/Day\s*\d+:/i).slice(1);
    const todaySection = planSections[todayDayNumber - 1];
    if (todaySection) {
      const lines = todaySection.trim().split("\n");
      const titleLine = lines[0]?.trim();
      const totalLine = lines.find(line =>
        line.toLowerCase().startsWith("total exercises:")
      );
      if (totalLine) {
        const count = parseInt(totalLine.split(":")[1]?.trim());
        if (!isNaN(count)) {
          setParsedExerciseCount(count);
        }
      }
const durationLine = lines.find(line =>
  line.toLowerCase().startsWith("duration:")
);

if (durationLine) {
  const match = durationLine.match(/(\d+)\s*min/i);
  if (match) {
    const minutes = parseInt(match[1]);
    if (!isNaN(minutes)) {
      setParsedDuration(minutes);
    }
  }
}



      const mainIndex = lines.findIndex(line =>
        line.toLowerCase().startsWith("main exercises:")
      );
      const mindsetIndex = lines.findIndex(line =>
        line.toLowerCase().startsWith("mindset tip:")
      );
const workoutfocusIndex = lines.findIndex(line =>
  line.toLowerCase().startsWith("workout focus:")
);
const caloriesIndex = lines.findIndex(line =>
  line.toLowerCase().startsWith("calories:")
);

let parsedWorkoutFocus = "";
if (workoutfocusIndex !== -1) {
  const focusLine = lines[workoutfocusIndex + 1]?.trim() || "";
  parsedWorkoutFocus = focusLine;
  console.log("💪 Workout Focus:", parsedWorkoutFocus);
} else {
  console.warn("⚠️ Workout focus not found");
}

let parsedTotalCalories = 0;
if (caloriesIndex !== -1) {
  const caloriesLine = lines[caloriesIndex].trim();
  const parts = caloriesLine.split(":");
  const c = parseInt(parts[1]?.trim(), 10);
  if (!isNaN(c)) {
    parsedTotalCalories = c;
    console.log("🔥 Total Calories:", parsedTotalCalories);
  } else {
    console.warn("⚠️ Could not parse calories from:", caloriesLine);
  }
} else {
  console.warn("⚠️ Calories line not found");
}


      const exerciseLines = mainIndex !== -1
        ? lines.slice(
            mainIndex + 1,
            mindsetIndex !== -1 ? mindsetIndex : lines.length
          )
        : [];

const parsedExercises = exerciseLines
  .map(line => line.trim())
  .filter(
    line =>
      line &&
      !line.toLowerCase().includes("rest day") &&
      !line.toLowerCase().startsWith("mindset") &&
      !line.toLowerCase().startsWith("workout focus")&&
      !line.toLowerCase().startsWith("calories")
  )
  .map(line => {
    const parts = line.split(/\s*-\s*/).map(p => p.trim());

    const scheme = parts[2] || "";
    const resttime = parts[3] || "";
    const instructions = parts[4] || "";

    // Extract sets from scheme like "8 reps x 3 sets"
    const setsMatch = scheme.match(/x\s*(\d+)\s*sets?/i);
    const sets = setsMatch ? parseInt(setsMatch[1]) : 1;

    // Check if time-based
        const isTimeBased = /min|sec|second/i.test(scheme.toLowerCase());

    // Estimate duration in seconds from scheme
    let duration = 0;
    const minutesMatch = scheme.match(/(\d+)\s*min/i);
    const secondsMatch = scheme.match(/(\d+)\s*sec/i);

if (minutesMatch) duration += parseInt(minutesMatch[1]) * 60;
if (secondsMatch) duration += parseInt(secondsMatch[1]);

    return {
      emoji: parts[0] || "",
      name: parts[1] || "",
      scheme,
      resttime,
      sets,
      isTimeBased,
      duration,
      focusArea: "General",
      category: "Bodyweight",
      title: titleLine,
      instructions,
    };
  });

setTodayExercises(parsedExercises);
setTodayWorkoutFocus(parsedWorkoutFocus);
setTodayTotalCalories(parsedTotalCalories);
    }
  };

  if (user?.id) fetchFitnessPlan();

  return () => {
    isMounted = false;
  };
}, [user]);


  const completeRest = () => {
    setIsResting(false)
    setCurrentSet((prev) => prev + 1)
  }

const skipExercise = () => {
  if (currentExerciseIndex < todayExercises.length - 1) {
    setCurrentExerciseIndex(prev => prev + 1);
    setCurrentSet(1);
    setIsResting(false);
  } else {
    // Reached the last exercise
    setWorkoutCompleted(true);
  }
};

  const exitWorkout = () => {
    if (confirm("Are you sure you want to exit the warm up?")) {
      navigate("/workout-page")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }


  const finishWorkout = () => {
    navigate("/dashboard")
  }

const restTimeStr = currentExercise?.resttime ?? ""  // fallback to empty string if undefined

const minutesMatch = restTimeStr.match(/(\d+)\s*(min|minutes)/i)
const secondsMatch = restTimeStr.match(/(\d+)\s*(sec|seconds)/i)

const parsedRestDuration =
  (minutesMatch ? parseInt(minutesMatch[1]) * 60 : 0) +
  (secondsMatch ? parseInt(secondsMatch[1]) : 0)



  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-emerald-950/30">
        <div className="container mx-auto p-4 md:p-6 max-w-6xl">
{/* Workout Session Title */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex justify-start mb-6">
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              🔥 Dynamic Warm-Up
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
              {workoutStartTime && (
                <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm px-4 py-2 rounded-full font-medium shadow-sm">
                  ⏱️ {formatTime(elapsedTime)}
                </Badge>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Workout Area */}
            <div className="lg:col-span-3">
              {!workoutStartTime ? (
                /* Pre-Workout Screen */
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="rounded-2xl shadow-xl p-8 bg-white/90 backdrop-blur-sm border-0 text-center">
                    <CardContent className="p-0">
                      <div className="text-6xl mb-6">🔥</div>
                      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                        Ready to warm up?
                      </h2>

                      <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-5xl mx-auto">
  {todayExercises.map((exercise, index) => (
    <motion.div
      key={`${exercise.name}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-[180px] p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 rounded-xl text-center border border-blue-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="text-3xl mb-3">{exercise.emoji}</div>
      <div className="text-sm font-bold text-gray-800 mb-1">{exercise.name}</div>
      <div className="text-xs text-gray-600">{exercise.scheme}</div>
    </motion.div>
  ))}
</div>
                      <Button
                        onClick={startWorkout}
                        className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white font-bold rounded-full px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        🔥 Start Warm up
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : workoutCompleted ? (
                /* Completion Screen */
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="rounded-2xl shadow-xl p-8 bg-white/90 backdrop-blur-sm border-0 text-center">
                    <CardContent className="p-0">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-8xl mb-6"
                      >
                        🎉
                      </motion.div>

                      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                        Warm up Complete!
                      </h2>
                      <p className="text-xl text-gray-600 mb-8 font-medium">
                        You are ready to do your workout!
                      </p>

                      {/* Workout Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl text-center border border-blue-100">
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                            {formatTime(elapsedTime)}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Duration</div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-xl text-center border border-cyan-100">
                          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                            {completedExercises.length}/{parsedExerciseCount}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Exercises</div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="space-y-4">
                        <Button
                          className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white font-bold rounded-full px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                          onClick={finishWorkout}
                        >
                          🏆 Finish
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                /* Active Workout Screen */
                <AnimatePresence mode="wait">
                    <motion.div
                      key={`exercise-${currentExerciseIndex}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Set & Exercise Tracker */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                              Exercise {currentExerciseIndex + 1} of {todayExercises.length} • Set {currentSet}{" "}
                              of {currentExercise.sets}
                            </h3>
                          </div>
                          <Button
                            onClick={exitWorkout}
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-300 hover:bg-red-50 rounded-full border-2"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Exit
                          </Button>
                        </div>

                        {/* Set Progress Badges */}
                        <div className="flex gap-3 mb-6 flex-wrap">
                          {Array.from({ length: currentExercise.sets }, (_, i) => (
                            <Badge
                              key={i}
                              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                                i < currentSet - 1
                                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                                  : i === currentSet - 1
                                    ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                              }`}
                            >
                              Set {i + 1}
                            </Badge>
                          ))}
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 transition-all duration-500 ease-out rounded-full shadow-sm"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Exercise Display Card */}
                      <Card className="rounded-2xl shadow-xl p-8 bg-white/90 backdrop-blur-sm border-0 mb-6">
                        <CardContent className="p-0">
                          {/* Exercise Header */}
                          <div className="text-center mb-8">
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
    className="text-8xl mb-6"
  >
    {currentExercise.emoji}
  </motion.div>
  <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
    {currentExercise.name}
  </h2>

  <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
    {currentExercise.scheme && (
      <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-sm px-4 py-2 rounded-full font-medium border border-blue-200">
        {currentExercise.scheme}
      </Badge>
    )}
  </div>
</div>
                          {/* Sets & Reps Display */}
<div className="text-center mb-8">
  <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent mb-3">
    {currentExercise.scheme}
  </div>
</div>
                      {/* Timer for time-based exercises */}
                          {currentExercise.isTimeBased && (
                            <div className="mb-8">
                              <ExerciseTimer
                                duration={currentExercise.duration}
                                isActive={true}
                                onComplete={completeSet}
                                onReset={() => {}}
                              />
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                              onClick={completeSet}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-full px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                              <CheckCircle className="h-6 w-6 mr-2" />
                              Complete Set
                            </Button>

                            <Button
                              onClick={skipExercise}
                              variant="outline"
                              className="font-bold rounded-full px-10 py-4 text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300"
                            >
                              <SkipForward className="h-6 w-6 mr-2" />
                              Skip Exercise
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Motivational Messages */}
                      <motion.div
                        key={motivationIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 border border-purple-100">
                          <CardContent className="p-6">
                            <p className="text-sm text-gray-600 mt-2 font-medium">
                              {parsedExerciseCount - currentExerciseIndex} exercises to go
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Mobile Progress - Only show during workout */}
              {workoutStartTime && !workoutCompleted && (
                <div className="lg:hidden mt-6">
                  <Card className="rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border-0">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                          <div className="font-bold text-lg bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                            {completedExercises.length}/{parsedExerciseCount}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Exercises</div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl">
                          <div className="font-bold text-lg bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                            {completedSets}/{totalSets}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Sets</div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                          <div className="font-bold text-lg bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                            {formatTime(elapsedTime)}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Time</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="text-center">
                <div className="text-8xl mb-4">🎉</div>
                <div className="text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 rounded-full shadow-2xl">
                  {setCompletionMessages[Math.floor(Math.random() * setCompletionMessages.length)]}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
