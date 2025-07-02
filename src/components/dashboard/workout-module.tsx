import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { supabase } from "@/components/lib/supabaseClient";
import { useUser } from "@clerk/clerk-react"
import { Play, RotateCcw, Pause, SkipForward, Timer, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useFullFitnessPlan from "@/hooks/useFullFitnessPlan";


export function WorkoutModule() {
  const todayKey = new Date().toDateString();
  const { user } = useUser()
const workoutCompletedTodayed = localStorage.getItem("workout_done_" + todayKey) === "true";
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [totalSets, setTotalSets] = useState(0);
const [totalReps, setTotalReps] = useState(0);
const [totalCalories, setTotalCalories] = useState(0);
const [totalDuration, setTotalDuration] = useState("0 min");

  const navigate = useNavigate()
  const startWorkout = () => {
    navigate("/the-arena")
  }
const [workoutStats, setWorkoutStats] = useState({
  duration: "",
  calories: "",
  totalExercises: "",
  title: "",
  scheme: "",
});
const [todaysWorkout, setTodaysWorkout] = useState({
  title: "",
  duration: "",
  calories: "",
  totalExercises: 0, // ✅ renamed to match your usage
  exercises_list: [],
});

 const { fullPlan: parsedFullPlan, weeklyPlan: parsedWeeklyPlan } = useFullFitnessPlan(user);
    
const todayPlan = parsedFullPlan.find(day => day.isToday);
const isTodayRestDayed = !todayPlan || todayPlan.exercises.length === 0;
useEffect(() => {
  const fetchPlan = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("onboarding_responses")
      .select("fitness_plan")
      .eq("user_id", user.id)
      .single();

    if (error || !data?.fitness_plan) {
      console.error("Failed to fetch fitness plan:", error);
      return;
    }

    const planText = data.fitness_plan.replace(/\r\n/g, "\n");

    const dayMap = {
      Mon: "Day 1",
      Tue: "Day 2",
      Wed: "Day 3",
      Thu: "Day 4",
      Fri: "Day 5",
      Sat: "Day 6",
      Sun: "Day 7",
    };

    const todayShort = new Date().toLocaleString("en-US", { weekday: "short" });
    const todayLabel = dayMap[todayShort];

    const daySectionMatch = planText.match(
      new RegExp(`${todayLabel}.*(?:\\n|\\r\\n)([\\s\\S]*?)(?=Day\\s*\\d+:|$)`, "i")
    );

    if (!daySectionMatch) {
      console.warn("No section found for today.");
      return;
    }

    const daySection = daySectionMatch[0];

    const getValue = (label) => {
      const regex = new RegExp(`${label}:\\s*(.*?)\\s*(\\n|$)`, "i");
      const match = daySection.match(regex);
      return match?.[1]?.trim() || "0";
    };

    const duration = getValue("Duration");
    const calories = getValue("Calories");


    const titleMatch = daySection.match(/^Day\s*\d+:\s*(.*)/m);
    const title = titleMatch?.[1]?.trim() || "Workout";
  const mainExercisesMatch = daySection.match(
  /Main Exercises:\s*\n([\s\S]*?)(?=\n[A-Z][a-z]+(?: [A-Z][a-z]+)*:|\n*$)/i
);

let scheme = "";
if (mainExercisesMatch) {
  const mainLines = mainExercisesMatch[1]
    .trim()
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (mainLines.length > 0) {
    const first = mainLines[0];
    const parts = first.split(/\s*-\s*/);
    const rawScheme = parts[2] || "";

    const match = rawScheme.match(/(\d+)\s*reps?\s*x\s*(\d+)\s*sets?/i);
    if (match) {
      const reps = match[1];
      const sets = match[2];
      scheme = `${sets} sets × ${reps} reps`;
    } else {
      scheme = rawScheme; // fallback
    }
  }
}


// 1. Extract today's section
const dayRegex = new RegExp(`${todayLabel}[\\s\\S]*?(?=Day \\d+:|$)`, "i");
const match = planText.match(dayRegex);
if (!match) return;

const section = match[0];

// 2. Extract Main Exercises
const mainMatch = section.match(/Main Exercises:\s*\n([\s\S]*?)(?=\n[A-Z][a-z]+:|\n*$)/i);
if (!mainMatch) return;

const mainLines = mainMatch[1]
  .trim()
  .split("\n")
  .map(line => line.trim())
  .filter(line => line);

const mainExercisesLines = mainExercisesMatch
  ? mainExercisesMatch[1]
      .trim()
      .split("\n")
      .map(line => line.trim())
      .filter(line =>
        line &&
        !line.toLowerCase().startsWith("mindset tip") &&
        !line.toLowerCase().startsWith("total exercises") &&
        !line.toLowerCase().startsWith("duration") &&
        !line.toLowerCase().startsWith("calories")
      )
  : [];


// 3. Parse each line into an exercise object
const parsedExercises = mainExercisesLines
  .map(line => line.trim())
  .filter(line =>
    line &&
    !line.toLowerCase().startsWith("mindset tip") &&
    !line.toLowerCase().startsWith("total exercises") &&
    !line.toLowerCase().startsWith("duration") &&
    !line.toLowerCase().startsWith("calories")
  )
  .map(line => {
    const parts = line.split(/\s*-\s*/);
    return {
      emoji: parts[0] || "🏋️",
      name: parts[1] || "",
      scheme: parts[2] || "",
    };
  });

const totalExercises = parsedExercises.length;

setTodaysWorkout({
  title,
  exercises_list: parsedExercises, 
  duration,
  calories,
  totalExercises
})

    setWorkoutStats({
      duration,
      calories,
      totalExercises,
      title,
      scheme,
    });
  };
    
  fetchPlan();
}, [user]);



  if (isWorkoutActive) {
    const exercise = todaysWorkout.exercises_list[currentExercise]
    const progress = ((currentExercise + (currentSet - 1) / exercise.sets) / todaysWorkout.exercises_list.length) * 100
  }

  return (
<Card className="border-none shadow-lg">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      🏋️‍♀️ AI-Generated Workout
    </CardTitle>
    <CardDescription>Personalized for your goals and energy level</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Today's Goal */}
<div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-4 rounded-lg">
  <h3 className="font-semibold mb-2">Today's Goal:</h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
    <span>🏃 {workoutStats?.totalExercises?? 0} Exercises</span>
    <span>🎯 {workoutStats?.calories?? 0} Calories</span>
    <span>⏱️ {workoutStats?.duration?? 0}</span>
  </div>
</div>


      {/* Workout Preview */}
      {todaysWorkout.exercises_list.length === 0 ? (
  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
    <p className="text-lg font-semibold">😴 Rest Day</p>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      Take time to recover — you’ve earned it!
    </p>
  </div>
) : (
  <div className="space-y-3">
  <h4 className="font-semibold text-xl mb-2">{todaysWorkout.title}</h4>
  <div className="grid gap-3">
    {todaysWorkout.exercises_list.map((exercise, index) => (
      <div
        key={index}
        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div className="text-2xl">{exercise.emoji}</div>
        <div className="flex-1">
          <p className="font-medium text-base">{exercise.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {exercise.scheme}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
)}

      {/* Start Button */}
     <Button
  onClick={startWorkout}
  disabled={workoutCompletedTodayed || isTodayRestDayed}
  className={`w-full mb-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white text-lg py-6 ${
    workoutCompletedTodayed || isTodayRestDayed
      ? "opacity-50 cursor-not-allowed"
      : "hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600"
  }`}
>
  <Play className="h-5 w-5 mr-2" />
  {workoutCompletedTodayed
    ? "Workout Completed"
    : isTodayRestDayed
    ? "Rest Day"
    : "Start Today's Workout"}
</Button>


    </div>
  </CardContent>
</Card>
  )
}
