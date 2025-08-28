import { supabase } from "@/components/lib/supabaseClient";
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"

export async function decrementMessagesLeft(userId: string) {
  if (!userId) {
    console.error("User ID is required");
    return;
  }

  // Fetch current messages_left
      const { getClient } = useSupabaseClientWithAuth();
              const supabaseAuthClient = await getClient();
  const { data, error } = await supabaseAuthClient
    .from("onboarding_responses") // double-check table name here!
    .select("messages_left")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("Could not fetch onboarding record:", error);
    return;
  }

  const newCount = data.messages_left - 1;

  // Prevent going negative
  if (newCount < 0) {
    console.warn("No messages left");
    return;
  }

  // Update messages_left
  const { error: updateError } = await supabaseAuthClient
    .from("onboarding_responses")
    .update({ messages_left: newCount })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Failed to update messages_left:", updateError);
  }
}
