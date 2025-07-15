import { supabase } from "@/components/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"
import { v4 as uuidv4 } from "uuid";
import useFullFitnessPlan from "@/hooks/useFullFitnessPlan";
import { motion } from "framer-motion"
import { CheckCircle, Clock, Flame, Target, ChevronDown, ChevronUp, Play, Calendar, Thermometer } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useUserContext } from "@/context/UserContext";
import React, { useRef } from "react";


export default function WorkoutPage() {

const isMounted = useRef(true);

useEffect(() => {
  return () => {
    isMounted.current = false;
  };
}, []);


const [onboardingData, setOnboardingData] = useState(null);
  const { user, isLoaded } = useUser();
    const user_id = user?.id;
useEffect(() => {
  if (!user_id) return; // wait for user

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("onboarding_responses")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    if (!data) {
      console.warn("No onboarding data found for user", user_id);
      return;
    }

    setOnboardingData(data);
  };

  fetchData();
}, [user_id]);


const baseDate = new Date();
const jsDay = baseDate.getDay(); // 0 = Sunday
const currentWeekDay = jsDay === 0 ? 7 : jsDay;

const startOfWeek = new Date(baseDate);
startOfWeek.setDate(baseDate.getDate() - currentWeekDay + 1); // Monday


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

// Progress data
const progressData = {
  workoutsThisWeek: 2,
  totalWorkouts: 5,
}


      const todayKey = new Date().toDateString();
const workoutCompletedTodayed = localStorage.getItem("workout_done_" + todayKey) === "true";
   const [fullPlan, setFullPlan] = useState([]);
const [activeTab, setActiveTab] = useState("today")
  const [exercises, setExercises] = useState([]); // ✅ Start with empty array
  const [expandedWorkouts, setExpandedWorkouts] = useState<string[]>([])
  const [warmUpCompleted, setWarmUpCompleted] = useState(false)
  const { fullPlan: parsedFullPlan, weeklyPlan: parsedWeeklyPlan } = useFullFitnessPlan(user);
  const [warmUpExercises, setWarmUpExercises] = useState<
  { name: string; duration: string; description?: string }[]
>([]);
const todayPlan = parsedFullPlan.find(day => day.isToday);
const isTodayRestDayed = !todayPlan || todayPlan.exercises.length === 0;

useEffect(() => {
  sessionStorage.removeItem("alreadyAlerted");
}, []);

const [weeklyCount, setWeeklyCount] = useState(0);

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

  const [userProfile, setUserProfile] = useState({
    goal: "",
    trainingStyle: "",
    timePerDay: "",
    level: "",
    workoutsPerWeek: 0,
    fitnessPlan: "",
  })
const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState<number | null>(null);

  const [workoutDays, setWorkoutDays] = useState(0);
const [workoutFocus, setWorkoutFocus] = useState("");
const [workoutTitle, setWorkoutTitle] = useState("");
const [workoutDuration, setWorkoutDuration] = useState("");
const [workoutTotalExercises, setWorkoutTotalExercises] = useState("");
const [workoutCalories, setWorkoutCalories] = useState("");
const today = new Date().toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.


const workout = fullPlan.find(w => w.isToday);


const { setupFinished } = useUserContext();

useEffect(() => {
  if (!user?.id || !setupFinished) return; // ⛔ Don't fetch until onboarding done

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

    if (isMounted.current) {
    setWorkoutDaysPerWeek(countWorkoutDays(planText));
}

    if (!planText) {
      console.warn("⚠️ No plan text found");
      return;
    }

    const workoutCount = countWorkoutDays(planText);
    if (isMounted.current) {
    setWorkoutDays(workoutCount);
}
  };

  fetchPlan();
}, [user, setupFinished]);



useEffect(() => {
  const fetchUserProfile = async () => {
    if (!user) return;


    const { data, error } = await supabase
      .from("onboarding_responses")
      .select(`
        fitness_why,
        training_method,
        training_duration,
        workout_level,
        training_frequency,
        fitness_plan
      `)
      .eq("user_id", user.id)
      .single();

    if (error) {
      return;
    }

    // Set user profile
    if (isMounted.current) setUserProfile({
      goal: data.fitness_why,
      trainingStyle: data.training_method,
      timePerDay: data.training_duration,
      level: data.workout_level,
      workoutsPerWeek: data.training_frequency,
      fitnessPlan: data.fitness_plan,
    });

    const planText = (data.fitness_plan ?? "").replace(/\r\n/g, "\n")


    
const todayShort = new Date().toLocaleString("en-US", { weekday: "short" }); // 'Mon', 'Tue', etc.

const dayMap = {
  Mon: "Day 1",
  Tue: "Day 2",
  Wed: "Day 3",
  Thu: "Day 4",
  Fri: "Day 5",
  Sat: "Day 6",
  Sun: "Day 7",
};
const todayLabel = dayMap[todayShort];

if (!todayLabel) {
  console.warn("⚠️ Could not determine today's label");
  return;
}

// 3. Extract today's workout section
const daySectionRegex = new RegExp(
  `${todayLabel}.*(?:\\n|\\r\\n)([\\s\\S]*?)(?=Day\\s*\\d+|$)`,
  "i"
);
const daySectionMatch = planText.match(daySectionRegex);
if (!daySectionMatch) {
  console.warn(`⚠️ No day section found for label: ${todayLabel}`);
  return;
}
const daySection = daySectionMatch[0];

// 4. Extract Workout Focus
const focusMatch = daySection.match(/Workout Focus:\s*\n([\s\S]*?)(?=\n[A-Z][a-z]+(?: [A-Z][a-z]+)*:|\n*$)/i);
const focus = focusMatch ? focusMatch[1].trim() : "";
setWorkoutFocus(focus);

const durationMatch = daySection.match(/Duration:\s*([\s\S]*?)(?=\n[A-Z][a-z]+:|\n*$)/);
const duration = durationMatch ? durationMatch[1].trim() : "";
setWorkoutDuration(duration);


const totalexMatch = daySection.match(/Total Exercises:\s*([\s\S]*?)(?=\n[A-Z][a-z]+:|\n*$)/);
const totalex = totalexMatch ? totalexMatch[1].trim() : "";
setWorkoutTotalExercises(totalex);

const caloriesMatch = daySection.match(/Calories:\s*([\s\S]*?)(?=\n[A-Z][a-z]+:|\n*$)/);
const calories = caloriesMatch ? caloriesMatch[1].trim() : "";
setWorkoutCalories(calories);

  const titleMatch = daySection.match(/^Day\s*\d+:\s*(.*)/m);
  const title = titleMatch ? titleMatch[1].trim() : "";
  setWorkoutTitle(title);
  
const dayRegex = /Day\s*(\d+):\s*([^\n]+)?\s*\n([\s\S]*?)(?=Day\s*\d+:|$)/gi;

let match;
while ((match = dayRegex.exec(planText)) !== null) {
  const dayNumber = parseInt(match[1]);
  const title = (match[2] || "").trim(); // e.g., "Endurance Kickoff 🫁"
  const content = match[3].trim();

  dayMap[dayNumber] = {
    title,
    content,
  };
}

const todayDayNumber = new Date().getDay() === 0 ? 7 : new Date().getDay();
const todayData = dayMap[todayDayNumber];

if (!todayData) {
  console.warn("⚠️ No data found for today (Day " + todayDayNumber + ")");
  return;
}

const todaySection = todayData.content;
const titleLine = todayData.title;


// ✅ Make sure this line exists above (needed!)
const lines = todaySection.trim().split("\n").map(l => l.trim());

// ✅ Extract Warm-up exercises
const warmupIndex = lines.findIndex(line =>
  line.toLowerCase().startsWith("warm-up:") ||
  line.toLowerCase().startsWith("warm up:")
);

if (warmupIndex !== -1) {
  const nextSectionIndexCandidates = [
    lines.findIndex((line, idx) => idx > warmupIndex && line.toLowerCase().startsWith("main exercises:")),
    lines.findIndex((line, idx) => idx > warmupIndex && line.toLowerCase().startsWith("mindset tip:")),
    lines.findIndex((line, idx) => idx > warmupIndex && line.toLowerCase().startsWith("workout focus:")),
    lines.findIndex((line, idx) => idx > warmupIndex && line.toLowerCase().startsWith("calories:")),
  ].filter(i => i !== -1);

  const nextSectionIndex = nextSectionIndexCandidates.length > 0
    ? Math.min(...nextSectionIndexCandidates)
    : lines.length;

  const warmupLines = lines.slice(warmupIndex + 1, nextSectionIndex);

  const warmUps = warmupLines
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(/\s*<>\s*/);
      return {
        emoji: parts[0] || "",
        name: parts[1] || "",
        duration: parts[2] || "",
      };
    });

  setWarmUpExercises(warmUps);
} else {
  setWarmUpExercises([]); // fallback if no warm-ups
}


// 6. Extract Main Exercises
const mainExercisesMatch = daySection.match(
  /Main Exercises:\s*\n([\s\S]*?)(?=\n[A-Z][a-z]+(?: [A-Z][a-z]+)*:|\n*$)/i
);

if (mainExercisesMatch) {
  const mainExercisesLines = mainExercisesMatch[1]
    .trim()
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.toLowerCase().startsWith("mindset tip"));

  const exercises = mainExercisesLines.map(line => {
    const parts = line.split(" <> ").map(part => part.trim());

    return {
      id: uuidv4(),
      name: parts[0] || "",
      scheme: parts[1] || "",       
      muscleGroup: parts[2] || "",
      completed: false,
      originalLine: line,
    };
  });

  setExercises(exercises);
}

    if (!daySectionMatch) {
      return;
    }
    // Extract Main Exercises
    if (!mainExercisesMatch) {
      return;
    }
    const mainExercisesLines = mainExercisesMatch[1]
      .trim()
      .split("\n")
      .map(line => line.trim())
      .filter(line => line);

    const exercises = mainExercisesLines.map((line) => {
  const parts = line.split(" <> ").map((part) => part.trim());

  return {
    id: uuidv4(),
    name: parts[1] || "",
    scheme: parts[2] || "", // sets x reps or duration
    emoji: parts[0] || "",
    completed: false,
    originalLine: line,
  };
});

setExercises(exercises);


const splitAtDayOne = planText.split(/Day\s*1:/i);

if (splitAtDayOne.length < 2) {
  return;
}

  };
  
  fetchUserProfile();
}, [user]);


const toggleWorkout = (id: string) => {
  setExpandedWorkouts(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  );
};
const todayWorkout = parsedFullPlan?.find(day => day.isToday);

const navigate = useNavigate()

  const startWorkout = () => {
   if (!workoutCompletedTodayed) {
    navigate("/the-arena");
  }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-emerald-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">🏋️ Fitness Plan</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Your personalized AI-powered workout journey</p>
          </motion.div>

          {/* Personal Tags Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🧬 Your Fitness Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <span className="font-medium">Goal:</span>
                    <Badge variant="secondary">{userProfile.goal}</Badge>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                    <span className="font-medium">Style:</span>
                    <Badge variant="secondary">{userProfile.trainingStyle}</Badge>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <span className="font-medium">Time:</span>
                    <Badge variant="secondary">{userProfile.timePerDay}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="today">📋 Today</TabsTrigger>
              <TabsTrigger value="weekly">📅 Weekly</TabsTrigger>
              <TabsTrigger value="plan">📃 Full Plan</TabsTrigger>        
            </TabsList>

            {/* Today's Workout Tab */}
            <TabsContent value="today">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Workout Section */}
                <div className="lg:col-span-2">
  {isTodayRestDayed ? (
    // 🟡 Rest Day UI
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-10 px-6 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700 shadow-inner"
    >
      <h2 className="text-3xl font-bold text-yellow-800 dark:text-yellow-100 mb-4">
        🛌 Rest Day!
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Your body grows stronger on recovery days. Enjoy the break and come back energized!
      </p>
    </motion.div>
  ) : (
    <>
                  {/* Warm-Up Card */}
                  {!warmUpCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mb-6"
                    >
                      <Card className="border-none shadow-xl bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-emerald-950/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Thermometer className="h-6 w-6 text-blue-500" />🧊 Warm-Up Phase
                          </CardTitle>
                          <CardDescription>
                            Prepare your body for the workout ahead. A proper warm-up increases blood flow, reduces
                            injury risk, and improves performance.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {warmUpExercises.map((exercise, index) => (
                              <div key={index} className="p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                                <p className="font-medium text-sm">{exercise.emoji} {exercise.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{exercise.duration}</p>
                              </div>
                            ))}
                          </div>
                          <Button
                            className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white"
                          >
                            ✅ Start Warm-Up (Comming Soon!)
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm mb-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">{workoutTitle}</CardTitle>
                          <CardDescription className="text-lg">
                            {userProfile.level} • {workoutDuration} • {workoutTitle}
                          </CardDescription>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                          <p className="font-semibold">{workoutDuration}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <Flame className="h-6 w-6 text-red-500 mx-auto mb-1" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                          <p className="font-semibold">~{workoutCalories}</p>
                        </div>
                        <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                          <Target className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Exercises</p>
                          <p className="font-semibold">{todayWorkout?.exercises?.length ?? 0}</p>
                        </div>
                      </div>

                      {/* Start Workout Button */}
<Button
  onClick={startWorkout}
  disabled={workoutCompletedTodayed}
  className={`w-full mb-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white text-lg py-6 ${
    workoutCompletedTodayed ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600"
  }`}
>
  <Play className="h-5 w-5 mr-2" />
  {workoutCompletedTodayed ? "Workout Completed" : "Start Today's Workout"}
</Button>


                      {/* Exercise List */}
                      <div className="space-y-4">
                        {exercises.map((exercise, index) => (
                          <motion.div
                            key={exercise.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`p-4 rounded-lg border transition-all ${
                              exercise.completed
                                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{exercise.emoji}</span>
                                <div>
                                  <h3 className="font-semibold">{exercise.name}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400"> {exercise.scheme}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
    </>
  )}
</div>

                {/* Quick Stats Sidebar */}
<div className="space-y-6">
  <Card className="border-none shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">📈 Quick Stats</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-base">Weekly Progress</span>
            <p className="text-sm text-muted-foreground">
              You’ve completed {weeklyCount} out of {workoutDays} workouts
            </p>
          </div>
          <Badge>
            {weeklyCount}/{workoutDays}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Edit Plan Button */}
  <div className="flex justify-end">
    <a
      href="/edit-fitness-plan"
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
    >
      ✏️ Edit Fitness Plan
    </a>
  </div>
</div>

              </div>
            </TabsContent>

            {/* Weekly View Tab */}
<TabsContent value="weekly">
  <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">📅 This Week's Plan</CardTitle>
      <CardDescription>
        {formattedStart} - {formattedEnd}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {parsedFullPlan.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
              day.isToday
                ? "bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 border-blue-200 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-emerald-950/30 dark:border-blue-800"
                : day.completed
                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                : "bg-white border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700"
            }`}
          >
            {day.isToday && (
              <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                Today
              </Badge>
            )}
            <div className="text-center mb-3">
              <h3 className="font-semibold">{day.day}</h3>
              <p className="text-xs text-gray-500">{day.date}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">
                {day.title?.match(/[\p{Emoji}]/u)?.[0] || "🏋️"}
              </div>
              <p className="text-sm font-medium">
  {(day.title || "Training").replace(/[\p{Emoji}]/gu, '').trim()}
</p>
              <p className="text-xs text-gray-500 mt-1">
                {day.exercises.length > 0 ? `${day.exercises.length} exercises` : "Rest day"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
</TabsContent>

{/* Full Plan Tab - Simplified */}
<TabsContent value="plan">
  <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">📃 Complete Workout Schedule</CardTitle>
      <CardDescription>Your personalized fitness plan with detailed exercises</CardDescription>
    </CardHeader>
    <CardContent>

      <div className="space-y-4">
        {parsedFullPlan.map((workout, index) => (
          <Collapsible
            key={`day-${index}`}
            open={expandedWorkouts.includes(`day-${index}`)}
            onOpenChange={() => toggleWorkout(`day-${index}`)}
          >
            <CollapsibleTrigger asChild>
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  workout.isToday
                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950/20 dark:to-cyan-950/20 dark:border-blue-800"
                    : workout.completed
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs text-gray-500">{workout.date || workout.day}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{workout.title}</h3>
                        {workout.completed && (
                          <Badge className="bg-green-500 text-white">✅ Done</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {workout.duration} {workout.calories && `• ${workout.calories} kcal`}
                      </p>
                    </div>
                  </div>
                  {expandedWorkouts.includes(`day-${index}`) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {workout.exercises?.length > 0 ? (
                <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workout.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-3"
                      >
                        <span className="text-xl">{exercise.emoji}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {exercise.name}
                            {exercise.scheme && (
                              <span className="block text-xs text-gray-500">
                                {exercise.scheme}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border text-center">
                  <p className="text-gray-600 dark:text-gray-400">Rest day - No exercises scheduled</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </CardContent>
  </Card>
</TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
