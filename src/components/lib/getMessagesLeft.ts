import type { SupabaseClient } from "@supabase/supabase-js";

// Pass in the client from useSupabaseClientWithAuth().getClient() — hooks can't be called in here.
export async function getMessagesLeft(supabaseAuthClient: SupabaseClient, userId: string) {
  const { data, error } = await supabaseAuthClient
    .from("onboarding_responses")
    .select("messages_left")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching messages left:", error);
    return 0;
  }

  return data.messages_left;
}
