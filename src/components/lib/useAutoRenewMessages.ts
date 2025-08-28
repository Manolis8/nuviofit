import { useEffect, useState } from "react";
import { supabase } from "@/components/lib/supabaseClient";
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"

export function useAutoRenewMessages(userId: string) {
  const [lastResetAt, setLastResetAt] = useState<Date | null>(null);
      const { getClient } = useSupabaseClientWithAuth();

  useEffect(() => {
    async function fetchLastResetAt() {
              const supabaseAuthClient = await getClient();
      const { data, error } = await supabaseAuthClient
        .from("onboarding_responses")
        .select("last_reset_at")
        .eq("user_id", userId)
        .single();

      if (error) {
        setLastResetAt(null);
        return;
      }

      setLastResetAt(data?.last_reset_at ? new Date(data.last_reset_at) : null);
    }

    if (userId) fetchLastResetAt();
  }, [userId]);

  return { lastResetAt };
}
