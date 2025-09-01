import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"

/**
 * Marks the current user's quiz as completed in the database.
 */
export async function markQuizCompleted(): Promise<void> {
    const { getClient } = useSupabaseClientWithAuth();
    const supabaseAuthClient = await getClient();
  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabaseAuthClient.auth.getUser();

  if (userError || !user) {
    throw new Error("User not found or not authenticated");
  }

  // Update the profile record
  const { error } = await supabaseAuthClient
    .from("onboarding_responses")
    .update({ quiz_completed: true })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Failed to mark quiz as completed: ${error.message}`);
  }
}
