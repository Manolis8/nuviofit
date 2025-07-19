import { supabase } from "@/components/lib/supabaseClient";

export async function generateFitnessPlan(userId: string) {
  // ✅ 1. Fetch onboarding data
  const { data, error } = await supabase
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error.message, error.details || "");
    throw new Error(`Supabase error: ${error.message}`);
  }
if (!data) {
  console.warn("⚠️ No onboarding data found for user:", userId);
  return null;
}


  // ✅ 2. Build dynamic prompt
const prompt = `
You are a certified fitness coach, exercise scientist, and mindset mentor.

Use the following onboarding data to perform 3 tasks:
1. Write a short, accurate "fitness persona" (4–6 sentences) based on their mindset, preferences, and background.
2. Generate a 7-day fitness program using the exact structure below. It must be consistent, parseable, and must NEVER skip any required part of the structure (especially Workout Focus, Mindset Tip, Total Exercises, Duration, Calories). These must appear without exception.

--- USER PROFILE ---
- Workout Level: ${data.WorkoutLevel}
- Training Methods: ${data.TrainingMethod?.join(", ")}
- Training Frequency (how many times per week to exercise; not more, only what user picked): ${data.TrainingFrequency}
- Training Duration per session: ${data.TrainingDuration}
- Past Workout History: ${data.workoutHistory}
- Achievements: ${data.achievements}
- Motivation (Why Fitness Matters): ${data.fitnessWhy?.join(", ")}, ${data.otherWhy}
- Future Vision: ${data.futureVision}
- Resilience Trigger: ${data.resilienceTrigger}
- Mental Barriers: ${data.consistencyBlocker}, ${data.customBlocker}
- Physical Barriers (Injuries or conditions): ${data.injuries}
- Comfort Zone Limit: ${data.pushingComfort}
- Support System: ${data.supportSystem} (${data.customSupport})
- Areas to Improve: ${data.WhatToImprove?.join(", ")}
- Personal Recommendations: ${data.recommedations}

--- PROGRAM STRUCTURE FORMAT ---

Day {number}: {Title and emoji}  
Warm-up:  
{emoji} <> {name} <> {duration}  
{emoji} <> {name} <> {duration}  
Workout Focus:  
{muscle groups or body areas emphasized — e.g., Upper Body or Legs + Core}  
Main Exercises:  
{emoji} <> {exercise name} <> {reps OR duration} x {sets} sets <> {rest time otherwise type 0} <> {short clear instruction on how to perform it} <> {estimated calories for that exercise}

Example:  
💪 <> Push ups <> 15 reps x 3 sets <> 45 sec rest <> Keep your back straight, lower to 90°, push up. <> 100

Mindset Tip:  
Pass_mindset_tip  
Total Exercises: {count the exercises under "Main Exercises", count with extreme precision}
Duration: {estimated session duration in minutes, e.g., 40 min}
Calories: {sum of the calories for all exercises — just a number, no units}

--- RULES FOR FORMAT (STRICT) ---
- Never forget a single required block, especially Mindset Tip, Workout Focus, Total Exercises, Duration, Calories.
- DO NOT use bullet points, markdown, or any other formatting — plain text only.
- Each warm-up and each exercise must appear on its own single line.
- Always include sets, even for cardio or time-based exercises. (e.g., 🫁 <> Run <> 20 min x 1 set)
- Emojis:
  - 💪 = Upper Body
  - 🦵 = Legs
  - 🧘 = Mobility/Flexibility
  - 🧠 = Core
  - 🫁 = Cardio/Endurance
  - 😴 = Rest Day (if no workout)

For rest days, use this exactly:
Main Exercises:  
😴 <> Rest Day <> No resttime applicable

For holds, stretches, planks:
🧘 <> Plank hold <> 1 min x 2 sets <> 30 sec rest <> Maintain straight line, engage core. <> 60

📝 EXERCISE COUNT RULES:
- Strength, mobility, gym, calisthenics: 6-10 exercises per day.
- Light/recovery (yoga, rehab, mobility): 3-5 exercises allowed.
- Cardio-intensive (HIIT, endurance, cycling, swimming): 4-6 exercises if intervals involved.

NEVER undertrain. Ensure workload matches user's goals.

Count exercises accurately for Total Exercises.

- "Reps OR duration" means either "15 reps" or "2 min" — use x {sets}.
- Swimming example:
🫁 <> 100m Freestyle <> x 10 sets <> 30 sec rest <> Swim at moderate pace, focus on form. <> 300

- Yoga/Pilates: flows, holds, stretches — time-based sets.
- Rehab: mobility, stability, light corrective.
- Hiking: time or distance-based walking plans.

Follow emojis strictly.

--- FORMAT RULES (STRICT) ---
- ✅ Always use "x" between reps and sets (e.g., 12 reps x 3 sets)
- ✅ Emojis only:
  - At start of warm-up lines
  - At start of each exercise line
  - At start of Day Title (e.g., Day 3: Cardio & Strength 💪)
- ❌ NEVER put emojis inside instructions, mindset tips, durations, calories, or muscle groups.
- ✅ Each warm-up or exercise on a single line, no breaks.
- ✅ If no rest time, include 0 sec rest.
- Rest time formatting:
1 minute 30 sec rest  
30 sec rest  
1 minute rest

FORMAT MUST BE CONSISTENT. DO NOT VARY.
`;



    // ✅ 3. Call your Vercel endpoint
const response = await fetch("/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [
      { role: "system", content: "You are a helpful personal trainer." },
      { role: "user", content: prompt }
    ],
  }),
});


  if (!response.ok) {
  const text = await response.text(); // capture error as plain text
  console.error("❌ Server error:", response.status, text);
  throw new Error(`API Error: ${response.status}`);
}

let result;
try {
  result = await response.json();
} catch (e) {
  console.error("❌ Failed to parse JSON:", e);
  throw new Error("Invalid JSON response from API.");
}

if (!result.reply) {
  console.error("❌ No 'reply' in response:", result);
  throw new Error("No plan returned from backend.");
}

  if (!result.reply) {
    console.error("❌ No response from OpenAI or serverless function:", result);
    throw new Error("No plan returned from backend.");
  }

  const generatedPlan = result.reply;

  // ✅ 4. Save to Supabase
  const { error: updateError } = await supabase
  .from("onboarding_responses")
  .upsert({
    user_id: userId,
    fitness_plan: generatedPlan
  }, { onConflict: "user_id" });


  if (updateError) {
    console.error("❌ Failed to save plan to Supabase:", updateError.message);
    throw new Error("Failed to save plan to Supabase.");
  }

  // ✅ 5. Return the plan
  return generatedPlan;
}
