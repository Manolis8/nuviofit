import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient";

export function useMarkQuizCompleted() {
  const { getClient } = useSupabaseClientWithAuth();

  return async function markQuizCompleted(): Promise<void> {
    const supabaseAuthClient = await getClient();

    // Get the logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabaseAuthClient.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found or not authenticated");
    }

    // Update record by user_id (to match your select query)
    const { error } = await supabaseAuthClient
      .from("onboarding_responses")
      .update({ quiz_completed: true })
      .eq("user_id", user.id);

    if (error) {
      throw new Error(`Failed to mark quiz as completed: ${error.message}`);
    }
  };
}
