import { supabase } from "@/components/lib/supabaseClient";

export async function getMessagesLeft(userId: string) {
  const { data, error } = await supabase
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
