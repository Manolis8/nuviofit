/**
 * Marks the current user's quiz as completed in the onboarding_responses table.
 */
export async function markQuizCompleted(supabaseAuthClient: any, user_id: string): Promise<void> {
  // Check if onboarding record exists
  const { data: onboardingData, error: fetchError } = await supabaseAuthClient
    .from("onboarding_responses")
    .select("id")
    .eq("user_id", user_id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`❌ Failed to fetch onboarding record: ${fetchError.message}`);
  }

  if (!onboardingData) {
    throw new Error("❌ No onboarding record found for this user.");
  }

  // Mark quiz as completed
  const { error: updateError } = await supabaseAuthClient
    .from("onboarding_responses")
    .update({ quiz_completed: true })
    .eq("user_id", user_id);

  if (updateError) {
    throw new Error(`❌ Failed to mark quiz as completed: ${updateError.message}`);
  }
}
