import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Flame, Target, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/components/lib/supabaseClient";

const motivationalQuotes = [
  "💪 Keep going — you're are doing great!",
  "🔥 Your consistency is paying off!",
  "⚡ Energy builds with every workout!",
  "🎯 You're closer to your goal than yesterday!",
  "🌟 Champions are made in moments like this!",
  "💥 You’re awesome!",
]

export function UserWelcomeSection() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0])
  const [weeklyProgress] = useState(4)
  const [currentStreak] = useState(6)
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const { user, isLoaded } = useUser()
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [workoutDays, setWorkoutDays] = useState(0);
  const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
  const fetchPlan = async () => {
    const { data, error } = await supabase
      .from("onboarding_responses")
      .select("fitness_plan")
      .eq("user_id", user.id)
      .single();

    if (error || !data?.fitness_plan) {
      console.error("❌ Failed to fetch plan", error);
      return;
    }

    const planText = data.fitness_plan?.replace(/\r\n/g, "\n");

const countWorkoutDays = (plan: string) => {
  const sections = plan
    .split(/(?=Day\s*\d+:)/gi)
    .filter(section => /^Day\s*\d+:/i.test(section.trim()));

  const workoutDays = sections.filter(section =>
    !/rest day/i.test(section)
  );

  return workoutDays.length;
};

setWorkoutDaysPerWeek(countWorkoutDays(planText)); // ✅ Save result into state

    if (!planText) {
      console.warn("⚠️ No plan text found");
      return;
    }

    const workoutCount = countWorkoutDays(planText);
    setWorkoutDays(workoutCount);
    
  };

  if (user?.id) fetchPlan();
}, [user]);

  useEffect(() => {
  const checkAndResetWeeklyCount = async () => {
    if (!user?.id) return;

    const today = new Date();
    const isMonday = today.getDay() === 1; // Monday = 1

    const weekKey = today.toISOString().slice(0, 10); // e.g., '2025-06-24'
    const lastReset = localStorage.getItem("last_week_reset");

    if (isMonday && lastReset !== weekKey) {
      // It's Monday and we haven't reset yet this week
      const { error } = await supabase
        .from("onboarding_responses")
        .update({ workout_count: 0 })
        .eq("user_id", user.id);

      if (!error) {
        localStorage.setItem("last_week_reset", weekKey);
        setWeeklyCount(0);
        console.log("✅ Workout count reset for the new week");
      } else {
        console.error("❌ Failed to reset workout count", error);
      }
    } else if (!isMonday) {
      // Allow next Monday to reset again
      localStorage.removeItem("last_week_reset");
    } else {
      // It's still Monday, already reset — fetch existing count
      const { data } = await supabase
        .from("onboarding_responses")
        .select("workout_count")
        .eq("user_id", user.id)
        .single();

      if (data?.workout_count !== undefined) {
        setWeeklyCount(data.workout_count);
      }
    }
  };

  checkAndResetWeeklyCount();
}, [user]);

useEffect(() => {
    // Handler to update width
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Initial width set
    handleResize();

    // Listen to resize events
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (!isLoaded) return null

  const displayName =
    user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "User"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="overflow-hidden border-none bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20 shadow-lg">
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
      Welcome back
      {windowWidth !== undefined && windowWidth >= 540 ? `, ${displayName}` : ""} 👋
    </h1>
                <motion.p
                  key={currentQuote}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg text-white/90 mt-1"
                >
                  {currentQuote}
                </motion.p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 w-full md:w-auto">
              {/*<div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Flame className="h-5 w-5 text-orange-300" />
                  <span className="text-2xl font-bold">{currentStreak}</span>
                </div>
                <p className="text-sm text-white/80">Day Streak</p>
              </div>*/}
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Target className="h-5 w-5 text-green-300" />
                  <span className="text-2xl font-bold">{weeklyCount}/{workoutDays}</span>
                </div>
                <p className="text-sm text-white/80">This Week</p>
              </div>
            </div>
          </div>

          {/* Weekly Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Weekly Workout Progress</span>
              <span className="text-sm">{weeklyCount}/{workoutDays}</span>
            </div>
            <Progress
              value={(weeklyCount/workoutDays) * 100}
              className="h-3 bg-white/20"
              indicatorClassName="bg-gradient-to-r from-yellow-400 to-orange-400"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
