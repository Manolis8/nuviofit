// src/lib/useSyncSupabaseAuth.ts
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { supabase } from "@/components/lib/supabaseClient";

export function useSyncSupabaseAuth() {
  const { getToken } = useAuth();

  useEffect(() => {
    const syncSession = async () => {
      const token = await getToken({ template: "supabase" });
      if (token) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: "", // Clerk handles refresh automatically
        });
      }
      console.log("Syncing Supabase token:", token); 
    };
    syncSession();
  }, [getToken]);
}
