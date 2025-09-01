import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient";

/**
 * Hook to mark the current user's quiz as completed in the onboarding_responses table.
 */
export function useMarkQuizCompleted() {
  const { getClient } = useSupabaseClientWithAuth();

  return async function markQuizCompleted(): Promise<void> {
    const supabaseAuthClient = await getClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseAuthClient.auth.getUser();

    if (userError || !user) {
      throw new Error("❌ User not found or not authenticated");
    }

    const user_id = user.id;

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
  };
}
