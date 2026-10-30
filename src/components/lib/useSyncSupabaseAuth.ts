// src/lib/useSyncSupabaseAuth.ts
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { supabase } from "@/components/lib/supabaseClient";

export function useSyncSupabaseAuth() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const syncSession = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        if (token) {
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: "", // Clerk handles refresh automatically
          });
        }
      } catch (err) {
        console.warn("Could not sync Clerk session to Supabase:", err);
      }
    };
    syncSession();
  }, [getToken, isSignedIn]);
}
