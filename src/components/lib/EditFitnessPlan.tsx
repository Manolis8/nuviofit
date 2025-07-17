import { supabase } from "@/components/lib/supabaseClient";

export async function aiEditFitnessPlan(userId: string, currentPlan: string, userRequest: string): Promise<string> {

const prompt = `
You are a certified fitness coach, exercise scientist, and mindset mentor.  
You are NOT writing a new fitness plan from scratch.  
You are carefully EDITING the user's existing 7-day plan below based on their request.

--- CURRENT PLAN (DO NOT DESTROY THE STRUCTURE) ---
${currentPlan}

--- USER REQUEST / FEEDBACK ---
${userRequest}


--- INSTRUCTIONS (STRICT) ---
1️⃣ ALWAYS return the ENTIRE 7-day plan.
2️⃣ The days must ALWAYS stay the same:
- Day 1 = Monday
- Day 2 = Tuesday
- Day 3 = Wednesday
- Day 4 = Thursday
- Day 5 = Friday
- Day 6 = Saturday
- Day 7 = Sunday

3️⃣ NEVER delete or skip any day. Keep them all.
4️⃣ DO NOT change the structure:
- Each day must start with: "Day {number}: {Title} {emoji}"
- Include Warm-up, Workout Focus, Main Exercises, Mindset Tip, Total Exercises, Duration, Calories.

5️⃣ KEEP all formatting exactly the same:
- Do NOT use bullet points.
- Do NOT use markdown.
- Plain text only.
- Each Warm-up and Main Exercise must follow the original emoji <> exercise <> sets <> rest <> calories format.

6️⃣ ONLY make adjustments where necessary to reflect the user's request.
7️⃣ DO NOT change other days unless the request explicitly says so.
8️⃣ KEEP calories, sets, reps, rest times.

9️⃣ If you add new exercises, keep them within the same structure.
10️⃣ DO NOT add explanations or extra comments. Output ONLY the updated plan text.

EXAMPLES OF REQUEST:
- "Make Wednesday's cardio harder"
- "Add mobility on Saturday"
- "Swap push-ups for incline push-ups on Monday"

Be precise. Respect the original format fully.
Return only the clean updated text.
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
