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
2. Generate a 7-day fitness program using the exact structure below. It must be consistent and parseable.

--- USER PROFILE ---
- Workout Level: ${data.WorkoutLevel}
- Training Methods: ${data.TrainingMethod?.join(", ")}
- Training Frequency, how many times per week to exercise not any more, only the times the user picked: ${data.TrainingFrequency}
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
{muscle groups or body areas emphasized — e.g. Upper Body or Legs + Core}  
Main Exercises:  
{emoji} <> {exercise name} <> {reps OR duration} x {sets} sets <> {rest time otherwise type 0} <> {short clear instruction on how to perform it} <> {estimated calories for that exercise}

Example:  
💪 <> Push ups <> 15 reps x 3 sets <> 45 sec rest <> Keep your back straight, lower to 90°, push up. <> 100

Mindset Tip:  
Pass_mindset_tip  
Total Exercises: {count the exercises under "Main Exercises", be extremely careful to count exactly the number of exercises}  
Duration: {estimated session duration in minutes, e.g., 40 min}  
Calories: {sum of the calories for all exercises — just a number, no units}

--- RULES FOR FORMAT (STRICT) ---
- Do not forget a signle part of the stucture like Mindset, workout focus and so on
- DO NOT write bullet points or markdown — plain text only.
- Each warm-up and each exercise must be on a new line.
- Always include sets, even for cardio or time-based exercises. (e.g. 🫁 <> Run <> 20 min x 1 set)
- Emojis:
  - 💪 = Upper Body
  - 🦵 = Legs
  - 🧘 = Mobility/Flexibility
  - 🧠 = Core
  - 🫁 = Cardio/Endurance
  - 😴 = Rest Day (if no workout)

- For rest days, use this:
Main Exercises:  
😴 <> Rest Day <> No resttime applicable

- For other forms like stretching or planks, use the same format:
🧘 <> Plank hold <> 1 min x 2 sets <> 30 sec rest <> Maintain straight line, engage core. <> 60

📝 EXERCISE COUNT RULES:

- For most days (strength, mobility, gym workouts, calisthenics): include **6-10 exercises**.
- For light or recovery days (yoga, mobility, rehab): 3-5 exercises are acceptable.
- For cardio-intensive days (HIIT, endurance runs, cycling, swimming intervals): use common sense. Focus on variety within the method (intervals, drills, technique), not quantity. Exercise count may range from 4-6 if intervals are involved.

Do NOT undertrain the day. Ensure the workload fits the user's goal.

Always include a **Total Exercises count**, accurately reflecting the "Main Exercises" block.


- "Reps OR duration" means use either like "15 reps" or "2 min" <> then follow with x 3 sets.

If Training Method includes "Swimming", generate swimming workouts like:

Interval laps (e.g., 10 x 100m Freestyle)

Distance sets (e.g., 500m continuous swim)

Stroke variation (e.g., Freestyle, Backstroke, Breaststroke)

Use meters (m) for distance, not reps.

Rest between sets should reflect swimming rest periods (e.g., 30 sec, 1 min)

Example format:
🫁 <> 100m Freestyle <> x 10 sets <> 30 sec rest <> Swim at moderate pace, focus on form. <> 300

If Training Method includes "Yoga / Pilates", create routines like flows, holds, and stretches. Use time-based sets.

If Training Method includes "Rehab / Therapy", focus on light mobility, stability, and corrective movements.

If Training Method includes "Hiking", include time or distance-based walking/hiking plans.

Maintain emojis as per guidelines, but adapt the activity to match the method.


--- FORMAT RULES (STRICT) ---
- ✅ Always use "x" between reps and sets (e.g., 12 reps x 3 sets)

- ✅ Emojis must appear ONLY:
  - At the start of warm-up lines
  - At the start of each exercise line
  - At the start of the day title (e.g., Day 3: Cardio & Strength 💪)

- ❌ NEVER add emojis:
  - Inside instructions
  - Inside mindset tips
  - Inside duration, calories, muscle group, or anywhere except start of the line

- ✅ Each warm-up or exercise must be on one single line. NO line breaks or bullets.

- ✅ If an exercise has no rest time, still include: - 0 sec rest

- In rest time section do it like this:
1 minute 30 sec rest  
30 sec rest  
1 minute rest

- ALWAYS follow this format exactly. Format must stay consistent and easy to parse in code.
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
