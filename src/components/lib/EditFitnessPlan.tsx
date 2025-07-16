import { supabase } from "@/components/lib/supabaseClient";

export async function aiEditFitnessPlan(userId: string, currentPlan: string, userRequest: string): Promise<string> {

  const prompt = `
You are a certified fitness coach, exercise scientist, and mindset mentor. 
You are NOT writing a new fitness plan from scratch.  
You are carefully EDITING the user's existing plan below based on their requested changes.

--- CURRENT PLAN (DO NOT DESTROY THE STRUCTURE) ---
${currentPlan}


--- USER REQUEST / FEEDBACK ---
${userRequest}


--- INSTRUCTIONS ---
Your job is ONLY to revise the CURRENT PLAN in small, thoughtful ways to reflect the USER REQUEST.

RULES:
- KEEP the structure EXACTLY the same (days, emojis, warm-up, workout focus, main exercises, mindset tips, counts, calories, formatting).
- DO NOT reformat or reword the structure.
- Only make adjustments where needed, otherwise leave it untouched.
- If the request mentions swapping exercises, swap only the relevant ones and keep the rest.
- NEVER remove: sets, rest time, calories, instructions, emojis, or any section headers.
- DO NOT re-write the entire plan unnecessarily.
- Ensure calories, sets, durations still make sense after editing.
- Output ONLY the updated fitness plan. No explanation, no notes. Just the clean plan text.

EXAMPLE REQUESTS:
- "I want more cardio on day 3"
- "Swap push-ups for incline push-ups"
- "Add mobility on day 5"
- "Reduce workout time by 10 min per day"
- "Make it harder, more advanced level"

Be precise. Respect the original structure and details.
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
