import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/components/lib/supabaseClient";

export default function useFullFitnessPlan(user) {
  const [fullPlan, setFullPlan] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
const [weeklyFocusPlan, setWeeklyFocusPlan] = useState([]);


useEffect(() => {
  if (!user?.id) return;

  const fetchPlan = async () => {
    const { data, error } = await supabase
      .from("onboarding_responses")
      .select("fitness_plan")
      .eq("user_id", user.id)
      .single();

    if (error || !data?.fitness_plan) {
      console.error("❌ Failed to fetch fitness plan", error);
      return;
    }

    const planText = data.fitness_plan.replace(/\r\n/g, "\n");
    const cleanPlanText = planText.split(/Day\s*1:/i).join("Day 1:");
    const rawSections = cleanPlanText
      .split(/(?=Day\s*\d+:)/g)
      .filter(section => /^Day\s*\d+:/i.test(section.trim()));


    const parsedDays = rawSections.map((section, index) => {
      const lines = section.trim().split("\n");
      const titleLine = lines[0]?.replace(/Day\s*\d+:/, "").trim();
const isRestDay = lines.some(l => l.toLowerCase().includes("rest day"));
const mainIndex = lines.findIndex(l => l.toLowerCase().startsWith("main exercises:"));
const mindsetIndex = lines.findIndex(l => l.toLowerCase().startsWith("mindset tip:"));
const durationLine = lines.find(l => l.toLowerCase().startsWith("duration:"));
const calorieLine = lines.find(l => l.toLowerCase().startsWith("calories:"));
const totalLine = lines.find(l => l.toLowerCase().startsWith("total exercises:"));

const focusIndex = lines.findIndex(l => l.toLowerCase().startsWith("workout focus:"));
const focus = focusIndex !== -1 && lines[focusIndex + 1]?.trim()
  ? lines[focusIndex + 1].trim()
  : (isRestDay ? "Rest Day" : "Workout");

const duration = durationLine?.split(":")[1]?.trim() || "0 min";
const calories = calorieLine?.split(":")[1]?.trim() || "0";
const totalExercises = parseInt(totalLine?.split(":")[1]?.trim()) || 0;


      let exerciseLines = [];
      if (mainIndex !== -1) {
        exerciseLines = lines.slice(
          mainIndex + 1,
          mindsetIndex !== -1 ? mindsetIndex : lines.length
        );
      }

      const exercises = !isRestDay
        ? exerciseLines
            .map(l => l.trim())
            .filter(l =>
              l &&
              !l.toLowerCase().startsWith("main exercises:") &&
              !l.toLowerCase().startsWith("mindset tip:")
            )
            .map(line => {
              const parts = line.split(/\s*-\s*/).map(p => p.trim());
              return {
                id: uuidv4(),
                emoji: parts[0] || "",
                name: parts[1] || "",
                scheme: parts[2] || "",
                resttime: parts[3] || "",
                calories: parts[5] || "0",
                completed: false,
                originalLine: line,
              };
            })
        : [];

const baseDate = new Date();
const today = new Date(); // 👈 add this

const jsDay = baseDate.getDay();
const currentWeekDay = jsDay === 0 ? 7 : jsDay;

const workoutDate = new Date();
workoutDate.setDate(baseDate.getDate() - currentWeekDay + index + 1);

// ✅ Normalize both dates to midnight for exact comparison
const workoutDateStart = new Date(workoutDate);
workoutDateStart.setHours(0, 0, 0, 0);

const todayStart = new Date(today);
todayStart.setHours(0, 0, 0, 0);

const isToday = workoutDateStart.getTime() === todayStart.getTime();

// ✅ Format nicely (still safe to keep this)
const formattedDate = workoutDate.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  weekday: "short",
});

return {
  day: `Day ${index + 1}`,
  title: titleLine || `Day ${index + 1}`,
  date: formattedDate,
  isToday, // 👈 now this will actually be true for today
  exerciseCount: totalExercises,
  duration,
  calories,
  exercises,
  focus
};

    });

    // Set fullPlan
    setFullPlan(parsedDays);

    // ✅ Weekly UI data
    setWeeklyPlan(
      parsedDays.map(day => {
        const emojiMatch = day.title.match(/([\p{Emoji}])/u);
        const emoji = emojiMatch?.[1] || "🏋️";
        const isRest = day.exercises.length === 0;

        return {
          day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
          date: day.date,
          workout: {
            icon: isRest ? "🛌" : emoji,
            title: isRest ? "Rest Day" : day.title,
            completed: false,
          },
        };
      })
    );

    // ✅ Workout Focus only
    setWeeklyFocusPlan(
      parsedDays.map(day => {
        const emojiMatch = day.title.match(/([\p{Emoji}])/u);
        const emoji = emojiMatch?.[1] || "🏋️";
        const isRest = day.exercises.length === 0;

        const focusMatch = planText.match(/Workout Focus:\s*\n([\s\S]*?)(?=\n[A-Z][a-z]+(?: [A-Z][a-z]+)*:|\n*$)/i);
        const focusText = isRest ? "Rest Day" : focusMatch?.[1]?.trim() || "Workout";

        return {
          day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
          emoji: isRest ? "🛌" : emoji,
          focus: focusText,
          isRest,
        };
      })
    );
  };

  fetchPlan();
}, [user]);

return { fullPlan, weeklyPlan, weeklyFocusPlan };

}
