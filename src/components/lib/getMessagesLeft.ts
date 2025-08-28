import { supabase } from "@/components/lib/supabaseClient";
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"

export async function getMessagesLeft(userId: string) {
      const { getClient } = useSupabaseClientWithAuth();
              const supabaseAuthClient = await getClient();
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
