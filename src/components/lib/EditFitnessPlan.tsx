import { supabase } from "@/components/lib/supabaseClient";

export async function aiEditFitnessPlan(userId: string, currentPlan: string, userRequest: string): Promise<string> {

const prompt = `
You are a certified fitness coach, exercise scientist, and mindset mentor. 
You are NOT writing a new fitness plan from scratch.  
You are carefully EDITING the user's existing 7-day fitness plan based on their requested changes.

--- CURRENT PLAN (DO NOT DESTROY THE STRUCTURE) ---
${currentPlan}

--- USER REQUEST / FEEDBACK ---
${userRequest}

--- INSTRUCTIONS (STRICT) ---

1️⃣ You MUST return the **full 7-day plan**.
2️⃣ Days MUST stay the same:
- Day 1 = Monday
- Day 2 = Tuesday
- Day 3 = Wednesday
- Day 4 = Thursday
- Day 5 = Friday
- Day 6 = Saturday
- Day 7 = Sunday

3️⃣ DO NOT change the structure. KEEP this format EXACTLY:

Day {number}: {Title and emoji}  
Warm-up:  
{emoji} <> {name} <> {duration}  
{emoji} <> {name} <> {duration}  
Workout Focus:  
{muscle groups or body areas emphasized}  
Main Exercises:  
{emoji} <> {exercise name} <> {reps OR duration} x {sets} sets <> {rest time otherwise type 0} <> {instruction} <> {calories}

Mindset Tip:  
{short motivational sentence}  
Total Exercises: {count}  
Duration: {minutes}  
Calories: {number}

4️⃣ KEEP emojis, sets, rest times, calories.
5️⃣ DO NOT skip Warm-up, Workout Focus, Main Exercises, Mindset Tip, Duration, Calories.

6️⃣ For REST days, always write:
Main Exercises:  
😴 <> Rest Day <> No resttime applicable

7️⃣ If Training Method includes:
- **Swimming:** Write laps, meters, intervals clearly as in the example.
- **Yoga / Pilates:** Use time-based flows or poses.
- **Rehab / Therapy:** Light mobility and stability.
- **Hiking:** Include time or distance.

FORMAT RULES (STRICT):
- ✅ Use "x" between reps and sets: 12 reps x 3 sets
- ✅ Emojis ONLY at:
  - Warm-up lines start
  - Exercise lines start
  - Day title line start

- ❌ NEVER put emojis inside instructions or calories.
- ❌ NEVER remove calories, sets, or rest time.
- ❌ NO bullets, NO markdown. Plain text only.

EXAMPLES OF REQUEST:
- "Add mobility on Saturday"
- "Make Wednesday harder cardio"
- "Swap push-ups for incline push-ups Monday"

Be precise. Respect the structure. Return the clean, updated 7-day plan only. No comments. No notes.
`;


  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful personal trainer." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
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
    console.error("❌ No reply from API:", result);
    throw new Error("No plan returned from backend.");
  }

  const updatedPlan = result.reply;

  // ✅ Save the updated plan to Supabase
  const { error: updateError } = await supabase
    .from("onboarding_responses")
    .upsert(
      {
        user_id: userId,
        fitness_plan: updatedPlan,
      },
      { onConflict: "user_id" }
    );

  if (updateError) {
    console.error("❌ Failed to save updated plan to Supabase:", updateError.message);
    throw new Error("Failed to save updated plan to Supabase.");
  }

  return updatedPlan;
}
