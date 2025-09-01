import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient";

export function useMarkQuizCompleted() {
  const { getClient } = useSupabaseClientWithAuth();

  return async function markQuizCompleted(): Promise<void> {
    const supabaseAuthClient = await getClient();

    const {
      data: { user },
      error: userError,
    } = await supabaseAuthClient.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found or not authenticated");
    }

    const { error } = await supabaseAuthClient
      .from("onboarding_responses")
      .update({ quiz_completed: true })
      .eq("id", user.id);

    if (error) {
      throw new Error(`Failed to mark quiz as completed: ${error.message}`);
    }
  };
}
