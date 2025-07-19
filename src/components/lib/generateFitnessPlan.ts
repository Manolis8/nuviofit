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

Your job is to use the provided onboarding data to complete **3 tasks** with strict consistency.

## TASKS:
1. Write a short and accurate **"fitness persona" (4–6 sentences)** based on the user's mindset, preferences, and background.
2. Generate a **7-day fitness program** using the exact structure below. Follow the format precisely.
3. For every training day, **ALWAYS include a Mindset Tip**. Never skip it.


## USER PROFILE:
- Workout Level: ${data.WorkoutLevel}
- Training Methods: ${data.TrainingMethod?.join(", ")}
- Training Frequency (sessions per week only as selected): ${data.TrainingFrequency}
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


## PROGRAM STRUCTURE EXAMPLE:

Day {number}: {Title and emoji}  
Warm-up:  
{emoji} <> {name} <> {duration}  
{emoji} <> {name} <> {duration}  
Workout Focus:  
{muscle groups or body areas emphasized}  
Main Exercises:  
{emoji} <> {exercise name} <> {reps OR duration} x {sets} sets <> {rest time, otherwise type 0} <> {short clear instruction on form} <> {estimated calories}

Example:
💪 <> Push ups <> 15 reps x 3 sets <> 45 sec rest <> Keep your back straight, lower to 90°, push up. <> 100

Mindset Tip:  
{short motivational sentence related to discipline, consistency, or long-term goals}  

Total Exercises: {count only Main Exercises accurately}  
Duration: {estimated session duration, e.g., 40 min}  
Calories: {sum of calories for all Main Exercises, just a number}


## FORMAT RULES (STRICT):
- NEVER skip **Warm-up**, **Workout Focus**, **Main Exercises**, **Mindset Tip**, **Total Exercises**, **Duration**, or **Calories**.
- NEVER forget Mindset Tip. It is mandatory, not optional.
- Plain text only. No markdown, no bullet points.
- Warm-up and Main Exercises: each on its own line.
- Use emojis ONLY:
  ✅ At the start of warm-up lines  
  ✅ At the start of each Main Exercise line  
  ✅ In the Day title  
- NEVER put emojis inside instructions, durations, calories, etc.
- Use "x" between reps and sets (e.g., 12 reps x 3 sets).
- For rest time:
  30 sec rest  
  1 minute rest  
  1 minute 30 sec rest  

For warm-up and stretching/planks:  
🧘 <> Plank hold <> 1 min x 2 sets <> 30 sec rest <> Maintain alignment. <> 60

For cardio:  
🫁 <> Run <> 20 min x 1 set <> 0 rest <> Moderate pace. <> 200


## REST DAY FORMAT (MANDATORY):
Main Exercises:
😴 <> Rest Day <> No resttime applicable

Still include:  
Mindset Tip  
Total Exercises: 0  
Duration: 0  
Calories: 0


## EXERCISE COUNT RULES:
- Strength, gym, mobility, calisthenics: 6–10 exercises.
- Recovery/yoga/rehab: 3–5 exercises.
- Cardio/HIIT: 4–6 exercises if intervals are involved.
- Swimming: Intervals, distances, strokes. Use meters (m), not reps.
- Hiking: Distance/time-based. Keep structure consistent.

Workload must match user's goal and frequency. Never undertrain.


## SPECIAL METHODS:
If "Swimming":  
🫁 <> 100m Freestyle <> x 10 sets <> 30 sec rest <> Swim at moderate pace, focus on form. <> 300

If "Yoga / Pilates":  
Flows, holds, stretches. Time-based sets.

If "Rehab / Therapy":  
Light mobility, stability, corrective work.

If "Hiking":  
Distance or time-based walking plans.


## FINAL REMINDER:
- NEVER omit **Mindset Tip**.
- Ensure ALL parts of the format appear for EVERY day.
- Do NOT make up your own format.
- Keep consistency so code can parse this easily.

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
