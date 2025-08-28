import { supabase } from "@/components/lib/supabaseClient";
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"

const MAX_MESSAGES = 30

// Fetch or initialize quota, reset if month passed
export async function fetchUserQuota() {
      const { getClient } = useSupabaseClientWithAuth();
              const supabaseAuthClient = await getClient();
  const { data: { user } } = await supabaseAuthClient.auth.getUser()
  if (!user) throw new Error("No user logged in")

  let { data: quota, error } = await supabaseAuthClient
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!quota) {
    const now = new Date()
    const { error: insertError } = await supabaseAuthClient
      .from("onboarding_responses")
      .insert({
        user_id: user.id,
        messages_left: MAX_MESSAGES,
        reset_at: now.toISOString()
      })
    if (insertError) throw insertError

    quota = {
      user_id: user.id,
      messages_left: MAX_MESSAGES,
      reset_at: now.toISOString()
    }
  }

  // Reset quota if month passed
  const resetDate = new Date(quota.reset_at)
  const now = new Date()
  const oneMonthLater = new Date(resetDate)
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

  if (now > oneMonthLater) {
    const { error: updateError } = await supabaseAuthClient
      .from("onboarding_responses")
      .update({
        messages_left: MAX_MESSAGES,
        reset_at: now.toISOString()
      })
      .eq("user_id", user.id)
    if (updateError) throw updateError

    quota.messages_left = MAX_MESSAGES
    quota.reset_at = now.toISOString()
  }

  return quota
}

// Get message history from supabase (your table name might differ)
export async function fetchUserMessages() {
        const { getClient } = useSupabaseClientWithAuth();
                const supabaseAuthClient = await getClient();
  const { data: { user } } = await supabaseAuthClient.auth.getUser()
  if (!user) throw new Error("No user logged in")

  const { data: messages, error } = await supabaseAuthClient
    .from("onboarding_responses") // replace with your actual messages table name
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error) throw error

  // Parse or map messages as needed
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,  // e.g. 'user' or 'assistant'
    content: msg.content,
    createdAt: new Date(msg.created_at)
  }))
}

// Check if user can send a message (messages_left > 0)
export async function canSendMessage() {
  const quota = await fetchUserQuota()
  return quota.messages_left > 0
}

// Decrement message quota by 1, throw if no messages left
export async function sendMessageAndDecrement() {
        const { getClient } = useSupabaseClientWithAuth();
                  const supabaseAuthClient = await getClient();
  const { data: { user } } = await supabaseAuthClient.auth.getUser()
  if (!user) throw new Error("No user logged in")

  let { data: quota, error } = await supabaseAuthClient
    .from("onboarding_responses")
    .select("messages_left")
    .eq("user_id", user.id)
    .single()

  if (error) throw error
  if (!quota) throw new Error("User quota not found")

  if (quota.messages_left <= 0) {
    throw new Error("No messages left for this month")
  }

  const { error: updateError } = await supabaseAuthClient
    .from("onboarding_responses")
    .update({
      messages_left: quota.messages_left - 1
    })
    .eq("user_id", user.id)

  if (updateError) throw updateError

  return quota.messages_left - 1
}
