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
    throw new Error("No onboarding data found for user.");
  }

  // ✅ 2. Build dynamic prompt
const prompt = `
You are a certified fitness coach, exercise scientist, and mindset mentor.

Use the following onboarding data to perform 3 tasks:
1. Write a short, accurate "fitness persona" (4–6 sentences) based on their mindset, preferences, and background.
2. Generate a 7-day fitness program using the exact structure below. It must be consistent and parseable.
3. Add a unique motivational "Mindset Tip" for each day.

--- USER PROFILE ---
- Workout Level: ${data.WorkoutLevel}
- Training Methods: ${data.TrainingMethod?.join(", ")}
- Training Frequency: ${data.TrainingFrequency}
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
{emoji} - {name} - {duration}  
{emoji} - {name} - {duration} 
Workout Focus:  
{muscle groups or body areas emphasized — e.g. Upper Body or Legs + Core}  
Main Exercises:  
{emoji} - {exercise name} - {reps OR duration} x {sets} sets - {rest time othrwise type 0} - {short clear instruction on how to perform it} - {estimated calories for that exercise}

Example:  
💪 - Push ups - 15 reps x 3 sets - 45 sec rest - Keep your back straight, lower to 90°, push up. - 100

Mindset Tip:  
{short motivational sentence related to goals or identity}  
Total Exercises: {count the exercises under "Main Exercises", be extremely carefull to coutn exaxlty the nmber fo exercises}  
Duration: {estimated session duration in minutes, e.g., 40 min}  
Calories: {sum of the calories for all exercises — just a number, no units}

--- RULES FOR FORMAT (STRICT) ---

- Use only this dash format: - between values, and x for reps/sets (no colons, asterisks, or other symbols).
- DO NOT write bullet points or markdown — plain text only.
- Each warm-up and each exercise must be on a new line.
- Always include sets, even for cardio or time-based exercises. (e.g. 🫁 - Run - 20 min x 1 set)
- Emojis:
  - 💪 = Upper Body
  - 🦵 = Legs
  - 🧘 = Mobility/Flexibility
  - 🧠 = Core
  - 🫁 = Cardio/Endurance
  - 😴 = Rest Day (if no workout)

- For rest days, use this:
Main Exercises:  
😴 - Rest Day - No resttime applicable

- For other forms like stretching or planks, use the same format:
🧘 - Plank hold - 1 min x 2 sets - 30 sec rest - Maintain straight line, engage core. - 60

- Focus on quality over quantity — 2 to 4 main exercises is typical.
- "Reps OR duration" means use either like "15 reps" or "2 min" — then follow with x 3 sets.

--- FORMAT RULES (STRICT) ---

- ✅ Use dashes ONLY in the following structure:
  {emoji} - {exercise name} - {reps or duration} x {sets} sets - {rest time} - {instructions} - {calories per one set}

- ❌ Never hyphenate exercise names (e.g., use "cat cow", NOT "cat-cow"; "push ups", NOT "push-ups").

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

- ❌ DO NOT use asterisks, bolding, quotes, or formatting — this is for machine parsing.

- ✅ If an exercise has no rest time, still include: - 0 sec rest

- ⚠️ If it's a rest day, use:
  Main Exercises:
  😴 - Rest Day - No resttime applicable

- In rest time section do it liek this:
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

  const result = await response.json();

  if (!result.reply) {
    console.error("❌ No response from OpenAI or serverless function:", result);
    throw new Error("No plan returned from backend.");
  }

  const generatedPlan = result.reply;

  // ✅ 4. Save to Supabase
  const { error: updateError } = await supabase
    .from("onboarding_responses")
    .update({ fitness_plan: generatedPlan })
    .eq("user_id", userId);

  if (updateError) {
    console.error("❌ Failed to save plan to Supabase:", updateError.message);
    throw new Error("Failed to save plan to Supabase.");
  }

  // ✅ 5. Return the plan
  return generatedPlan;
}
