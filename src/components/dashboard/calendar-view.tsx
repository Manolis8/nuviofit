import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/components/lib/supabaseClient";
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useFullFitnessPlan from "@/hooks/useFullFitnessPlan"
import { useUser } from "@clerk/clerk-react"

export function CalendarView() {
  const { user } = useUser()
  const [weeklyCount, setWeeklyCount] = useState(0);
  const { fullPlan: parsedFullPlan, weeklyPlan: parsedWeeklyPlan } = useFullFitnessPlan(user);
    const [workoutDays, setWorkoutDays] = useState(0);
    const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState<number | null>(null);
  const { weeklyFocusPlan } = useFullFitnessPlan(user)
  const baseDate = new Date();
  const reorderedPlan = [
  ...weeklyFocusPlan.slice(2),
  ...weeklyFocusPlan.slice(0, 2),
];

const jsDay = baseDate.getDay(); // 0 = Sunday
const currentWeekDay = jsDay === 0 ? 7 : jsDay;

const startOfWeek = new Date(baseDate);
startOfWeek.setDate(baseDate.getDate() - currentWeekDay + 1); // Monday
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


const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
const formattedStart = startOfWeek.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
});
const formattedEnd = endOfWeek.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
});
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
  const fetchCount = async () => {
    const { data } = await supabase
      .from("onboarding_responses")
      .select("workout_count")
      .eq("user_id", user.id)
      .single();

    if (data?.workout_count) {
      setWeeklyCount(data.workout_count);
    }
  };

  if (user?.id) fetchCount();
}, [user]);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">📅 Weekly Calendar</CardTitle>
            <CardDescription>Your scheduled activities and progress</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium px-3">{formattedStart} - {formattedEnd}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {parsedFullPlan.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                day.isToday
                  ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-purple-200 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 dark:border-purple-800"
                  : "bg-white border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
              }`}
            >

              {/* Day Header */}
<div className="text-center mb-3">
  <h3
    className={`font-semibold ${
      day.isToday
        ? "text-purple-700 dark:text-purple-300"
        : "text-gray-900 dark:text-white"
    }`}
  >
    {day.day}
  </h3>
  <p className="text-xs text-gray-500 dark:text-gray-400">
    {day.date}
  </p>
</div>


<div className="space-y-6">

  {/* Workout Section */}
  <div
    className={`p-2 rounded-lg ${
      day.completed
        ? "bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800"
        : "bg-gray-50 border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
    }`}
  >
    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
      {day.title || "Workout"}
    </p>
  </div>

  {/* Nutrition Section */}
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="p-2 rounded-lg bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🍽️</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Nutrition</span>
            <Lock className="h-3 w-3 text-gray-400 ml-auto" />
          </div>
          <p className="text-xs text-gray-400">Coming soon</p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>🔒 Nutrition planning coming soon!</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>

  {/* Mindset Section */}
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="p-2 rounded-lg bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🧘</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Mindset</span>
            <Lock className="h-3 w-3 text-gray-400 ml-auto" />
          </div>
          <p className="text-xs text-gray-400">Coming soon</p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>🔒 Mindset activities coming soon!</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                  </motion.div>
                ))}
        </div>
        {/* Week Summary - Only Workouts */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Week Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{weeklyCount}/{workoutDays}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Workouts Complete</p>
                  </div>
                  <div className="opacity-50">
                    <p className="text-2xl font-bold text-gray-400">🔒</p>
                    <p className="text-xs text-gray-400">Nutrition (Coming Soon)</p>
                  </div>
                  <div className="opacity-50">
                    <p className="text-2xl font-bold text-gray-400">🔒</p>
                    <p className="text-xs text-gray-400">Mindset (Coming Soon)</p>
                  </div>
                </div>
              </div>
      </CardContent>
    </Card>
  )
}
